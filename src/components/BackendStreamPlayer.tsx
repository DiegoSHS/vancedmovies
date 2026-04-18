import { useTPBMovieContext } from "@/features/movie/application/providers/TPBMovieProvider";
import { useState } from "react";

interface BackendStreamPlayerProps {
    magnetLink?: string;
}

export const BackendStreamPlayer: React.FC<BackendStreamPlayerProps> = ({ magnetLink }) => {
    const { state: { selectedItem } } = useTPBMovieContext()
    const getVideoSrc = () => {
        if (selectedItem) {
            return `${import.meta.env.VITE_NEST_BACKEND_URL}?magnet=${encodeURIComponent(magnetLink || selectedItem.magnetLink)}`
        }
        return
    }
    const [_, setVideoSource] = useState(getVideoSrc);
    return (
        <div className="w-full">
            <video
                poster="/preview.jpg"
                controls
                className="w-full rounded-md aspect-video"
                src={getVideoSrc()}
                autoPlay
                onError={() => {
                    setVideoSource(undefined);
                }}
            >
                Tu navegador no soporta el elemento de video.
            </video>
            <div className="text-xs text-gray-500 mt-2 text-center">
                Gracias por escogernos
            </div>
        </div>
    );
};
