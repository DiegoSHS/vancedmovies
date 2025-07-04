import React, { useRef, useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Torrent } from "../../domain/entities/Torrent";
import { CrossIcon } from "@/components/icons";

interface FunctionalVideoPlayerProps {
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
}

// Contenido de demostración real que funciona - Expandido
const DEMO_CONTENT_MAP: Record<string, { quality: string, url: string, title: string, duration: string, description: string }[]> = {
    // Big Buck Bunny - Animación de Blender Foundation
    "big_buck_bunny": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            title: "Big Buck Bunny",
            duration: "10:34",
            description: "Un conejo gigante con corazón gigante"
        },
        {
            quality: "720p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            title: "Big Buck Bunny",
            duration: "10:34",
            description: "Un conejo gigante con corazón gigante"
        }
    ],
    // Sintel - Película de Blender Foundation
    "sintel": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            title: "Sintel",
            duration: "14:48",
            description: "La búsqueda de una joven guerrera por su dragón perdido"
        },
        {
            quality: "720p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            title: "Sintel",
            duration: "14:48",
            description: "La búsqueda de una joven guerrera por su dragón perdido"
        }
    ],
    // Tears of Steel - Sci-Fi de Blender Foundation
    "tears_steel": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            title: "Tears of Steel",
            duration: "12:14",
            description: "En Amsterdam post-apocalíptico, un grupo de científicos busca robots"
        },
        {
            quality: "720p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            title: "Tears of Steel",
            duration: "12:14",
            description: "En Amsterdam post-apocalíptico, un grupo de científicos busca robots"
        }
    ],
    // Elephants Dream - Primer proyecto de Blender Foundation
    "elephants_dream": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            title: "Elephants Dream",
            duration: "10:53",
            description: "Dos extraños personajes exploran un mundo surrealista de máquinas"
        }
    ],
    // For Bigger Escapes - Contenido de aventura
    "for_bigger_escapes": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            title: "For Bigger Escapes",
            duration: "1:57",
            description: "Aventuras épicas esperan"
        }
    ],
    // For Bigger Fun - Entretenimiento
    "for_bigger_fun": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            title: "For Bigger Fun",
            duration: "1:12",
            description: "Diversión sin límites"
        }
    ],
    // For Bigger Joy - Emocional
    "for_bigger_joy": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            title: "For Bigger Joy",
            duration: "1:45",
            description: "Momentos que alegran el corazón"
        }
    ],
    // For Bigger Meltdowns - Drama
    "for_bigger_meltdowns": [
        {
            quality: "1080p",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            title: "For Bigger Meltdowns",
            duration: "1:33",
            description: "Drama intenso y emocional"
        }
    ]
};

// Mapear hash de torrent a contenido disponible
const getAvailableContent = (quality: string, hash: string) => {
    // Usar hash para determinar qué contenido mostrar (simulando contenido específico)
    const hashNum = parseInt(hash.slice(-2), 16) % Object.keys(DEMO_CONTENT_MAP).length;
    const contentKeys = Object.keys(DEMO_CONTENT_MAP);
    const selectedKey = contentKeys[hashNum];
    const availableQualities = DEMO_CONTENT_MAP[selectedKey];

    // Buscar calidad exacta o la mejor disponible
    const exactMatch = availableQualities.find(q => q.quality === quality);
    const fallback = availableQualities[0];

    return exactMatch || fallback;
};

export const FunctionalVideoPlayer: React.FC<FunctionalVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
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
    });

    const [showControls, setShowControls] = useState(true);
    const [videoSource, setVideoSource] = useState<string>("");
    const [actualContent, setActualContent] = useState<{ quality: string, url: string, title: string } | null>(null);

    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    // Inicializar contenido
    useEffect(() => {
        console.log('🎬 FunctionalVideoPlayer - Cargando contenido para:', {
            película: movieTitle,
            calidad: torrent.quality,
            hash: torrent.hash.substring(0, 8) + '...'
        });

        setPlayerState(prev => ({ ...prev, isLoading: true, error: null }));

        // Simular proceso de carga
        const loadingTimeout = setTimeout(() => {
            const content = getAvailableContent(torrent.quality, torrent.hash);

            console.log('✅ Contenido seleccionado:', {
                título: content.title,
                calidad: content.quality,
                url: content.url.substring(0, 50) + '...'
            });

            setActualContent(content);
            setVideoSource(content.url);
            setPlayerState(prev => ({ ...prev, isLoading: false }));
        }, 1500);

        return () => clearTimeout(loadingTimeout);
    }, [torrent, movieTitle]);

    // Configurar eventos del video
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedData = () => {
            setPlayerState(prev => ({
                ...prev,
                duration: video.duration,
                isLoading: false
            }));
        };

        const handleTimeUpdate = () => {
            setPlayerState(prev => ({
                ...prev,
                currentTime: video.currentTime,
                duration: video.duration || 0
            }));
        };

        const handlePlay = () => {
            setPlayerState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
        };

        const handlePause = () => {
            setPlayerState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
        };

        const handleVolumeChange = () => {
            setPlayerState(prev => ({
                ...prev,
                volume: video.volume,
                isMuted: video.muted
            }));
        };

        const handleError = () => {
            setPlayerState(prev => ({
                ...prev,
                error: "Error cargando el video",
                isLoading: false
            }));
        };

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('volumechange', handleVolumeChange);
        video.addEventListener('error', handleError);

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('volumechange', handleVolumeChange);
            video.removeEventListener('error', handleError);
        };
    }, [videoSource]);

    // Auto-hide controls
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
        const container = containerRef.current;

        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            resetControlsTimeout();
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [playerState.isPlaying, playerState.isPaused]);

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen();
            setPlayerState(prev => ({ ...prev, isFullscreen: true }));
        } else {
            document.exitFullscreen();
            setPlayerState(prev => ({ ...prev, isFullscreen: false }));
        }
    };

    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        if (!video || !playerState.duration) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const clickTime = (clickX / width) * playerState.duration;

        video.currentTime = clickTime;
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (playerState.error) {
        return (
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="text-lg font-semibold text-red-500">Error de Reproducción</h3>
                    {onClose && (
                        <Button isIconOnly variant="light" onPress={onClose}>
                            <CrossIcon />
                        </Button>
                    )}
                </CardHeader>
                <CardBody>
                    <p className="text-red-600">{playerState.error}</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full bg-black rounded-lg overflow-hidden ${playerState.isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
                }`}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={videoSource}
                className="w-full h-full object-contain"
                onClick={togglePlayPause}
                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzMzMzMzMyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pgo8L3N2Zz4K"
            />

            {/* Loading Overlay */}
            {playerState.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="text-center text-white">
                        <Spinner size="lg" color="primary" />
                        <p className="mt-4 text-lg">Cargando {movieTitle}...</p>
                        <p className="text-sm text-gray-300">Calidad: {torrent.quality}</p>
                        {actualContent && (
                            <p className="text-xs text-blue-300 mt-2">
                                Demo: {actualContent.title}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Controls Overlay */}
            {showControls && !playerState.isLoading && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50">
                    {/* Top Controls */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="text-white">
                            <h3 className="text-lg font-semibold">{movieTitle}</h3>
                            <div className="flex gap-2 mt-1">
                                <Chip size="sm" color="primary">{torrent.quality}</Chip>
                                {actualContent && (
                                    <Chip size="sm" color="secondary" variant="flat">
                                        Demo: {actualContent.title}
                                    </Chip>
                                )}
                            </div>
                        </div>
                        {onClose && (
                            <Button isIconOnly variant="light" onPress={onClose}>
                                <CrossIcon className="text-white" />
                            </Button>
                        )}
                    </div>

                    {/* Center Play/Pause Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                            isIconOnly
                            variant="flat"
                            className="bg-black/50 text-white w-16 h-16"
                            onPress={togglePlayPause}
                        >
                            {playerState.isPlaying ? (
                                <div className="w-6 h-6 flex gap-1">
                                    <div className="w-2 h-6 bg-white"></div>
                                    <div className="w-2 h-6 bg-white"></div>
                                </div>
                            ) : (
                                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                            )}
                        </Button>
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-4 left-4 right-4">
                        {/* Progress Bar */}
                        <div
                            className="w-full h-2 bg-white/30 rounded cursor-pointer mb-4"
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full bg-blue-500 rounded"
                                style={{
                                    width: `${playerState.duration ? (playerState.currentTime / playerState.duration) * 100 : 0}%`
                                }}
                            ></div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex justify-between items-center text-white">
                            <div className="flex items-center gap-4">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    className="text-white"
                                    onPress={togglePlayPause}
                                >
                                    {playerState.isPlaying ? "⏸️" : "▶️"}
                                </Button>

                                <span className="text-sm">
                                    {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    className="text-white"
                                    onPress={toggleFullscreen}
                                >
                                    {playerState.isFullscreen ? "⏹️" : "⛶"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
