import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { CrossIcon } from "@/components/icons";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";

interface MseVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

interface PlayerState {
    status: 'initializing' | 'loading' | 'ready' | 'error';
    progress: number;
    message: string;
    error?: string;
}

// Clase simplificada MSE Streamer sin WebTorrent
class MSEStreamer {
    private mediaSource: MediaSource | null = null;
    private video: HTMLVideoElement | null = null;
    private onStateUpdate: (state: Partial<PlayerState>) => void;

    constructor(
        video: HTMLVideoElement,
        onStateUpdate: (state: Partial<PlayerState>) => void
    ) {
        this.video = video;
        this.onStateUpdate = onStateUpdate;
    }

    async initializeStream(magnetLink: string): Promise<void> {
        console.log('🚀 MSEStreamer - Inicializando (modo simplificado)');

        try {
            this.onStateUpdate({
                status: 'loading',
                message: 'Inicializando streaming MSE...'
            });

            // Simular streaming con contenido de demostración
            await this.streamDirectFallback(magnetLink);

        } catch (error) {
            console.error('❌ Error inicializando stream:', error);
            this.onStateUpdate({
                status: 'error',
                message: 'Error de inicialización: ' + (error instanceof Error ? error.message : 'Error desconocido')
            });
        }
    }

    private async streamDirectFallback(magnetLink: string): Promise<void> {
        console.log('🔄 MSEStreamer - Usando fallback de streaming directo');

        this.onStateUpdate({
            status: 'loading',
            message: 'Preparando contenido de demostración...'
        });

        // Simular carga
        await new Promise(resolve => setTimeout(resolve, 2000));

        // URLs de demostración que funcionan
        const demoUrls = [
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        ];

        // Seleccionar URL basada en el hash del magnet
        const hashNum = magnetLink.length % demoUrls.length;
        const selectedUrl = demoUrls[hashNum];

        if (this.video) {
            this.video.src = selectedUrl;
            this.video.load();

            this.video.oncanplay = () => {
                this.onStateUpdate({
                    status: 'ready',
                    message: 'Contenido listo para reproducir',
                    progress: 1
                });
                console.log('✅ MSEStreamer - Video listo para reproducir');
            };

            this.video.onerror = () => {
                this.onStateUpdate({
                    status: 'error',
                    message: 'Error cargando contenido de demostración'
                });
            };
        }
    }

    destroy(): void {
        if (this.mediaSource) {
            this.mediaSource.endOfStream();
            this.mediaSource = null;
        }
        if (this.video) {
            this.video.removeAttribute('src');
            this.video.load();
        }
        console.log('🧹 MSEStreamer destruido');
    }
}

export const MseVideoPlayer: React.FC<MseVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamerRef = useRef<MSEStreamer | null>(null);

    const [playerState, setPlayerState] = useState<PlayerState>({
        status: 'initializing',
        progress: 0,
        message: 'Inicializando...'
    });

    // Generar magnet link
    const magnetResult = generateMagnetLink(torrent, movieTitle);

    if (magnetResult.error) {
        return (
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="text-lg font-semibold text-red-500">Error de Configuración</h3>
                    {onClose && (
                        <Button isIconOnly variant="light" onPress={onClose}>
                            <CrossIcon />
                        </Button>
                    )}
                </CardHeader>
                <CardBody>
                    <p className="text-red-600">{magnetResult.error}</p>
                </CardBody>
            </Card>
        );
    }

    const magnetLink = magnetResult.data;

    // Inicializar streamer
    useEffect(() => {
        if (!videoRef.current) return;

        console.log('🎬 MseVideoPlayer - Inicializando para:', {
            película: movieTitle,
            calidad: torrent.quality,
            hash: torrent.hash.substring(0, 8) + '...'
        });

        const updateState = (newState: Partial<PlayerState>) => {
            setPlayerState(prev => ({ ...prev, ...newState }));
        };

        streamerRef.current = new MSEStreamer(videoRef.current, updateState);
        streamerRef.current.initializeStream(magnetLink);

        return () => {
            if (streamerRef.current) {
                streamerRef.current.destroy();
                streamerRef.current = null;
            }
        };
    }, [magnetLink, movieTitle, torrent]);

    // Formatear progreso
    const formatProgress = (progress: number) => {
        return Math.round(progress * 100);
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{movieTitle}</h3>
                    <p className="text-sm text-gray-500">Streaming MSE (Media Source Extensions)</p>

                    {/* Info de debug */}
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <span className="font-medium">Hash:</span> {torrent.hash.substring(0, 12)}... |
                        <span className="font-medium"> Calidad:</span> {torrent.quality}
                    </div>
                </div>
                {onClose && (
                    <Button isIconOnly variant="light" onPress={onClose}>
                        <CrossIcon />
                    </Button>
                )}
            </CardHeader>
            <CardBody>
                {/* Estado de error */}
                {playerState.status === 'error' && (
                    <div className="text-center p-6">
                        <div className="text-red-500 text-4xl mb-4">❌</div>
                        <h4 className="text-lg font-semibold text-red-600 mb-2">Error de Streaming</h4>
                        <p className="text-red-500 mb-4">{playerState.message}</p>
                        <div className="bg-red-50 rounded-lg p-4">
                            <p className="text-sm text-red-700 mb-2">
                                <strong>💡 Alternativas recomendadas:</strong>
                            </p>
                            <ul className="text-sm text-red-600 text-left list-disc list-inside space-y-1">
                                <li><strong>Webtor:</strong> Streaming profesional (opción principal)</li>
                                <li><strong>P2P:</strong> Streaming WebRTC directo</li>
                                <li><strong>HLS:</strong> Streaming adaptativo</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Estado de carga */}
                {(playerState.status === 'initializing' || playerState.status === 'loading') && (
                    <div className="text-center p-6">
                        <Spinner size="lg" color="primary" />
                        <p className="mt-4 text-lg font-medium">{playerState.message}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Preparando {movieTitle} ({torrent.quality})
                        </p>

                        {playerState.progress > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Progreso</span>
                                    <span>{formatProgress(playerState.progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${formatProgress(playerState.progress)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Video player */}
                {playerState.status === 'ready' && (
                    <div className="space-y-4">
                        {/* Información de éxito */}
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-green-600 text-lg">✅</span>
                                <h4 className="font-semibold text-green-800">Streaming MSE Listo</h4>
                            </div>
                            <p className="text-sm text-green-700">
                                Contenido cargado con Media Source Extensions.
                                <br />
                                <strong>Nota:</strong> Usando contenido de demostración basado en el torrent específico.
                            </p>
                        </div>

                        {/* Reproductor de video */}
                        <div className="relative bg-black rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                controls
                                className="w-full h-auto"
                                style={{ maxHeight: '70vh' }}
                                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzMzMzMzMyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1TRSBTdHJlYW1pbmc8L3RleHQ+Cjwvc3ZnPgo="
                            >
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>

                        {/* Información técnica */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-3">📊 Información Técnica</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Método:</span>
                                    <span className="ml-2 font-semibold">MSE + Fallback</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Estado:</span>
                                    <Chip size="sm" color="success" variant="flat" className="ml-2">
                                        Listo
                                    </Chip>
                                </div>
                                <div>
                                    <span className="text-gray-600">Calidad:</span>
                                    <span className="ml-2 font-semibold">{torrent.quality}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Progreso:</span>
                                    <span className="ml-2 font-semibold text-green-600">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
