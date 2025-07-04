import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";
import { CrossIcon } from "@/components/icons";

interface MseVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

interface VideoSegment {
    index: number;
    data: Uint8Array;
    duration: number;
    timestamp: number;
}

interface PlayerState {
    isLoading: boolean;
    error: string | null;
    isPlaying: boolean;
    isPaused: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isFullscreen: boolean;
    bufferHealth: number;
    downloadProgress: number;
    downloadSpeed: number;
    connectedPeers: number;
}

interface StreamStats {
    segmentsBuffered: number;
    totalSegments: number;
    averageDownloadSpeed: number;
    bufferTime: number;
    droppedFrames: number;
}

// Configuración del MediaSource
const MSE_CONFIG = {
    mimeType: 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
    segmentDuration: 10, // 10 segundos por segmento
    bufferAhead: 3, // Mantener 3 segmentos buffereados
    maxBufferSize: 50 * 1024 * 1024, // 50MB máximo en buffer
};

class MSEStreamer {
    private mediaSource: MediaSource | null = null;
    private sourceBuffer: SourceBuffer | null = null;
    private video: HTMLVideoElement | null = null;
    private segments: Map<number, VideoSegment> = new Map();
    private isAppending: boolean = false;
    private appendQueue: VideoSegment[] = [];
    private onStateUpdate: (state: Partial<PlayerState>) => void;
    private onStatsUpdate: (stats: Partial<StreamStats>) => void;

    // Simulación de peers P2P (en implementación real sería WebRTC)
    private peers: Map<string, any> = new Map();
    private downloadStats = {
        bytesDownloaded: 0,
        startTime: Date.now(),
        speeds: [] as number[],
    };

    constructor(
        video: HTMLVideoElement,
        onStateUpdate: (state: Partial<PlayerState>) => void,
        onStatsUpdate: (stats: Partial<StreamStats>) => void
    ) {
        this.video = video;
        this.onStateUpdate = onStateUpdate;
        this.onStatsUpdate = onStatsUpdate;
    }

    async initialize(magnetLink: string): Promise<void> {
        try {
            this.onStateUpdate({ isLoading: true });

            // Verificar soporte MSE
            if (!window.MediaSource || !MediaSource.isTypeSupported(MSE_CONFIG.mimeType)) {
                throw new Error('MediaSource Extensions no compatible con este navegador');
            }

            // Crear MediaSource
            this.mediaSource = new MediaSource();
            if (!this.video) throw new Error('Video element no disponible');

            this.video.src = URL.createObjectURL(this.mediaSource);

            // Configurar eventos MediaSource
            this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen.bind(this));
            this.mediaSource.addEventListener('sourceended', this.handleSourceEnded.bind(this));
            this.mediaSource.addEventListener('sourceclose', this.handleSourceClose.bind(this));

            // Simular conexión P2P y descarga de segmentos
            await this.simulateP2PConnection(magnetLink);

        } catch (error) {
            console.error('Error inicializando MSE:', error);
            this.onStateUpdate({
                error: error instanceof Error ? error.message : 'Error desconocido',
                isLoading: false
            });
        }
    }

    private handleSourceOpen(): void {
        if (!this.mediaSource) return;

        try {
            // Crear SourceBuffer
            this.sourceBuffer = this.mediaSource.addSourceBuffer(MSE_CONFIG.mimeType);

            // Configurar eventos SourceBuffer
            this.sourceBuffer.addEventListener('updateend', this.handleUpdateEnd.bind(this));
            this.sourceBuffer.addEventListener('error', this.handleSourceBufferError.bind(this));
            this.sourceBuffer.addEventListener('abort', this.handleSourceBufferAbort.bind(this));

            this.onStateUpdate({ isLoading: false });

            // Comenzar descarga de segmentos
            this.startSegmentDownload();

        } catch (error) {
            console.error('Error configurando SourceBuffer:', error);
            this.onStateUpdate({
                error: 'Error configurando buffer de video',
                isLoading: false
            });
        }
    }

    private handleUpdateEnd(): void {
        this.isAppending = false;
        this.processAppendQueue();
        this.updateBufferStats();
    }

    private handleSourceBufferError(event: Event): void {
        console.error('SourceBuffer error:', event);
        this.onStateUpdate({ error: 'Error en buffer de video' });
    }

    private handleSourceBufferAbort(event: Event): void {
        console.error('SourceBuffer abort:', event);
        this.onStateUpdate({ error: 'Buffer de video interrumpido' });
    }

    private handleSourceEnded(): void {
        console.log('MediaSource ended');
    }

    private handleSourceClose(): void {
        console.log('MediaSource closed');
        this.cleanup();
    }

    private async simulateP2PConnection(magnetLink: string): Promise<void> {
        // Simular el proceso de conexión P2P
        this.onStateUpdate({
            downloadProgress: 0,
            connectedPeers: 0
        });

        // Extraer hash del magnet link
        const hashMatch = magnetLink.match(/xt=urn:btih:([a-fA-F0-9]{40})/);
        if (!hashMatch) {
            throw new Error('Magnet link inválido');
        }

        // Simular encontrar peers
        await this.simulateFindPeers();

        // Simular establecer conexiones
        await this.simulateEstablishConnections();
    }

    private async simulateFindPeers(): Promise<void> {
        return new Promise((resolve) => {
            let peersFound = 0;
            const maxPeers = 8;

            const findPeerInterval = setInterval(() => {
                peersFound += Math.floor(Math.random() * 3) + 1;
                if (peersFound > maxPeers) peersFound = maxPeers;

                this.onStateUpdate({ connectedPeers: peersFound });

                if (peersFound >= 3) { // Mínimo 3 peers para comenzar
                    clearInterval(findPeerInterval);
                    resolve();
                }
            }, 500);

            // Timeout después de 10 segundos
            setTimeout(() => {
                clearInterval(findPeerInterval);
                if (peersFound < 1) {
                    this.onStateUpdate({ error: 'No se pudieron encontrar peers' });
                } else {
                    resolve();
                }
            }, 10000);
        });
    }

    private async simulateEstablishConnections(): Promise<void> {
        // Simular establecimiento de conexiones WebRTC
        return new Promise((resolve) => {
            setTimeout(() => {
                // Crear conexiones simuladas
                for (let i = 0; i < 5; i++) {
                    this.peers.set(`peer-${i}`, {
                        id: `peer-${i}`,
                        speed: Math.random() * 1000 + 100, // KB/s
                        reliability: Math.random() * 0.5 + 0.5,
                    });
                }
                resolve();
            }, 1000);
        });
    }

    private startSegmentDownload(): void {
        // Simular descarga de segmentos de video
        this.downloadSegment(0);
    }

    private async downloadSegment(segmentIndex: number): Promise<void> {
        if (this.segments.has(segmentIndex)) return;

        try {
            // Simular descarga P2P del segmento
            const segmentData = await this.simulateSegmentDownload(segmentIndex);

            const segment: VideoSegment = {
                index: segmentIndex,
                data: segmentData,
                duration: MSE_CONFIG.segmentDuration,
                timestamp: segmentIndex * MSE_CONFIG.segmentDuration,
            };

            this.segments.set(segmentIndex, segment);
            this.appendToBuffer(segment);

            // Actualizar progreso
            const progress = (segmentIndex + 1) / 100; // Simular 100 segmentos totales
            this.onStateUpdate({ downloadProgress: Math.min(progress * 100, 100) });

            // Descargar siguiente segmento si es necesario
            if (segmentIndex < 99 && this.shouldDownloadNextSegment(segmentIndex)) {
                setTimeout(() => this.downloadSegment(segmentIndex + 1), 100);
            }

        } catch (error) {
            console.error(`Error descargando segmento ${segmentIndex}:`, error);
            // Intentar redescargar después de un delay
            setTimeout(() => this.downloadSegment(segmentIndex), 2000);
        }
    }

    private async simulateSegmentDownload(segmentIndex: number): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            // Simular tiempo de descarga variable
            const downloadTime = Math.random() * 2000 + 500; // 0.5-2.5 segundos

            setTimeout(() => {
                if (Math.random() > 0.95) { // 5% de probabilidad de error
                    reject(new Error(`Error descargando segmento ${segmentIndex}`));
                    return;
                }

                // Generar datos simulados de segmento (normalmente sería video real)
                const segmentSize = Math.floor(Math.random() * 500000) + 100000; // 100KB-600KB
                const data = new Uint8Array(segmentSize);

                // Llenar con datos simulados
                for (let i = 0; i < segmentSize; i++) {
                    data[i] = Math.floor(Math.random() * 256);
                }

                // Actualizar estadísticas de descarga
                this.updateDownloadStats(segmentSize, downloadTime);

                resolve(data);
            }, downloadTime);
        });
    }

    private shouldDownloadNextSegment(currentSegment: number): boolean {
        const bufferedSegments = this.segments.size;
        const targetBuffer = currentSegment + MSE_CONFIG.bufferAhead;
        return bufferedSegments < targetBuffer;
    }

    private appendToBuffer(segment: VideoSegment): void {
        if (!this.sourceBuffer || this.sourceBuffer.updating) {
            this.appendQueue.push(segment);
            return;
        }

        this.appendSegmentToBuffer(segment);
    }

    private appendSegmentToBuffer(segment: VideoSegment): void {
        if (!this.sourceBuffer || this.isAppending) return;

        try {
            this.isAppending = true;
            this.sourceBuffer.appendBuffer(segment.data);
        } catch (error) {
            console.error('Error appending segment:', error);
            this.isAppending = false;
            this.onStateUpdate({ error: 'Error agregando datos al buffer' });
        }
    }

    private processAppendQueue(): void {
        if (this.appendQueue.length === 0 || this.isAppending) return;

        const nextSegment = this.appendQueue.shift();
        if (nextSegment) {
            this.appendSegmentToBuffer(nextSegment);
        }
    }

    private updateDownloadStats(bytes: number, timeMs: number): void {
        this.downloadStats.bytesDownloaded += bytes;
        const speedKBps = (bytes / 1024) / (timeMs / 1000);
        this.downloadStats.speeds.push(speedKBps);

        // Mantener solo las últimas 10 mediciones
        if (this.downloadStats.speeds.length > 10) {
            this.downloadStats.speeds.shift();
        }

        const avgSpeed = this.downloadStats.speeds.reduce((a, b) => a + b, 0) / this.downloadStats.speeds.length;
        this.onStateUpdate({ downloadSpeed: Math.round(avgSpeed) });
    }

    private updateBufferStats(): void {
        if (!this.video) return;

        const buffered = this.video.buffered;
        let bufferTime = 0;

        if (buffered.length > 0) {
            const currentTime = this.video.currentTime;
            for (let i = 0; i < buffered.length; i++) {
                if (buffered.start(i) <= currentTime && buffered.end(i) > currentTime) {
                    bufferTime = buffered.end(i) - currentTime;
                    break;
                }
            }
        }

        const bufferHealth = this.video.duration > 0
            ? (bufferTime / this.video.duration) * 100
            : 0;

        this.onStateUpdate({ bufferHealth });
        this.onStatsUpdate({
            segmentsBuffered: this.segments.size,
            bufferTime,
            averageDownloadSpeed: this.downloadStats.speeds.length > 0
                ? this.downloadStats.speeds.reduce((a, b) => a + b, 0) / this.downloadStats.speeds.length
                : 0,
        });
    }

    cleanup(): void {
        if (this.sourceBuffer) {
            try {
                if (!this.sourceBuffer.updating) {
                    this.sourceBuffer.abort();
                }
            } catch (error) {
                console.error('Error cleaning up SourceBuffer:', error);
            }
        }

        if (this.mediaSource && this.mediaSource.readyState === 'open') {
            try {
                this.mediaSource.endOfStream();
            } catch (error) {
                console.error('Error ending MediaSource stream:', error);
            }
        }

        this.segments.clear();
        this.appendQueue = [];
        this.peers.clear();
    }

    destroy(): void {
        this.cleanup();

        if (this.video && this.video.src) {
            URL.revokeObjectURL(this.video.src);
            this.video.src = '';
        }
    }
}

export const MseVideoPlayer: React.FC<MseVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamerRef = useRef<MSEStreamer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [playerState, setPlayerState] = useState<PlayerState>({
        isLoading: true,
        error: null,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        isMuted: false,
        isFullscreen: false,
        bufferHealth: 0,
        downloadProgress: 0,
        downloadSpeed: 0,
        connectedPeers: 0,
    });

    const [streamStats, setStreamStats] = useState<StreamStats>({
        segmentsBuffered: 0,
        totalSegments: 100,
        averageDownloadSpeed: 0,
        bufferTime: 0,
        droppedFrames: 0,
    });

    const [magnetLink, setMagnetLink] = useState<string>("");
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Generar magnet link
    useEffect(() => {
        const result = generateMagnetLink(torrent, movieTitle);
        if (result.error) {
            setPlayerState(prev => ({ ...prev, error: result.error }));
        } else {
            setMagnetLink(result.data);
        }
    }, [torrent, movieTitle]);

    // Ocultar controles automáticamente
    useEffect(() => {
        const resetControlsTimeout = () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            setShowControls(true);
            controlsTimeoutRef.current = setTimeout(() => {
                if (playerState.isPlaying && !playerState.isPaused) {
                    setShowControls(false);
                }
            }, 3000);
        };

        const handleMouseMove = () => resetControlsTimeout();
        const handleKeyPress = () => resetControlsTimeout();

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyPress);
        resetControlsTimeout();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyPress);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [playerState.isPlaying, playerState.isPaused]);

    // Inicializar MSE Streamer
    useEffect(() => {
        if (!videoRef.current || !magnetLink) return;

        const video = videoRef.current;
        const streamer = new MSEStreamer(
            video,
            (state) => setPlayerState(prev => ({ ...prev, ...state })),
            (stats) => setStreamStats(prev => ({ ...prev, ...stats }))
        );

        streamerRef.current = streamer;
        streamer.initialize(magnetLink);

        return () => {
            streamer.destroy();
        };
    }, [magnetLink]);

    // Event listeners del video
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updatePlayerState = () => {
            setPlayerState(prev => ({
                ...prev,
                currentTime: video.currentTime,
                duration: video.duration || 0,
                isPaused: video.paused,
                volume: video.volume,
                isMuted: video.muted,
            }));
        };

        video.addEventListener('loadedmetadata', updatePlayerState);
        video.addEventListener('timeupdate', updatePlayerState);
        video.addEventListener('volumechange', updatePlayerState);
        video.addEventListener('play', () => setPlayerState(prev => ({ ...prev, isPlaying: true })));
        video.addEventListener('pause', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
        video.addEventListener('ended', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
        video.addEventListener('waiting', () => setPlayerState(prev => ({ ...prev, isLoading: true })));
        video.addEventListener('canplay', () => setPlayerState(prev => ({ ...prev, isLoading: false })));

        return () => {
            video.removeEventListener('loadedmetadata', updatePlayerState);
            video.removeEventListener('timeupdate', updatePlayerState);
            video.removeEventListener('volumechange', updatePlayerState);
            video.removeEventListener('play', () => setPlayerState(prev => ({ ...prev, isPlaying: true })));
            video.removeEventListener('pause', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
            video.removeEventListener('ended', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
            video.removeEventListener('waiting', () => setPlayerState(prev => ({ ...prev, isLoading: true })));
            video.removeEventListener('canplay', () => setPlayerState(prev => ({ ...prev, isLoading: false })));
        };
    }, []);

    // Controles del reproductor
    const handlePlayPause = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(console.error);
        } else {
            video.pause();
        }
    }, []);

    const handleSeek = useCallback((time: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = time;
    }, []);

    const handleVolumeChange = useCallback((volume: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = volume;
    }, []);

    const handleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
    }, []);

    const handleFullscreen = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(console.error);
            setPlayerState(prev => ({ ...prev, isFullscreen: true }));
        } else {
            document.exitFullscreen().catch(console.error);
            setPlayerState(prev => ({ ...prev, isFullscreen: false }));
        }
    }, []);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    if (playerState.error) {
        return (
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{movieTitle}</h3>
                        <p className="text-sm text-red-500">Error en MSE Player</p>
                    </div>
                    {onClose && (
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={onClose}
                            aria-label="Cerrar reproductor"
                        >
                            <CrossIcon />
                        </Button>
                    )}
                </CardHeader>
                <CardBody>
                    <div className="text-center py-8">
                        <Chip color="danger" variant="flat" className="mb-4">
                            Error
                        </Chip>
                        <p className="text-sm mb-4">{playerState.error}</p>
                        <Button variant="flat" onPress={() => window.location.reload()}>
                            Reintentar
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full ${playerState.isFullscreen ? 'h-screen' : 'h-auto'} bg-black rounded-lg overflow-hidden`}
        >
            <video
                ref={videoRef}
                className="w-full h-auto max-h-[70vh]"
                poster="/placeholder-video.jpg"
                playsInline
                preload="metadata"
            />

            {playerState.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-center">
                        <Spinner size="lg" color="primary" />
                        <p className="mt-2 text-white">Conectando peers P2P...</p>
                        <p className="text-sm text-white/70">
                            Peers: {playerState.connectedPeers} |
                            Progreso: {Math.round(playerState.downloadProgress)}%
                        </p>
                    </div>
                </div>
            )}

            {/* Controles del reproductor */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                onMouseEnter={() => setShowControls(true)}
            >
                {/* Barra de progreso */}
                <div className="mb-4">
                    <input
                        type="range"
                        min={0}
                        max={playerState.duration}
                        value={playerState.currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #006fee 0%, #006fee ${(playerState.currentTime / playerState.duration) * 100}%, rgba(255,255,255,0.2) ${(playerState.currentTime / playerState.duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-white mt-1">
                        <span>{formatTime(playerState.currentTime)}</span>
                        <span>{formatTime(playerState.duration)}</span>
                    </div>
                </div>

                {/* Controles principales */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={handlePlayPause}
                            className="text-white"
                        >
                            {playerState.isPlaying && !playerState.isPaused ? "⏸️" : "▶️"}
                        </Button>

                        <Button
                            isIconOnly
                            variant="light"
                            onPress={handleMute}
                            className="text-white"
                        >
                            {playerState.isMuted ? "🔇" : "🔊"}
                        </Button>

                        <div className="w-20">
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={playerState.volume}
                                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #ffffff 0%, #ffffff ${playerState.volume * 100}%, rgba(255,255,255,0.2) ${playerState.volume * 100}%, rgba(255,255,255,0.2) 100%)`
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Chip size="sm" variant="flat" className="text-white bg-white/10">
                            MSE P2P
                        </Chip>

                        <Button
                            isIconOnly
                            variant="light"
                            onPress={handleFullscreen}
                            className="text-white"
                        >
                            {playerState.isFullscreen ? "⛶" : "⛶"}
                        </Button>

                        {onClose && (
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={onClose}
                                className="text-white"
                            >
                                <CrossIcon />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Estadísticas P2P */}
                <div className="mt-2 flex justify-between items-center text-xs text-white/70">
                    <div>
                        Peers: {playerState.connectedPeers} |
                        Velocidad: {playerState.downloadSpeed} KB/s |
                        Buffer: {Math.round(playerState.bufferHealth)}%
                    </div>
                    <div>
                        Segmentos: {streamStats.segmentsBuffered}/{streamStats.totalSegments} |
                        Descarga: {Math.round(playerState.downloadProgress)}%
                    </div>
                </div>
            </div>

            {/* Header con información */}
            {showControls && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-black/50 to-transparent p-4">
                    <h3 className="text-white text-lg font-semibold">{movieTitle}</h3>
                    <p className="text-white/70 text-sm">MSE P2P Stream Player</p>
                </div>
            )}
        </div>
    );
};
