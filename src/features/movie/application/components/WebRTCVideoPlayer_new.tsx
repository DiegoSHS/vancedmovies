// TEMPORALMENTE DESHABILITADO - WebTorrent removido para evitar errores de sourcemap
import React from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { CrossIcon } from "@/components/icons";
import { Torrent } from "../../domain/entities/Torrent";

interface WebRTCVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

const WebRTCVideoPlayer: React.FC<WebRTCVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">P2P Streaming</h3>
                {onClose && (
                    <Button isIconOnly variant="light" onPress={onClose}>
                        <CrossIcon />
                    </Button>
                )}
            </CardHeader>
            <CardBody>
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">🔄</div>
                    <h4 className="text-xl font-semibold mb-4">P2P Streaming Temporalmente No Disponible</h4>
                    <p className="text-gray-600 mb-4">
                        El reproductor P2P está temporalmente deshabilitado mientras se resuelven problemas de compatibilidad.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-700 mb-2">
                            <strong>💡 Alternativas recomendadas:</strong>
                        </p>
                        <ul className="text-sm text-blue-600 text-left list-disc list-inside space-y-1">
                            <li><strong>Webtor:</strong> Streaming profesional HTTP/HLS (opción principal)</li>
                            <li><strong>Streaming Estándar:</strong> Reproducción progresiva MSE</li>
                            <li><strong>Streaming Adaptativo:</strong> Calidad HLS variable</li>
                        </ul>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        Película: {movieTitle} | Calidad: {torrent.quality}
                    </p>
                </div>
            </CardBody>
        </Card>
    );
};

export default WebRTCVideoPlayer;
