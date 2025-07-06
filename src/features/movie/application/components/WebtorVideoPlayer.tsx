import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@heroui/progress';

interface WebtorVideoPlayerProps {
    magnetLink: string;
    movieTitle: string;
}

interface WebtorSDK {
    push: (config: WebtorConfig) => void;
    length?: number;
}

interface WebtorConfig {
    id: string;
    magnet: string;
    lang: string;
    width: string;
}

declare global {
    interface Window {
        webtor?: WebtorSDK;
    }
}

const loadWebtorSDK = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        if (window.webtor) {
            console.log('✅ Webtor SDK ya está disponible');
            return resolve();
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js';
        script.async = true;

        script.onload = () => {
            // Dar tiempo al SDK para inicializarse
            setTimeout(() => {
                if (window.webtor) {
                    console.log('✅ Webtor SDK cargado desde CDN');
                    return resolve();
                }
                reject(new Error('Webtor SDK no disponible después de la carga'));
            }, 100);
        };

        script.onerror = () => {
            console.error('❌ Error al cargar Webtor SDK desde CDN');
            reject(new Error('Error al cargar Webtor SDK'));
        };

        document.head.appendChild(script);
    });
};

export const WTVideoPlayer: React.FC<WebtorVideoPlayerProps> = ({
    magnetLink,
    movieTitle,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    if (magnetLink === '' || !magnetLink) {
        return (
            <>
                <h1 className="text-lg font-semibold text-red-800 mb-2">No se dió ningún magnet</h1>
            </>
        )
    }
    
    useEffect(() => {
        const setupWebtor = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                console.log('🔄 Iniciando carga del SDK de Webtor...');
                await loadWebtorSDK();
                
                console.log('✅ Webtor SDK cargado correctamente');
                
                if (!window.webtor) {
                    throw new Error('Webtor SDK no está disponible');
                }
                
                // Inicializar el reproductor Webtor
                window.webtor.push({
                    id: 'player',
                    magnet: magnetLink,
                    lang: 'es',
                    width: '100%',
                });
                
                console.log('🎬 Reproductor Webtor inicializado exitosamente');
                setIsLoading(false);
                
            } catch (err) {
                console.error('❌ Error cargando Webtor SDK:', err);
                const errorMessage = err instanceof Error ? err.message : 'Error cargando Webtor';
                setError(errorMessage);
                setIsLoading(false);
            }
        };

        setupWebtor();

    }, [magnetLink, movieTitle]);

    if (error) {
        return (
            <>
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
            </>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-64">
                <CircularProgress
                    size="lg"
                    color="primary"
                    label="Cargando reproductor Webtor..."
                    className="mb-4"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Conectando con el servicio de streaming...
                </p>
            </div>
        );
    }

    return (
        <div id="player" className="w-full rounded-md" />
    );
};
