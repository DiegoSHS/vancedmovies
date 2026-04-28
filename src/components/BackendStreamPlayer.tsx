import { useTPBMovieContext } from "@/features/movie/application/providers/TPBMovieProvider";

interface BackendStreamPlayerProps {
    magnetLink?: string;
}

export const BackendStreamPlayer: React.FC<BackendStreamPlayerProps> = ({ magnetLink }) => {
    const { state: { selectedItem } } = useTPBMovieContext()
    const videoSrc =
        magnetLink ?
            `${import.meta.env.VITE_NEST_BACKEND_URL}?magnet=${encodeURIComponent(magnetLink)}` :
            selectedItem ? `${import.meta.env.VITE_NEST_BACKEND_URL}?magnet=${encodeURIComponent(selectedItem.hash)}` : undefined
    const handleError = async () => {
        const { toast } = await import('@heroui/react')
        toast.danger('Ups, no se pudo cargar el video')
    }
    return (
        <video
            controls
            className="w-full rounded-md aspect-video"
            src={videoSrc}
            autoPlay
            onError={handleError}
        >
            <track kind="captions" srcLang="es" />
            Tu navegador no soporta el elemento de video.
        </video>
    );
};
