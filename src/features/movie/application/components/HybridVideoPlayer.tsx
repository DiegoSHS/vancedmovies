import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Torrent } from "../../domain/entities/Torrent";
import { MseVideoPlayer } from "./MseVideoPlayer";
import { HlsVideoPlayer } from "./HlsVideoPlayer";
import WebRTCVideoPlayer from "./WebRTCVideoPlayer";
import WebtorVideoPlayer from "./WebtorVideoPlayer";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";

interface HybridVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

type PlayerType = 'selector' | 'webtor' | 'p2p' | 'standard' | 'streaming';

export const HybridVideoPlayer: React.FC<HybridVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerType>('selector');

    useEffect(() => {
        console.log('🎬 HybridVideoPlayer - Información de la película:', {
            título: movieTitle,
            calidad: torrent.quality,
            hash: torrent.hash.substring(0, 8) + '...',
            hashCompleto: torrent.hash
        });

        const { data: magnetLink, error } = generateMagnetLink(torrent, movieTitle);
        if (error) {
            console.error('❌ Error generando magnet link:', error);
        } else {
            console.log('🔗 Magnet link generado exitosamente:', {
                magnetParcial: magnetLink.substring(0, 60) + '...',
                longitud: magnetLink.length
            });
        }
    }, [torrent, movieTitle]);

    // Renderizar reproductor Webtor (opción principal)
    if (selectedPlayer === 'webtor') {
        return (
            <WebtorVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={() => setSelectedPlayer('selector')}
            />
        );
    }

    // Renderizar reproductor P2P optimizado
    if (selectedPlayer === 'p2p') {
        return (
            <WebRTCVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={onClose}
            />
        );
    }

    // Renderizar reproductor estándar (MSE con WebTorrent)
    if (selectedPlayer === 'standard') {
        return (
            <MseVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={() => setSelectedPlayer('selector')}
            />
        );
    }

    // Renderizar streaming adaptativo (HLS)
    if (selectedPlayer === 'streaming') {
        return (
            <HlsVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={() => setSelectedPlayer('selector')}
            />
        );
    }

    // Selector simplificado
    const { data: magnetLink, error: magnetError } = generateMagnetLink(torrent, movieTitle);

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{movieTitle}</h3>
                    <p className="text-sm text-gray-500">Selecciona tu método de reproducción</p>
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
            <CardBody className="flex flex-col gap-3">
                <Card className="border-1 border-default-200">
                    <CardHeader className="text-lg font-semibold">
                        Streaming con Webtor.io
                    </CardHeader>
                    <CardBody className="text-sm text-green-700">
                        Servicio profesional que convierte torrents a streaming HTTP/HLS en tiempo real.
                        Mejor compatibilidad y rendimiento que las soluciones P2P tradicionales.
                    </CardBody>
                </Card>

                <Card
                    isPressable
                    className="border-1 border-default-200"
                    onPress={() => setSelectedPlayer('webtor')}
                >
                    <CardBody className="text-center p-6">
                        <h4 className="font-bold text-xl mb-3 text-green-800">Streaming Webtor</h4>
                        <p className="text-sm text-green-700 mb-4 leading-relaxed">
                            Conversión profesional de torrent a stream HTTP/HLS
                        </p>
                        <strong>
                            Servicio optimizado con máxima compatibilidad
                        </strong>
                        <div className="flex flex-wrap gap-2 justify-center">
                        </div>
                    </CardBody>
                    <CardFooter className="flex gap-2">
                        <Chip color="success" variant="solid">
                            Recomendado
                        </Chip>
                        <Chip color="primary" variant="flat">
                            HTTP/HLS
                        </Chip>
                        <Chip color="secondary" variant="flat">
                            Webtor.io
                        </Chip>
                    </CardFooter>
                </Card>
                <Card
                    isPressable
                    className="border-1 border-default-200"
                    onPress={() => setSelectedPlayer('p2p')}
                >
                    <CardBody className="text-center p-4">
                        <div className="text-2xl mb-2">🌐</div>
                        <h4 className="font-semibold mb-1 text-sm">Streaming P2P</h4>
                        <p className="text-xs text-gray-600 mb-2">
                            WebRTC directo
                        </p>
                        <Chip color="primary" variant="flat" size="sm">
                            Experimental
                        </Chip>
                    </CardBody>
                </Card>
                <Card
                    isPressable
                    className="border-2 border-default-200"
                    onPress={() => setSelectedPlayer('standard')}
                >
                    <CardBody className="text-center p-4">
                        <div className="text-2xl mb-2">🎥</div>
                        <h4 className="font-semibold mb-1 text-sm">Reproductor Estándar</h4>
                        <p className="text-xs text-gray-600 mb-2">
                            Descarga tradicional
                        </p>
                        <Chip color="default" variant="flat" size="sm">
                            Respaldo
                        </Chip>
                    </CardBody>
                </Card>
                <Card
                    isPressable
                    className="border-1 border-default-200"
                    onPress={() => setSelectedPlayer('streaming')}
                >
                    <CardBody className="text-center p-4">
                        <div className="text-2xl mb-2">📡</div>
                        <h4 className="font-semibold mb-1 text-sm">Streaming Adaptativo</h4>
                        <p className="text-xs text-gray-600 mb-2">
                            Calidad automática
                        </p>
                        <Chip color="secondary" variant="flat" size="sm">
                            Respaldo
                        </Chip>
                    </CardBody>
                </Card>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-default-200">
                    <h5 className="font-semibold text-blue-800 mb-2">💡 ¿Por qué el Reproductor Funcional?</h5>
                    <div className="text-sm text-blue-700 space-y-1">
                        <p>• <strong>Sin dependencias de torrents/P2P:</strong> No requiere peers activos</p>
                        <p>• <strong>Contenido real:</strong> Videos de alta calidad de la Blender Foundation</p>
                        <p>• <strong>Mapeo inteligente:</strong> Cada película se asocia consistentemente a contenido específico</p>
                        <p>• <strong>HTML5 puro:</strong> Máxima compatibilidad en todos los navegadores</p>
                        <p>• <strong>Controles avanzados:</strong> Seek, volumen, fullscreen, keyboard shortcuts</p>
                    </div>
                </div>
            </CardBody>
        </Card >
    );
};
