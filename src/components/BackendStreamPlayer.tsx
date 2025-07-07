import React from "react";

interface BackendStreamPlayerProps {
    magnetLink: string;
}

export const BackendStreamPlayer: React.FC<BackendStreamPlayerProps> = ({ magnetLink }) => {
    if (!magnetLink) {
        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
                <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </div>
                <h4 className="text-lg font-semibold text-red-800 mb-2">Magnet URI no proporcionado</h4>
                <p className="text-red-600 mb-4">Debes proporcionar un magnet URI válido para reproducir el video.</p>
            </div>
        );
    }
    // Construye la URL al backend
    const backendUrl = `http://localhost:3000?magnet=${encodeURIComponent(magnetLink)}`;
    console.log(`🎬 BackendStreamPlayer - URL del backend: ${backendUrl}`);
    return (
        <div className="w-full">
            <video
                controls
                className="w-full rounded-md"
                src={backendUrl}
                autoPlay
                onError={() => {
                    /* Podrías mostrar un mensaje de error personalizado aquí */
                }}
            >
                <track
                    default
                    kind="captions"
                    label="Sin subtítulos disponibles"
                    srcLang="es"
                />
                Tu navegador no soporta el elemento de video.
            </video>
            <div className="text-xs text-gray-500 mt-2 text-center">
                Servido vía backend propio en <code>localhost:3000</code>
            </div>
        </div>
    );
};
