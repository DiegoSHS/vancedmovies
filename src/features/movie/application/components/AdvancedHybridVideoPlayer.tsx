import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Torrent } from "../../domain/entities/Torrent";
import { TorrentVideoPlayer } from "./TorrentVideoPlayer";
import WebRTCVideoPlayer from "./WebRTCVideoPlayer";
import { HlsVideoPlayer } from "./HlsVideoPlayer";
import { MseVideoPlayer } from "./MseVideoPlayer";

interface AdvancedHybridVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

type StreamingMethod = 'selector' | 'webtorrent' | 'webrtc' | 'hls' | 'mse';

interface StreamingOption {
    id: StreamingMethod;
    name: string;
    description: string;
    icon: string;
    compatibility: 'high' | 'medium' | 'low';
    requirements?: string[];
    pros: string[];
    cons: string[];
}

const STREAMING_OPTIONS: StreamingOption[] = [
    {
        id: 'webtorrent',
        name: 'WebTorrent',
        description: 'Streaming P2P usando WebTorrent en el navegador',
        icon: '🌊',
        compatibility: 'high',
        requirements: ['Navegador moderno', 'WebRTC'],
        pros: [
            'Fácil de usar',
            'Amplia compatibilidad',
            'Streaming directo',
            'Sin configuración adicional'
        ],
        cons: [
            'Dependiente de seeders',
            'Velocidad variable',
            'Uso de ancho de banda'
        ]
    },
    {
        id: 'webrtc',
        name: 'WebRTC P2P',
        description: 'Streaming directo peer-to-peer usando WebRTC DataChannels',
        icon: '🔗',
        compatibility: 'medium',
        requirements: ['WebRTC', 'Servidor de señalización', 'STUN/TURN'],
        pros: [
            'Baja latencia',
            'Conexión directa',
            'Control completo',
            'Eficiente en ancho de banda'
        ],
        cons: [
            'Configuración compleja',
            'Requiere servidor',
            'NAT/Firewall issues',
            'Limitado por peers'
        ]
    },
    {
        id: 'hls',
        name: 'HLS Stream',
        description: 'Streaming adaptativo usando HLS/M3U8 (requiere URL)',
        icon: '📺',
        compatibility: 'high',
        requirements: ['URL HLS/M3U8', 'Servidor de streaming'],
        pros: [
            'Calidad adaptativa',
            'Streaming profesional',
            'Baja latencia',
            'Amplia compatibilidad'
        ],
        cons: [
            'Requiere servidor',
            'Necesita URL externa',
            'Costo de infraestructura',
            'Dependiente de servidor'
        ]
    },
    {
        id: 'mse',
        name: 'MSE P2P',
        description: 'MediaSource Extensions con P2P simulado para streaming directo',
        icon: '⚡',
        compatibility: 'medium',
        requirements: ['MediaSource API', 'Navegador moderno'],
        pros: [
            'Control granular',
            'Buffering inteligente',
            'P2P simulado',
            'Optimizado para video'
        ],
        cons: [
            'Experimental',
            'Compatibilidad limitada',
            'Complejidad técnica',
            'En desarrollo'
        ]
    }
];

export const AdvancedHybridVideoPlayer: React.FC<AdvancedHybridVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {
    const [selectedMethod, setSelectedMethod] = useState<StreamingMethod>('selector');
    const [showOptions, setShowOptions] = useState(false);

    const handleMethodSelect = (method: StreamingMethod) => {
        setSelectedMethod(method);
        setShowOptions(false);
    };

    const getCompatibilityColor = (compatibility: 'high' | 'medium' | 'low') => {
        switch (compatibility) {
            case 'high': return 'success';
            case 'medium': return 'warning';
            case 'low': return 'danger';
            default: return 'default';
        }
    };

    const getCompatibilityText = (compatibility: 'high' | 'medium' | 'low') => {
        switch (compatibility) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Desconocida';
        }
    };

    // Renderizar reproductor seleccionado
    if (selectedMethod === 'webtorrent') {
        return (
            <TorrentVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={onClose}
            />
        );
    }

    if (selectedMethod === 'webrtc') {
        return (
            <WebRTCVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={onClose}
            />
        );
    }

    if (selectedMethod === 'hls') {
        return (
            <HlsVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={onClose}
            />
        );
    }

    if (selectedMethod === 'mse') {
        return (
            <MseVideoPlayer
                torrent={torrent}
                movieTitle={movieTitle}
                onClose={onClose}
            />
        );
    }

    // Selector de método de streaming
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">{movieTitle}</h3>
                    <p className="text-sm text-gray-500">Selecciona tu método de streaming preferido</p>
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
                {!showOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {STREAMING_OPTIONS.map((option) => (
                            <Card
                                key={option.id}
                                isPressable
                                className="border-2 border-transparent hover:border-primary/50 transition-all duration-200 cursor-pointer"
                                onPress={() => handleMethodSelect(option.id)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{option.icon}</span>
                                            <div>
                                                <h4 className="font-semibold">{option.name}</h4>
                                                <Chip
                                                    size="sm"
                                                    color={getCompatibilityColor(option.compatibility)}
                                                    variant="flat"
                                                >
                                                    Compatibilidad: {getCompatibilityText(option.compatibility)}
                                                </Chip>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <p className="text-sm text-gray-600 mb-3">
                                        {option.description}
                                    </p>

                                    {option.requirements && (
                                        <div className="mb-3">
                                            <p className="text-xs font-medium text-gray-500 mb-1">Requisitos:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {option.requirements.map((req, idx) => (
                                                    <Chip key={idx} size="sm" variant="bordered" className="text-xs">
                                                        {req}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <p className="font-medium text-green-600 mb-1">✅ Ventajas:</p>
                                            <ul className="list-disc list-inside text-green-600 space-y-0.5">
                                                {option.pros.map((pro, idx) => (
                                                    <li key={idx}>{pro}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="font-medium text-red-600 mb-1">❌ Desventajas:</p>
                                            <ul className="list-disc list-inside text-red-600 space-y-0.5">
                                                {option.cons.map((con, idx) => (
                                                    <li key={idx}>{con}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}

                {!showOptions && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">💡 Recomendaciones:</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li><strong>WebTorrent:</strong> Mejor para torrents con muchos seeders</li>
                            <li><strong>HLS:</strong> Conversión automática de magnet a stream HLS</li>
                            <li><strong>WebRTC P2P:</strong> Para conexiones directas de baja latencia</li>
                            <li><strong>MSE P2P:</strong> Experimental, para pruebas avanzadas</li>
                        </ul>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
