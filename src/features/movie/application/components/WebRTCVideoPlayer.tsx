import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";
import { CrossIcon } from "@/components/icons";

interface WebRTCVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

interface PeerConnection {
    id: string;
    connection: RTCPeerConnection;
    dataChannel?: RTCDataChannel;
    isConnected: boolean;
}

interface VideoChunk {
    index: number;
    data: ArrayBuffer;
    size: number;
}

interface PlayerState {
    isLoading: boolean;
    error: string | null;
    isPlaying: boolean;
    connectionStatus: string;
    videoUrl: string | null;
    magnetLink: string;
    downloadProgress: number;
    totalChunks: number;
    downloadedChunks: number;
}

interface StatsState {
    downloadSpeed: number;
    connectedPeers: number;
    totalPeers: number;
    bufferHealth: number;
}

// Configuración WebRTC
const WEBRTC_CONFIG: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        {
            urls: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        }
    ],
    iceCandidatePoolSize: 10,
};

// Tamaño de chunk para transferencia
const CHUNK_SIZE = 64 * 1024; // 64KB por chunk
const BUFFER_CHUNKS = 50; // Chunks a mantener en buffer

class WebRTCVideoStreamer {
    private peers: Map<string, PeerConnection> = new Map();
    private videoChunks: Map<number, VideoChunk> = new Map();
    private signaling: WebSocket | null = null;
    private magnetHash: string = '';
    private onStateUpdate: (state: Partial<PlayerState>) => void;
    private onStatsUpdate: (stats: Partial<StatsState>) => void;
    private downloadStartTime: number = 0;
    private totalBytes: number = 0;
    private downloadedBytes: number = 0;

    constructor(
        onStateUpdate: (state: Partial<PlayerState>) => void,
        onStatsUpdate: (stats: Partial<StatsState>) => void
    ) {
        this.onStateUpdate = onStateUpdate;
        this.onStatsUpdate = onStatsUpdate;
    }

    async initialize(magnetLink: string): Promise<void> {
        try {
            // Extraer hash del magnet link
            const hashMatch = magnetLink.match(/xt=urn:btih:([a-fA-F0-9]{40})/);
            if (!hashMatch) {
                throw new Error('Hash del torrent no válido');
            }
            this.magnetHash = hashMatch[1];

            this.onStateUpdate({ connectionStatus: 'Conectando a servidor de señalización...' });

            // Conectar al servidor de señalización
            await this.connectToSignalingServer();

            this.onStateUpdate({ connectionStatus: 'Buscando peers...' });

            // Anunciar que queremos este archivo
            this.announceFile();

        } catch (error) {
            throw new Error(`Error al inicializar WebRTC: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    private async connectToSignalingServer(): Promise<void> {
        return new Promise((resolve, reject) => {
            // URLs de servidores de señalización (en orden de preferencia)
            const signalingUrls = [
                'ws://localhost:8080', // Desarrollo local
                'wss://webrtc-signaling-demo.herokuapp.com', // Servidor demo
                // Agregar tu servidor de producción aquí
            ];

            let currentUrlIndex = 0;

            const tryConnect = () => {
                if (currentUrlIndex >= signalingUrls.length) {
                    reject(new Error('No se pudo conectar a ningún servidor de señalización'));
                    return;
                }

                const url = signalingUrls[currentUrlIndex];
                this.onStateUpdate({ connectionStatus: `Conectando a ${url}...` });

                this.signaling = new WebSocket(url);

                this.signaling.onopen = () => {
                    this.onStateUpdate({ connectionStatus: 'Conectado al servidor de señalización' });
                    resolve();
                };

                this.signaling.onerror = () => {
                    currentUrlIndex++;
                    if (currentUrlIndex < signalingUrls.length) {
                        setTimeout(tryConnect, 1000); // Esperar 1 segundo antes del siguiente intento
                    } else {
                        reject(new Error('No hay servidores de señalización disponibles'));
                    }
                };

                this.signaling.onmessage = (event) => {
                    this.handleSignalingMessage(JSON.parse(event.data));
                };

                this.signaling.onclose = () => {
                    this.onStateUpdate({ connectionStatus: 'Conexión perdida con servidor de señalización' });
                };
            };

            tryConnect();

            // Timeout después de 15 segundos
            setTimeout(() => {
                if (this.signaling?.readyState !== WebSocket.OPEN) {
                    reject(new Error('Timeout al conectar al servidor de señalización'));
                }
            }, 15000);
        });
    }

    private announceFile(): void {
        if (!this.signaling || this.signaling.readyState !== WebSocket.OPEN) {
            return;
        }

        this.signaling.send(JSON.stringify({
            type: 'announce',
            hash: this.magnetHash,
            peerId: this.generatePeerId()
        }));
    }

    private handleSignalingMessage(message: any): void {
        switch (message.type) {
            case 'peer-list':
                this.handlePeerList(message.peers);
                break;
            case 'offer':
                this.handleOffer(message);
                break;
            case 'answer':
                this.handleAnswer(message);
                break;
            case 'ice-candidate':
                this.handleIceCandidate(message);
                break;
        }
    }

    private async handlePeerList(peers: string[]): Promise<void> {
        this.onStatsUpdate({ totalPeers: peers.length });

        // Conectar a los primeros 5 peers
        const peersToConnect = peers.slice(0, 5);

        for (const peerId of peersToConnect) {
            await this.connectToPeer(peerId);
        }
    }

    private async connectToPeer(peerId: string): Promise<void> {
        const peerConnection = new RTCPeerConnection(WEBRTC_CONFIG);
        const dataChannel = peerConnection.createDataChannel('fileTransfer', {
            ordered: true,
            maxPacketLifeTime: 3000
        });

        const peer: PeerConnection = {
            id: peerId,
            connection: peerConnection,
            dataChannel,
            isConnected: false
        };

        this.setupPeerConnection(peer);
        this.peers.set(peerId, peer);

        // Crear offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Enviar offer a través del servidor de señalización
        this.signaling?.send(JSON.stringify({
            type: 'offer',
            targetPeer: peerId,
            offer: offer,
            fromPeer: this.generatePeerId()
        }));
    }

    private setupPeerConnection(peer: PeerConnection): void {
        const { connection, dataChannel } = peer;

        // Manejar cambios de estado de conexión
        connection.onconnectionstatechange = () => {
            if (connection.connectionState === 'connected') {
                peer.isConnected = true;
                this.updateConnectedPeersCount();
                this.onStateUpdate({ connectionStatus: `Conectado a ${this.getConnectedPeersCount()} peers` });
            } else if (connection.connectionState === 'disconnected' || connection.connectionState === 'failed') {
                peer.isConnected = false;
                this.updateConnectedPeersCount();
                this.peers.delete(peer.id);
            }
        };

        // Manejar mensajes del data channel
        if (dataChannel) {
            dataChannel.onopen = () => {
                // Solicitar metadatos del archivo
                dataChannel.send(JSON.stringify({
                    type: 'request-metadata',
                    hash: this.magnetHash
                }));
            };

            dataChannel.onmessage = (event) => {
                this.handleDataChannelMessage(event.data, peer);
            };
        }

        // Manejar candidatos ICE
        connection.onicecandidate = (event) => {
            if (event.candidate) {
                this.signaling?.send(JSON.stringify({
                    type: 'ice-candidate',
                    targetPeer: peer.id,
                    candidate: event.candidate,
                    fromPeer: this.generatePeerId()
                }));
            }
        };
    }

    private handleDataChannelMessage(data: any, peer: PeerConnection): void {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'metadata':
                    this.handleMetadata(message);
                    break;
                case 'chunk':
                    this.handleChunk(message, peer);
                    break;
                case 'chunk-not-available':
                    this.handleChunkNotAvailable(message, peer);
                    break;
            }
        } catch (error) {
            // Probablemente datos binarios de chunk
            this.handleBinaryChunk(data, peer);
        }
    }

    private handleMetadata(metadata: any): void {
        this.totalBytes = metadata.size;
        const totalChunks = Math.ceil(this.totalBytes / CHUNK_SIZE);

        this.onStateUpdate({
            totalChunks,
            connectionStatus: `Archivo encontrado: ${this.formatBytes(this.totalBytes)}`
        });

        // Comenzar a solicitar chunks
        this.startDownload();
    }

    private startDownload(): void {
        this.downloadStartTime = Date.now();
        this.onStateUpdate({ connectionStatus: 'Iniciando descarga...' });

        // Solicitar los primeros chunks
        this.requestNextChunks();
    }

    private requestNextChunks(): void {
        const connectedPeers = Array.from(this.peers.values()).filter(p => p.isConnected);
        if (connectedPeers.length === 0) return;

        // Solicitar chunks que no tenemos
        const chunksNeeded = this.getNeededChunks();
        const chunksPerPeer = Math.ceil(chunksNeeded.length / connectedPeers.length);

        connectedPeers.forEach((peer, index) => {
            const startIndex = index * chunksPerPeer;
            const endIndex = Math.min(startIndex + chunksPerPeer, chunksNeeded.length);
            const peerChunks = chunksNeeded.slice(startIndex, endIndex);

            peerChunks.forEach(chunkIndex => {
                this.requestChunk(chunkIndex, peer);
            });
        });
    }

    private getNeededChunks(): number[] {
        const totalChunks = Math.ceil(this.totalBytes / CHUNK_SIZE);
        const needed: number[] = [];

        for (let i = 0; i < Math.min(totalChunks, BUFFER_CHUNKS); i++) {
            if (!this.videoChunks.has(i)) {
                needed.push(i);
            }
        }

        return needed;
    }

    private requestChunk(chunkIndex: number, peer: PeerConnection): void {
        if (!peer.dataChannel || peer.dataChannel.readyState !== 'open') return;

        peer.dataChannel.send(JSON.stringify({
            type: 'request-chunk',
            hash: this.magnetHash,
            chunkIndex: chunkIndex
        }));
    }

    private handleChunk(message: any, _peer: PeerConnection): void {
        const chunk: VideoChunk = {
            index: message.chunkIndex,
            data: message.data,
            size: message.size
        };

        this.videoChunks.set(chunk.index, chunk);
        this.downloadedBytes += chunk.size;

        this.updateProgress();
        this.updateDownloadSpeed();

        // Si tenemos suficientes chunks, crear el video
        if (this.videoChunks.size >= 10 && !this.hasVideoUrl()) {
            this.createVideoFromChunks();
        }

        // Solicitar más chunks si es necesario
        if (this.getNeededChunks().length > 0) {
            setTimeout(() => this.requestNextChunks(), 100);
        }
    }

    private createVideoFromChunks(): void {
        try {
            // Combinar chunks en orden
            const sortedChunks = Array.from(this.videoChunks.entries())
                .sort(([a], [b]) => a - b)
                .map(([, chunk]) => chunk.data);

            // Crear blob del video
            const videoBlob = new Blob(sortedChunks, { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(videoBlob);

            this.onStateUpdate({
                videoUrl,
                isLoading: false,
                connectionStatus: 'Video listo para reproducir'
            });

        } catch (error) {
            this.onStateUpdate({
                error: `Error al crear video: ${error instanceof Error ? error.message : 'Error desconocido'}`
            });
        }
    }

    private updateProgress(): void {
        const progress = this.totalBytes > 0 ? (this.downloadedBytes / this.totalBytes) * 100 : 0;
        const downloadedChunks = this.videoChunks.size;

        this.onStateUpdate({
            downloadProgress: progress,
            downloadedChunks
        });
    }

    private updateDownloadSpeed(): void {
        const elapsed = (Date.now() - this.downloadStartTime) / 1000;
        const speed = elapsed > 0 ? this.downloadedBytes / elapsed : 0;

        this.onStatsUpdate({
            downloadSpeed: speed,
            bufferHealth: this.calculateBufferHealth()
        });
    }

    private calculateBufferHealth(): number {
        // Porcentaje de chunks disponibles para reproducción
        const availableChunks = this.videoChunks.size;
        const neededForPlayback = Math.min(20, Math.ceil(this.totalBytes / CHUNK_SIZE));
        return Math.min(100, (availableChunks / neededForPlayback) * 100);
    }

    private updateConnectedPeersCount(): void {
        const connectedCount = this.getConnectedPeersCount();
        this.onStatsUpdate({ connectedPeers: connectedCount });
    }

    private getConnectedPeersCount(): number {
        return Array.from(this.peers.values()).filter(p => p.isConnected).length;
    }

    private hasVideoUrl(): boolean {
        // Verificar si ya tenemos una URL de video creada
        return false; // Implementar lógica según el estado
    }

    private generatePeerId(): string {
        return Math.random().toString(36).substring(7);
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Métodos de manejo de señalización restantes
    private async handleOffer(message: any): Promise<void> {
        // Crear nueva conexión peer para responder al offer
        const peerConnection = new RTCPeerConnection(WEBRTC_CONFIG);
        const peer: PeerConnection = {
            id: message.fromPeer,
            connection: peerConnection,
            isConnected: false
        };

        this.setupPeerConnection(peer);
        this.peers.set(message.fromPeer, peer);

        // Configurar data channel para recibir datos
        peerConnection.ondatachannel = (event) => {
            peer.dataChannel = event.channel;
            peer.dataChannel.onmessage = (msgEvent) => {
                this.handleDataChannelMessage(msgEvent.data, peer);
            };
        };

        // Responder al offer
        await peerConnection.setRemoteDescription(message.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        this.signaling?.send(JSON.stringify({
            type: 'answer',
            targetPeer: message.fromPeer,
            answer: answer,
            fromPeer: this.generatePeerId()
        }));
    }

    private async handleAnswer(message: any): Promise<void> {
        const peer = this.peers.get(message.fromPeer);
        if (!peer) return;

        await peer.connection.setRemoteDescription(message.answer);
    }

    private handleIceCandidate(message: any): void {
        const peer = this.peers.get(message.fromPeer);
        if (!peer) return;

        peer.connection.addIceCandidate(message.candidate);
    }

    private handleChunkNotAvailable(_message: any, _peer: PeerConnection): void {
        // El peer no tiene el chunk solicitado
        // Podríamos solicitar a otro peer o marcar como no disponible
        console.log('Chunk no disponible en peer');
    }

    private handleBinaryChunk(_data: any, _peer: PeerConnection): void {
        // Manejar datos binarios directos de chunks
        // Esto sería para una implementación más optimizada
        console.log('Recibido chunk binario');
    }

    destroy(): void {
        // Limpiar conexiones
        this.peers.forEach(peer => {
            peer.connection.close();
        });
        this.peers.clear();

        if (this.signaling) {
            this.signaling.close();
        }

        // Limpiar URLs de objeto
        this.videoChunks.clear();
    }
}

export const WebRTCVideoPlayer: React.FC<WebRTCVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamerRef = useRef<WebRTCVideoStreamer | null>(null);

    const [playerState, setPlayerState] = useState<PlayerState>({
        isLoading: true,
        error: null,
        isPlaying: false,
        connectionStatus: "Inicializando WebRTC...",
        videoUrl: null,
        magnetLink: "",
        downloadProgress: 0,
        totalChunks: 0,
        downloadedChunks: 0,
    });

    const [stats, setStats] = useState<StatsState>({
        downloadSpeed: 0,
        connectedPeers: 0,
        totalPeers: 0,
        bufferHealth: 0,
    });

    const updatePlayerState = useCallback((updates: Partial<PlayerState>) => {
        setPlayerState(prev => ({ ...prev, ...updates }));
    }, []);

    const updateStats = useCallback((updates: Partial<StatsState>) => {
        setStats(prev => ({ ...prev, ...updates }));
    }, []);

    useEffect(() => {
        const initWebRTCStreaming = async () => {
            try {
                // Validar datos de entrada
                if (!torrent) {
                    updatePlayerState({
                        error: "No se proporcionó información del torrent",
                        isLoading: false,
                    });
                    return;
                }

                if (!movieTitle || movieTitle.trim().length === 0) {
                    updatePlayerState({
                        error: "No se proporcionó el título de la película",
                        isLoading: false,
                    });
                    return;
                }

                updatePlayerState({ connectionStatus: "Generando enlace magnet..." });

                // Generar enlace magnet
                const magnetResult = generateMagnetLink(torrent, movieTitle);
                if (magnetResult.error) {
                    updatePlayerState({
                        error: `Error al generar enlace magnet: ${magnetResult.error}`,
                        isLoading: false,
                    });
                    return;
                }

                updatePlayerState({
                    magnetLink: magnetResult.data,
                    connectionStatus: "Inicializando streaming WebRTC..."
                });

                // Inicializar el streamer WebRTC
                streamerRef.current = new WebRTCVideoStreamer(updatePlayerState, updateStats);
                await streamerRef.current.initialize(magnetResult.data);

            } catch (error: any) {
                updatePlayerState({
                    error: `Error de WebRTC: ${error.message}`,
                    isLoading: false,
                });
            }
        };

        initWebRTCStreaming();

        return () => {
            if (streamerRef.current) {
                streamerRef.current.destroy();
            }
            if (playerState.videoUrl) {
                URL.revokeObjectURL(playerState.videoUrl);
            }
        };
    }, [torrent, movieTitle, updatePlayerState, updateStats]);

    // Actualizar video src cuando tengamos URL
    useEffect(() => {
        if (playerState.videoUrl && videoRef.current) {
            videoRef.current.src = playerState.videoUrl;
        }
    }, [playerState.videoUrl]);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const retryConnection = () => {
        updatePlayerState({ error: null, isLoading: true });
        // Re-ejecutar el efecto
        window.location.reload();
    };

    const handlePlay = () => updatePlayerState({ isPlaying: true });
    const handlePause = () => updatePlayerState({ isPlaying: false });

    if (playerState.error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <h3 className="text-xl font-bold">Error en WebRTC Streaming</h3>
                </CardHeader>
                <CardBody>
                    <p className="text-sm mt-2 text-danger">{playerState.error}</p>
                    <p className="text-xs mt-2 text-gray-500">
                        WebRTC requiere navegadores modernos y servidor de señalización activo
                    </p>
                </CardBody>
                <CardFooter className="flex gap-2 justify-center">
                    <Button color="primary" onPress={retryConnection}>
                        Reintentar
                    </Button>
                    {onClose && (
                        <Button
                            variant="light"
                            endContent={<CrossIcon size={20} />}
                            color="secondary"
                            onPress={onClose}
                        >
                            Cerrar
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardBody className="p-0">
                <div className="relative bg-black aspect-video">
                    {playerState.isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
                            <div className="text-center text-white max-w-md">
                                <Spinner size="lg" color="primary" />
                                <div className="mt-4">
                                    <Progress
                                        value={playerState.downloadProgress}
                                        color="primary"
                                        className="w-full"
                                    />
                                </div>
                                <p className="text-xs mt-2">
                                    {playerState.downloadProgress.toFixed(1)}% - {" "}
                                    {formatBytes(stats.downloadSpeed)}/s
                                </p>
                                <p className="text-xs mt-1">
                                    Chunks: {playerState.downloadedChunks}/{playerState.totalChunks}
                                </p>
                            </div>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className="w-full h-full"
                        controls
                        preload="metadata"
                        onPlay={handlePlay}
                        onPause={handlePause}
                    />
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 flex-wrap items-center">
                            <Chip color="primary" variant="flat">
                                WebRTC Streaming
                            </Chip>
                            <Chip color="secondary" variant="flat">
                                {torrent.quality}
                            </Chip>
                            <Chip color="success" variant="flat">
                                {torrent.size}
                            </Chip>
                            {playerState.isPlaying && (
                                <Chip color="success" variant="flat">
                                    ▶ Reproduciendo
                                </Chip>
                            )}
                        </div>
                        {onClose && (
                            <Button
                                endContent={<CrossIcon size={20} />}
                                color="danger"
                                variant="light"
                                size="sm"
                                onPress={onClose}
                            >
                                Cerrar
                            </Button>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {playerState.connectionStatus}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progreso de Descarga</span>
                            <span>{playerState.downloadProgress.toFixed(1)}%</span>
                        </div>
                        <Progress
                            size="sm"
                            value={playerState.downloadProgress}
                            color="primary"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Salud del Buffer</span>
                            <span>{stats.bufferHealth.toFixed(1)}%</span>
                        </div>
                        <Progress
                            size="sm"
                            value={stats.bufferHealth}
                            color={stats.bufferHealth > 70 ? "success" : stats.bufferHealth > 30 ? "warning" : "danger"}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">⬇️ Velocidad</p>
                            <p className="font-medium text-sm">
                                {formatBytes(stats.downloadSpeed)}/s
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">👥 Peers</p>
                            <p className="font-medium text-sm">
                                {stats.connectedPeers}/{stats.totalPeers}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">📦 Chunks</p>
                            <p className="font-medium text-sm">
                                {playerState.downloadedChunks}/{playerState.totalChunks}
                            </p>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
                        <p>
                            ⚡ <strong>WebRTC P2P Streaming</strong> - Transferencia directa entre peers
                        </p>
                        <p>🔄 Streaming progresivo sin servidores centrales</p>
                        <p>🌐 Requiere servidor de señalización para descubrimiento</p>
                        <p>🔒 Conexión cifrada extremo a extremo</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
