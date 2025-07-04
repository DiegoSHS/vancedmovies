import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { CrossIcon } from "@/components/icons";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";

interface WebtorVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}

// Tipos para el estado del reproductor
type WebtorPlayerStatus = 'initializing' | 'loading' | 'ready' | 'error';

interface WebtorStatus {
    status: WebtorPlayerStatus;
    progress: number;
    peers: number;
    downloadSpeed: number;
    message: string;
}

declare global {
    interface Window {
        webtor?: any;
    }
}

const WebtorVideoPlayer: React.FC<WebtorVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose
}) => {
    const [webtorStatus, setWebtorStatus] = useState<WebtorStatus>({
        status: 'initializing',
        progress: 0,
        peers: 0,
        downloadSpeed: 0,
        message: 'Inicializando Webtor...'
    });

    const [error, setError] = useState<string | null>(null);

    const { error: magnetError, data: magnetLink } = generateMagnetLink(torrent, movieTitle);

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Streaming Webtor</h3>
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
                <CardBody className="bg-red-50 border border-red-200 rounded-lg text-center">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Error al Generar Magnet Link</h4>
                    <p className="text-red-600">{magnetError}</p>
                </CardBody>
            </Card>
        );
    }

    useEffect(() => {
        const loadWebtorSDK = async () => {
            try {
                if (!window.webtor) {
                    setWebtorStatus(prev => ({ ...prev, message: 'Cargando SDK de Webtor...' }));

                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js';
                    script.async = true;

                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });

                    let attempts = 0;
                    while (!window.webtor && attempts < 50) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        attempts++;
                    }

                    if (!window.webtor) {
                        throw new Error('No se pudo cargar el SDK de Webtor');
                    }
                }

                console.log('✅ Webtor SDK cargado exitosamente');
                setWebtorStatus(prev => ({
                    ...prev,
                    status: 'ready',
                    message: 'SDK de Webtor listo - El reproductor procesará el magnet link automáticamente'
                }));

            } catch (err) {
                console.error('❌ Error cargando Webtor SDK:', err);
                setError(err instanceof Error ? err.message : 'Error cargando Webtor');
            }
        };

        loadWebtorSDK();

    }, [magnetLink, movieTitle]);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatSpeed = (bytesPerSecond: number): string => {
        return formatBytes(bytesPerSecond) + '/s';
    };

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Streaming Webtor</h3>
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
                <CardBody className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-600 mb-2">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Servicio Webtor No Disponible</h4>
                    <p className="text-red-600 mb-4">{error}</p>
                    <p className="text-sm text-red-500">
                        Intenta con otra opción de reproductor o verifica tu conexión a internet.
                    </p>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Streaming Webtor</h3>
                    <p className="text-sm text-gray-600">{movieTitle}</p>
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
            <CardBody className="space-y-4">
                {webtorStatus.status !== 'ready' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-800">Estado de Conexión</h4>
                            <div className="flex items-center text-blue-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                                <Chip size="sm" color="primary" variant="flat">
                                    {webtorStatus.status === 'initializing' ? 'Inicializando' :
                                        webtorStatus.status === 'loading' ? 'Cargando' :
                                            webtorStatus.status === 'error' ? 'Error' : 'Listo'}
                                </Chip>
                            </div>
                        </div>

                        <p className="text-sm text-blue-700 mb-3">{webtorStatus.message}</p>

                        {webtorStatus.status === 'loading' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Progreso:</span>
                                    <span className="ml-2 font-semibold text-blue-700">
                                        {Math.round(webtorStatus.progress * 100)}%
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Peers:</span>
                                    <span className="ml-2 font-semibold text-green-600">{webtorStatus.peers}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Velocidad:</span>
                                    <span className="ml-2 font-semibold text-purple-600">
                                        {formatSpeed(webtorStatus.downloadSpeed)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {webtorStatus.progress > 0 && (
                            <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${webtorStatus.progress * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Video Container con método directo */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    {webtorStatus.status === 'ready' ? (
                        <video
                            controls
                            className="w-full h-full"
                            src={magnetLink}
                            poster="https://via.placeholder.com/800x450/333333/ffffff?text=Cargando+Video..."
                            style={{ minHeight: '400px' }}
                            onLoadStart={() => {
                                console.log('🎬 Video Webtor iniciando carga...');
                                setWebtorStatus(prev => ({
                                    ...prev,
                                    status: 'loading',
                                    message: 'Procesando magnet link con Webtor...'
                                }));
                            }}
                            onCanPlay={() => {
                                console.log('✅ Video Webtor listo para reproducir');
                                setWebtorStatus(prev => ({
                                    ...prev,
                                    status: 'ready',
                                    message: 'Video listo para reproducir'
                                }));
                            }}
                            onError={(e) => {
                                console.error('❌ Error del video Webtor:', e);
                                setError('Error procesando el torrent. Verifica que el magnet link sea válido.');
                            }}
                            onProgress={() => {
                                // El progreso se maneja automáticamente por Webtor
                                console.log('📊 Progreso de carga Webtor...');
                            }}
                        >
                            Tu navegador no soporta la reproducción de video.
                        </video>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                            <div className="text-center text-white">
                                <Spinner size="lg" color="primary" />
                                <p className="text-lg font-semibold mt-4">
                                    {webtorStatus.status === 'initializing' ? 'Inicializando Webtor SDK...' :
                                        webtorStatus.status === 'loading' ? 'Conectando con Webtor...' :
                                            'Preparando reproductor...'}
                                </p>
                                <p className="text-sm text-gray-300 mt-2">{webtorStatus.message}</p>
                                <div className="mt-4 text-xs text-blue-300">
                                    <p>🎬 {movieTitle}</p>
                                    <p>🔗 Magnet: {magnetLink.substring(0, 40)}...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info mejorada */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-green-800">Streaming Webtor.io</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p>
                            ✅ <strong>Conversión automática:</strong> Webtor convierte el torrent a HTTP/HLS en tiempo real
                        </p>
                        <p>
                            🌐 <strong>Sin P2P requerido:</strong> Streaming directo desde servidores optimizados
                        </p>
                        <p className="text-xs text-green-600 mt-2">
                            <strong>Magnet Link:</strong> {magnetLink.substring(0, 60)}...
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default WebtorVideoPlayer;
