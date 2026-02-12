import { useState } from "react";
import { InvalidMagnetPlayer } from "./InvalidMagnetPlayer";

interface BackendStreamPlayerProps {
    magnetLink: string;
}

export const BackendStreamPlayer: React.FC<BackendStreamPlayerProps> = ({ magnetLink }) => {
    const [videoError, setVideoError] = useState(false);

    if (magnetLink === '' || !magnetLink) return <InvalidMagnetPlayer />
    const backendUrl = `${import.meta.env.VITE_NEST_BACKEND_URL}?magnet=${encodeURIComponent(magnetLink)}`;
    if (videoError) {
        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
                <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </div>
                <h4 className="text-lg font-semibold text-red-800 mb-2">No se pudo cargar el video</h4>
                <p className="text-red-600 mb-4">Verifica que el servidor backend esté corriendo, que el magnet URI sea válido y que el archivo tenga seeds disponibles.</p>
                <p className="text-xs text-gray-500">Si el problema persiste, intenta con otro torrent o recarga la página.</p>
            </div>
        );
    }
    return (
        <div className="w-full">
            <video
                controls
                className="w-full rounded-md"
                src={backendUrl}
                autoPlay
                onError={() => {
                    setVideoError(true);
                    console.error("❌ Error al cargar el video desde el backend. Verifica que el servidor esté corriendo y que el magnet URI sea válido.");
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
                Gracias por escogernos
            </div>
        </div>
    );
};
