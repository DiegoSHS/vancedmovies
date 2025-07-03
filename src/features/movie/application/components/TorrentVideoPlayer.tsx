import React, { useEffect, useRef, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";

interface TorrentVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

interface TorrentState {
    isLoading: boolean;
    error: string | null;
    isPlaying: boolean;
    connectionStatus: string;
    videoUrl: string | null;
    magnetLink: string;
}

interface StatsState {
    downloadProgress: number;
    downloadSpeed: number;
    uploadSpeed: number;
    numPeers: number;
}

const WEBTORRENT_CONFIG = {
    tracker: {
        announce: [
            "wss://tracker.btorrent.xyz",
            "wss://tracker.openwebtorrent.com",
            "wss://tracker.webtorrent.io",
        ],
    },
    dht: false,
    webSeeds: true,
};

const VIDEO_EXTENSIONS = /\.(mp4|mkv|avi|mov|webm|m4v|flv|wmv)$/i;

export const TorrentVideoPlayer: React.FC<TorrentVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const clientRef = useRef<any>(null);
    const torrentRef = useRef<any>(null);
    const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [torrentState, setTorrentState] = useState<TorrentState>({
        isLoading: true,
        error: null,
        isPlaying: false,
        connectionStatus: "Inicializando...",
        videoUrl: null,
        magnetLink: "",
    });

    const [stats, setStats] = useState<StatsState>({
        downloadProgress: 0,
        downloadSpeed: 0,
        uploadSpeed: 0,
        numPeers: 0,
    });

    const updateTorrentState = (updates: Partial<TorrentState>) => {
        setTorrentState((prev) => ({ ...prev, ...updates }));
    };

    const updateStats = (torrentInstance: any) => {
        setStats({
            downloadProgress: torrentInstance.progress * 100,
            downloadSpeed: torrentInstance.downloadSpeed,
            uploadSpeed: torrentInstance.uploadSpeed,
            numPeers: torrentInstance.numPeers,
        });
    };

    const findLargestVideoFile = (files: any[]) => {
        const videoFiles = files.filter((file) => VIDEO_EXTENSIONS.test(file.name));
        if (videoFiles.length === 0) return null;
        return videoFiles.reduce((largest, current) =>
            current.length > largest.length ? current : largest,
        );
    };

    const setupVideoFile = (videoFile: any) => {
        updateTorrentState({ connectionStatus: `Preparando: ${videoFile.name}` });

        videoFile.getBlobURL((err: any, url?: string) => {
            if (err || !url) {
                if (videoRef.current) {
                    videoFile.renderTo(videoRef.current, (renderErr?: any) => {
                        if (renderErr) {
                            updateTorrentState({
                                error: "Error al configurar el video: " + renderErr.message,
                            });
                        } else {
                            updateTorrentState({
                                isLoading: false,
                                connectionStatus: "Video listo",
                            });
                        }
                    });
                }
            } else {
                updateTorrentState({
                    videoUrl: url,
                    isLoading: false,
                    connectionStatus: "Video listo",
                });
                if (videoRef.current) {
                    videoRef.current.src = url;
                }
            }
        });
    };

    const setupTorrentListeners = (torrentInstance: any) => {
        torrentInstance.on("download", () => {
            updateTorrentState({
                connectionStatus: `Descargando... ${(torrentInstance.progress * 100).toFixed(1)}%`,
            });
        });

        torrentInstance.on("wire", () => {
            updateTorrentState({
                connectionStatus: `Conectado a ${torrentInstance.numPeers} peers`,
            });
        });

        torrentInstance.on("done", () => {
            updateTorrentState({ connectionStatus: "Descarga completa" });
        });

        statsIntervalRef.current = setInterval(
            () => updateStats(torrentInstance),
            1000,
        );
        updateStats(torrentInstance);
    };

    useEffect(() => {
        const initTorrent = async () => {
            try {
                // Validar datos de entrada
                if (!torrent) {
                    updateTorrentState({
                        error: "No se proporcionó información del torrent",
                        isLoading: false,
                    });
                    return;
                }

                if (!movieTitle || movieTitle.trim().length === 0) {
                    updateTorrentState({
                        error: "No se proporcionó el título de la película",
                        isLoading: false,
                    });
                    return;
                }

                updateTorrentState({
                    connectionStatus: "Generando enlace magnet...",
                });

                let magnetLink: string;
                const magnetResult = generateMagnetLink(torrent, movieTitle);
                if (magnetResult.error) {
                    updateTorrentState({
                        error: `Error al generar enlace magnet: ${magnetResult.error}`,
                        isLoading: false,
                    });
                    return;
                }
                magnetLink = magnetResult.data;

                updateTorrentState({
                    magnetLink,
                    connectionStatus: "Cargando WebTorrent...",
                });

                // Cargar WebTorrent dinámicamente
                const WebTorrentConstructor = await import("webtorrent").then(
                    (module) => module.default || module
                );
                const client = new WebTorrentConstructor(WEBTORRENT_CONFIG);
                clientRef.current = client;

                updateTorrentState({ connectionStatus: "Conectando al torrent..." });

                client.add(magnetLink, {}, (torrentInstance: any) => {
                    torrentRef.current = torrentInstance;
                    updateTorrentState({
                        connectionStatus: "Buscando archivos de video...",
                    });

                    const videoFile = findLargestVideoFile(torrentInstance.files);
                    if (!videoFile) {
                        updateTorrentState({
                            error: "No se encontraron archivos de video en el torrent",
                            isLoading: false,
                        });
                        return;
                    }

                    setupVideoFile(videoFile);
                    setupTorrentListeners(torrentInstance);
                });

                client.on("error", (err: any) => {
                    updateTorrentState({
                        error: `Error de conexión: ${err.message}`,
                        isLoading: false,
                        connectionStatus: "Error de conexión",
                    });
                });
            } catch (error: any) {
                updateTorrentState({
                    error: `WebTorrent no disponible: ${error.message}`,
                    isLoading: false,
                });
            }
        };

        initTorrent();

        return () => {
            if (statsIntervalRef.current) {
                clearInterval(statsIntervalRef.current);
            }
            if (clientRef.current) {
                clientRef.current.destroy();
            }
            if (torrentState.videoUrl) {
                URL.revokeObjectURL(torrentState.videoUrl);
            }
        };
    }, [torrent, movieTitle]);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const copyMagnetLink = async () => {
        try {
            if (!torrentState.magnetLink) {
                console.error("No hay enlace magnet disponible");
                return;
            }

            await navigator.clipboard.writeText(torrentState.magnetLink);
            // Podrías agregar aquí una notificación de éxito
        } catch (err) {
            console.error("Error al copiar enlace magnet:", err);
            // Podrías mostrar una notificación de error al usuario
        }
    };

    const retryConnection = () => {
        updateTorrentState({ error: null, isLoading: true });
    };

    const handlePlay = () => updateTorrentState({ isPlaying: true });
    const handlePause = () => updateTorrentState({ isPlaying: false });

    if (torrentState.error) {
        return (
            <Card className="w-full">
                <CardBody className="text-center p-8">
                    <div className="text-red-500 mb-4">
                        <h3 className="text-xl font-bold">Error en el reproductor</h3>
                        <p className="text-sm mt-2">{torrentState.error}</p>
                        <p className="text-xs mt-2 text-gray-500">
                            WebRTC y WebTorrent requieren navegadores modernos y buena
                            conectividad
                        </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button color="primary" onPress={retryConnection}>
                            🔄 Reintentar
                        </Button>
                        {onClose && (
                            <Button color="secondary" onPress={onClose}>
                                ✖️ Cerrar
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardBody className="p-0">
                <div className="relative bg-black aspect-video">
                    {torrentState.isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
                            <div className="text-center text-white max-w-md">
                                <Spinner size="lg" color="primary" />
                                <p className="text-sm mt-2">{torrentState.connectionStatus}</p>
                                {stats.downloadProgress > 0 && (
                                    <>
                                        <div className="mt-4">
                                            <Progress
                                                value={stats.downloadProgress}
                                                color="primary"
                                                className="w-full"
                                            />
                                        </div>
                                        <p className="text-xs mt-2">
                                            {stats.downloadProgress.toFixed(1)}% -{" "}
                                            {formatBytes(stats.downloadSpeed)}/s
                                        </p>
                                    </>
                                )}
                                <p className="text-xs mt-3 text-yellow-300">
                                    ⚠️ La primera conexión puede tardar varios minutos
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
                        <div className="flex gap-2 flex-wrap">
                            <Chip color="primary" variant="flat">
                                {torrent.quality}
                            </Chip>
                            <Chip color="secondary" variant="flat" size="sm">
                                {torrent.size}
                            </Chip>
                            {torrentState.isPlaying && (
                                <Chip color="success" variant="flat" size="sm">
                                    ▶ Reproduciendo
                                </Chip>
                            )}
                        </div>
                        {onClose && (
                            <Button
                                color="danger"
                                variant="light"
                                size="sm"
                                onPress={onClose}
                            >
                                ✖️ Cerrar
                            </Button>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {torrentState.connectionStatus}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progreso P2P</span>
                            <span>{stats.downloadProgress.toFixed(1)}%</span>
                        </div>
                        <Progress
                            value={stats.downloadProgress}
                            color="primary"
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">⬇️ Descarga</p>
                            <p className="font-medium">
                                {formatBytes(stats.downloadSpeed)}/s
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">⬆️ Subida</p>
                            <p className="font-medium">{formatBytes(stats.uploadSpeed)}/s</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">👥 Peers</p>
                            <p className="font-medium">{stats.numPeers}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center flex-wrap">
                        <Button
                            color="secondary"
                            variant="bordered"
                            size="sm"
                            onPress={copyMagnetLink}
                        >
                            🔗 Copiar magnet
                        </Button>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
                        <p>
                            🔥 <strong>WebTorrent Real</strong> - Streaming P2P con WebRTC
                        </p>
                        <p>⚡ Descarga directa desde peers de la red BitTorrent</p>
                        <p>🌐 Requiere navegador moderno y buena conectividad</p>
                        <p>🔒 Los datos se transmiten de forma segura P2P</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
