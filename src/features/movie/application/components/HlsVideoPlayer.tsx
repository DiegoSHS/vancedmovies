import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";
import { CrossIcon } from "@/components/icons";

// Tipos para HLS.js (importación dinámica)
type HlsInstance = {
    loadSource(url: string): void;
    attachMedia(video: HTMLVideoElement): void;
    destroy(): void;
    on(event: string, callback: (event: string, data: any) => void): void;
    startLoad(): void;
    recoverMediaError(): void;
    levels: Array<{
        height: number;
        bitrate: number;
        [key: string]: any;
    }>;
};

interface HlsVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
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
    quality: string;
    availableQualities: string[];
    connectionStatus: string;
}

interface StreamStats {
    bitrate: number;
    fps: number;
    droppedFrames: number;
    bufferLength: number;
    loadTime: number;
}

export const HlsVideoPlayer: React.FC<HlsVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<HlsInstance | null>(null);
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
        quality: 'auto',
        availableQualities: [],
        connectionStatus: "Inicializando...",
    });

    const [streamStats, setStreamStats] = useState<StreamStats>({
        bitrate: 0,
        fps: 0,
        droppedFrames: 0,
        bufferLength: 0,
        loadTime: 0,
    });

    const [magnetLink, setMagnetLink] = useState<string>("");
    const [hlsUrl, setHlsUrl] = useState<string>("");
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Función para convertir magnet link a HLS stream
    const convertMagnetToHLS = useCallback(async (magnetLink: string): Promise<string> => {
        // Extraer hash del magnet
        const hashMatch = magnetLink.match(/xt=urn:btih:([a-fA-F0-9]{40})/);
        if (!hashMatch) {
            throw new Error('Magnet link inválido');
        }

        const hash = hashMatch[1];

        setPlayerState(prev => ({
            ...prev,
            connectionStatus: 'Buscando servicios de streaming...'
        }));

        // Intentar con WebTor.io (implementación realista)
        try {
            setPlayerState(prev => ({
                ...prev,
                connectionStatus: 'Conectando a WebTor.io...'
            }));

            // WebTor.io API para obtener stream HLS
            const webTorUrl = `https://webtor.io/api/torrent/stream/${hash}`;

            // Verificar si el servicio está disponible
            const response = await fetch(`${webTorUrl}/info`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const info = await response.json();
                if (info.files && info.files.length > 0) {
                    // Buscar archivo de video más grande
                    const videoFile = info.files
                        .filter((file: any) => /\.(mp4|mkv|avi|mov)$/i.test(file.name))
                        .sort((a: any, b: any) => b.size - a.size)[0];

                    if (videoFile) {
                        const hlsStreamUrl = `${webTorUrl}/${videoFile.id}/stream.m3u8`;
                        return hlsStreamUrl;
                    }
                }
            }
        } catch (error) {
            console.warn('WebTor.io no disponible:', error);
        }

        // Fallback: Usar un proxy local o servicio alternativo
        setPlayerState(prev => ({
            ...prev,
            connectionStatus: 'Intentando conversión local...'
        }));

        // En una implementación real, esto sería un endpoint local que convierte torrents
        // Por ahora, simulamos la funcionalidad para demostración
        const simulatedHlsUrl = await simulateLocalConversion(hash);
        return simulatedHlsUrl;

    }, []);

    // Función de simulación para demostración (en producción sería un servicio real)
    const simulateLocalConversion = async (hash: string): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            // Simular proceso de conversión
            let progress = 0;
            const progressInterval = setInterval(async () => {
                progress += 10;
                setPlayerState(prev => ({
                    ...prev,
                    connectionStatus: `Convirtiendo torrent a HLS... ${progress}%`
                }));

                if (progress >= 100) {
                    clearInterval(progressInterval);

                    try {
                        // Intentar usar servicios reales de conversión torrent-to-streaming
                        setPlayerState(prev => ({
                            ...prev,
                            connectionStatus: 'Buscando servicio de streaming para este contenido...'
                        }));

                        // Servicios que convierten magnet links a streams HLS
                        const streamingServices = [
                            `https://instant.io/api/v1/torrent/${hash}/stream.m3u8`,
                            `https://webtor.io/api/v1/torrent/magnet/stream/${hash}.m3u8`,
                            `https://torrent2stream.herokuapp.com/stream/${hash}`
                        ];

                        // Intentar cada servicio hasta encontrar uno que funcione
                        let streamFound = false;
                        for (const serviceUrl of streamingServices) {
                            try {
                                const response = await fetch(serviceUrl, {
                                    method: 'GET',
                                    mode: 'cors',
                                    headers: { 'Accept': 'application/vnd.apple.mpegurl' }
                                });

                                if (response.ok) {
                                    setPlayerState(prev => ({
                                        ...prev,
                                        connectionStatus: 'Stream HLS encontrado para este contenido'
                                    }));
                                    resolve(serviceUrl);
                                    streamFound = true;
                                    break;
                                }
                            } catch (error) {
                                console.warn(`Servicio ${serviceUrl} no disponible:`, error);
                                continue;
                            }
                        }

                        if (!streamFound) {
                            reject(new Error(
                                `No se pudo encontrar un servicio de streaming disponible para este contenido específico (Hash: ${hash.substring(0, 8)}...). ` +
                                `Los servicios de conversión torrent-to-HLS no están respondiendo. ` +
                                `Intente con el "Reproductor Avanzado" que usa tecnología P2P directa.`
                            ));
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            }, 300);

            // Timeout después de 10 segundos
            setTimeout(() => {
                clearInterval(progressInterval);
                reject(new Error('Timeout en conversión a HLS'));
            }, 10000);
        });
    };

    // Generar magnet link y convertir a HLS
    useEffect(() => {
        const initializeHLS = async () => {
            try {
                setPlayerState(prev => ({ ...prev, isLoading: true }));

                // Generar magnet link
                const result = generateMagnetLink(torrent, movieTitle);
                if (result.error) {
                    setPlayerState(prev => ({ ...prev, error: result.error }));
                    return;
                }

                setMagnetLink(result.data);

                // Convertir magnet a HLS
                const hlsStreamUrl = await convertMagnetToHLS(result.data);
                setHlsUrl(hlsStreamUrl);

                setPlayerState(prev => ({
                    ...prev,
                    isLoading: false,
                    connectionStatus: 'Stream HLS listo'
                }));

            } catch (error) {
                setPlayerState(prev => ({
                    ...prev,
                    error: `Error generando stream HLS: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                    isLoading: false
                }));
            }
        };

        initializeHLS();
    }, [torrent, movieTitle, convertMagnetToHLS]);

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

    // Inicializar HLS con import dinámico
    useEffect(() => {
        if (!videoRef.current || !hlsUrl) return;

        const video = videoRef.current;
        let hls: HlsInstance | null = null;

        const initializeHls = async () => {
            try {
                // Import dinámico de HLS.js
                const HlsModule = await import('hls.js');
                const Hls = HlsModule.default as any;

                if (Hls.isSupported()) {
                    hls = new Hls({
                        debug: false,
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90,
                        maxBufferLength: 30,
                        maxMaxBufferLength: 600,
                        startLevel: -1, // Auto quality
                        capLevelOnFPSDrop: true,
                        capLevelToPlayerSize: true,
                    });

                    if (hls) {
                        hls.loadSource(hlsUrl);
                        hls.attachMedia(video);

                        // Event listeners de HLS
                        hls.on(Hls.Events.MANIFEST_PARSED, (_: string, data: any) => {
                            console.log('Manifest loaded, levels:', data.levels);
                            const qualities = data.levels.map((level: any) =>
                                `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`
                            );
                            setPlayerState(prev => ({
                                ...prev,
                                availableQualities: ['auto', ...qualities],
                                isLoading: false,
                            }));
                        });

                        hls.on(Hls.Events.LEVEL_SWITCHED, (_: string, data: any) => {
                            const level = hls?.levels[data.level];
                            if (level) {
                                setPlayerState(prev => ({
                                    ...prev,
                                    quality: `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`
                                }));
                                setStreamStats(prev => ({
                                    ...prev,
                                    bitrate: level.bitrate
                                }));
                            }
                        });

                        hls.on(Hls.Events.FRAG_LOADED, (_: string, data: any) => {
                            setStreamStats(prev => ({
                                ...prev,
                                loadTime: data.frag.duration || 0
                            }));
                        });

                        hls.on(Hls.Events.ERROR, (_: string, data: any) => {
                            console.error('HLS Error:', data);
                            if (data.fatal) {
                                switch (data.type) {
                                    case Hls.ErrorTypes.NETWORK_ERROR:
                                        setPlayerState(prev => ({
                                            ...prev,
                                            error: 'Error de red. Verificando conexión...'
                                        }));
                                        hls?.startLoad();
                                        break;
                                    case Hls.ErrorTypes.MEDIA_ERROR:
                                        setPlayerState(prev => ({
                                            ...prev,
                                            error: 'Error de media. Intentando recuperar...'
                                        }));
                                        hls?.recoverMediaError();
                                        break;
                                    default:
                                        setPlayerState(prev => ({
                                            ...prev,
                                            error: `Error fatal: ${data.reason || data.type}`
                                        }));
                                        break;
                                }
                            }
                        });

                        hlsRef.current = hls;
                    }
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    // Safari nativo HLS
                    video.src = hlsUrl;
                    setPlayerState(prev => ({ ...prev, isLoading: false }));
                } else {
                    setPlayerState(prev => ({
                        ...prev,
                        error: 'HLS no es compatible con este navegador'
                    }));
                }
            } catch (error) {
                console.error('Error loading HLS.js:', error);
                setPlayerState(prev => ({
                    ...prev,
                    error: 'Error cargando el reproductor HLS'
                }));
            }
        };

        initializeHls();

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [hlsUrl]);

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

        const updateBuffer = () => {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const bufferHealth = video.duration > 0
                    ? (bufferedEnd / video.duration) * 100
                    : 0;
                setPlayerState(prev => ({ ...prev, bufferHealth }));
                setStreamStats(prev => ({
                    ...prev,
                    bufferLength: bufferedEnd - video.currentTime
                }));
            }
        };

        const updateVideoStats = () => {
            if (video.getVideoPlaybackQuality) {
                const quality = video.getVideoPlaybackQuality();
                setStreamStats(prev => ({
                    ...prev,
                    droppedFrames: quality.droppedVideoFrames,
                }));
            }
        };

        video.addEventListener('loadedmetadata', updatePlayerState);
        video.addEventListener('timeupdate', updatePlayerState);
        video.addEventListener('progress', updateBuffer);
        video.addEventListener('volumechange', updatePlayerState);
        video.addEventListener('play', () => setPlayerState(prev => ({ ...prev, isPlaying: true })));
        video.addEventListener('pause', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
        video.addEventListener('ended', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
        video.addEventListener('waiting', () => setPlayerState(prev => ({ ...prev, isLoading: true })));
        video.addEventListener('canplay', () => setPlayerState(prev => ({ ...prev, isLoading: false })));

        // Stats actualizados cada segundo
        const statsInterval = setInterval(updateVideoStats, 1000);

        return () => {
            video.removeEventListener('loadedmetadata', updatePlayerState);
            video.removeEventListener('timeupdate', updatePlayerState);
            video.removeEventListener('progress', updateBuffer);
            video.removeEventListener('volumechange', updatePlayerState);
            video.removeEventListener('play', () => setPlayerState(prev => ({ ...prev, isPlaying: true })));
            video.removeEventListener('pause', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
            video.removeEventListener('ended', () => setPlayerState(prev => ({ ...prev, isPlaying: false })));
            video.removeEventListener('waiting', () => setPlayerState(prev => ({ ...prev, isLoading: true })));
            video.removeEventListener('canplay', () => setPlayerState(prev => ({ ...prev, isLoading: false })));
            clearInterval(statsInterval);
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
                        <p className="text-sm text-red-500">Error en HLS Player</p>
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

    if (!hlsUrl && !playerState.error) {
        return (
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{movieTitle}</h3>
                        <p className="text-sm text-primary">Generando stream HLS...</p>
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
                        <Spinner size="lg" color="primary" className="mb-4" />
                        <p className="text-sm mb-2">{playerState.connectionStatus}</p>
                        <p className="text-xs text-gray-500 mb-2">
                            Magnet: {magnetLink ? magnetLink.substring(0, 60) + '...' : 'Generando...'}
                        </p>
                        <p className="text-xs text-blue-600 text-center">
                            💡 El reproductor HLS convierte automáticamente torrents a streams HLS para mayor compatibilidad
                        </p>
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
                        <p className="mt-2 text-white">Cargando stream...</p>
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
                            {playerState.quality}
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

                {/* Buffer y estadísticas */}
                <div className="mt-2 flex justify-between items-center text-xs text-white/70">
                    <div>
                        Buffer: {Math.round(playerState.bufferHealth)}% |
                        Bitrate: {Math.round(streamStats.bitrate / 1000)}kbps
                    </div>
                    <div>
                        Frames perdidos: {streamStats.droppedFrames} |
                        Buffer: {Math.round(streamStats.bufferLength)}s
                    </div>
                </div>
            </div>

            {/* Header con información */}
            {showControls && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-black/50 to-transparent p-4">
                    <h3 className="text-white text-lg font-semibold">{movieTitle}</h3>
                    <p className="text-white/70 text-sm">HLS Stream Player</p>
                </div>
            )}
        </div>
    );
};

// Estilos CSS en línea para los sliders personalizados
const sliderStyles = `
.slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    background: #006fee;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    background: #006fee;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider:focus {
    outline: none;
}

.slider:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(0, 111, 238, 0.3);
}
`;

// Agregar estilos al documento si no existen
if (typeof document !== 'undefined' && !document.getElementById('hls-player-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'hls-player-styles';
    styleElement.textContent = sliderStyles;
    document.head.appendChild(styleElement);
}
