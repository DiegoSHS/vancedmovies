import { useState, useEffect } from 'react';

interface WebtorVideoPlayerProps {
    magnetLink: string;
    movieTitle: string;
}

declare global {
    interface Window {
        webtor?: any;
    }
}

const loadWebtorSDK = () => {
    return new Promise<void>((resolve, reject) => {
        if (window.webtor) return resolve();

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js';
        script.async = true;

        script.onload = () => {
            if (window.webtor) return resolve();
            reject('Webtor SDK no disponible');
        };

        script.onerror = () => reject('Error al cargar Webtor SDK');

        document.head.appendChild(script);
    });
}

export const WTVideoPlayer: React.FC<WebtorVideoPlayerProps> = ({
    magnetLink,
    movieTitle,
}) => {
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
                await loadWebtorSDK()
                console.log('✅ Webtor SDK cargado correctamente');
                if (window.webtor.lenght === 0) return
                window.webtor.push({
                    id: 'player',
                    magnet: magnetLink,
                    lang: 'es',
                    width: '100%',
                });
            } catch (err) {
                console.error('❌ Error cargando Webtor SDK:', err);
                setError(err instanceof Error ? err.message : 'Error cargando Webtor');
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

    return (
        <div id="player" className="w-full rounded-md" />
    );
};
