interface BackendStreamPlayerProps {
  magnetLink?: string;
  poster?: string;
}

const BackendStreamPlayer: React.FC<BackendStreamPlayerProps> = ({
  magnetLink,
  poster,
}) => {
  const videoSrc = magnetLink
    ? `${import.meta.env.VITE_NEST_BACKEND_URL}?magnet=${encodeURIComponent(magnetLink)}`
    : undefined;

  const handleError = async () => {
    const { toast } = await import("@heroui/react/toast");
    toast.danger("Ups, no se pudo cargar el video");
  };
  return (
    <video
      autoPlay
      controls
      className="w-full rounded-md aspect-video"
      poster={poster}
      src={videoSrc}
      onError={handleError}
    >
      <track kind="captions" srcLang="es" />
      Tu navegador no soporta el elemento de video.
    </video>
  );
};

export default BackendStreamPlayer;
