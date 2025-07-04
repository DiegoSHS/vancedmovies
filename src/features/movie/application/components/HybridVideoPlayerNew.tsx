import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Torrent } from "../../domain/entities/Torrent";
import { AdvancedHybridVideoPlayer } from "./AdvancedHybridVideoPlayer";

interface HybridVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

export const HybridVideoPlayer: React.FC<HybridVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const [useAdvanced, setUseAdvanced] = useState(false);

    if (useAdvanced) {
        return (
            <AdvancedHybridVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={onClose}
            />
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{movieTitle}</h3>
                    <p className="text-sm text-gray-500">Selecciona tu método de streaming</p>
                </div>
                {onClose && (
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={onClose}
                        aria-label="Cerrar reproductor"
                    >
                        ✕
                    </Button>
                )}
            </CardHeader>
            <CardBody>
                <div className="text-center space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card
                            isPressable
                            className="border-2 border-transparent hover:border-primary/50 transition-all duration-200"
                            onPress={() => setUseAdvanced(true)}
                        >
                            <CardBody className="text-center p-6">
                                <div className="text-4xl mb-3">🚀</div>
                                <h4 className="font-semibold mb-2">Reproductor Avanzado</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Múltiples opciones de streaming: WebTorrent, WebRTC, HLS, MSE
                                </p>
                                <Chip color="primary" variant="flat">
                                    Recomendado
                                </Chip>
                            </CardBody>
                        </Card>

                        <Card
                            isPressable
                            className="border-2 border-transparent hover:border-warning/50 transition-all duration-200"
                            onPress={() => setUseAdvanced(true)}
                        >
                            <CardBody className="text-center p-6">
                                <div className="text-4xl mb-3">⚡</div>
                                <h4 className="font-semibold mb-2">Streaming Rápido</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Acceso directo a opciones de streaming optimizadas
                                </p>
                                <Chip color="warning" variant="flat">
                                    Nuevo
                                </Chip>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">🎬 Opciones de Streaming Disponibles:</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
                            <div className="flex items-center gap-1">
                                <span>🌊</span> WebTorrent
                            </div>
                            <div className="flex items-center gap-1">
                                <span>🔗</span> WebRTC P2P
                            </div>
                            <div className="flex items-center gap-1">
                                <span>📺</span> HLS Stream
                            </div>
                            <div className="flex items-center gap-1">
                                <span>⚡</span> MSE P2P
                            </div>
                        </div>
                    </div>

                    <Button
                        color="primary"
                        size="lg"
                        onPress={() => setUseAdvanced(true)}
                        className="w-full md:w-auto"
                    >
                        Comenzar Streaming
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};
