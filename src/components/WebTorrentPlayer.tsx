import { useState, useEffect, useRef } from "react";
import { Spinner } from "@heroui/spinner";
import WebTorrent from 'https://esm.sh/webtorrent'
interface WebTorrentPlayerProps {
  magnetLink: string;
}

interface WebTorrentClient {
  add: (magnet: string, callback: (torrent: WebTorrentTorrent) => void) => void;
  destroy: (callback?: () => void) => void;
}

interface WebTorrentFile {
  name: string;
  getBlobURL: (callback: (err: Error | null, url?: string) => void) => void;
  renderTo: (
    element: HTMLVideoElement,
    callback?: (err: Error | null) => void,
  ) => void;
}

interface WebTorrentTorrent {
  files: WebTorrentFile[];
  name: string;
}

const VIDEO_EXTENSIONS = [
  ".mp4",
  ".webm",
  ".ogg",
  ".avi",
  ".mov",
  ".mkv",
  ".m4v",
];

const isVideoFile = (filename: string): boolean => {
  const lowerName = filename.toLowerCase();

  return VIDEO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
};

export const WebTorrentPlayer: React.FC<WebTorrentPlayerProps> = ({
  magnetLink,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<WebTorrentClient | null>(null);

  useEffect(() => {
    if (!magnetLink) {
      setError("No se proporcionó ningún magnet URI");
      setIsLoading(false);

      return;
    }

    const setupWebTorrent = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const client: WebTorrentClient = new WebTorrent();
        console.log("✅ WebTorrent SDK cargado correctamente");

        clientRef.current = client;
        console.log("✅ Cliente WebTorrent inicializado", client);
        client.add(magnetLink, (torrent: WebTorrentTorrent) => {
          const videoFile = torrent.files.find((file) =>
            isVideoFile(file.name),
          );
          if (!videoFile) {
            setError(
              "No se encontró ningún archivo de video compatible en el torrent",
            );
            return;
          }
          videoFile.getBlobURL((err: Error | null, url?: string) => {
            if (err || !url) {
              if (videoRef.current) {
                videoFile.renderTo(
                  videoRef.current,
                  (renderErr: Error | null) => {
                    if (renderErr) {
                      setError(
                        `Error al reproducir el archivo: ${renderErr.message}`,
                      );
                    }
                  },
                );
              } else {
                setError("Elemento de video no disponible");
              }
            } else {
              setVideoUrl(url);
            }
          });
        });
      } catch (err) {
        console.error("❌ Error al cargar WebTorrent SDK:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar WebTorrent",
        );
      } finally {
        setIsLoading(false);
      }
    }

    setupWebTorrent();

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy(() => {
        });
        clientRef.current = null;
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [magnetLink, videoUrl]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Cargando reproductor de torrent...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
        <div className="text-red-600 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-red-800 mb-2">
          Error en el Reproductor WebTorrent
        </h4>
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-red-500">
          Verifica que el magnet URI sea válido y que contenga archivos de video
          compatibles.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        controls
        className="w-full rounded-md"
        src={videoUrl || undefined}
        onError={() => setError("Error al cargar el video")}
      >
        <track
          default
          kind="captions"
          label="Sin subtítulos disponibles"
          srcLang="es"
        />
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
};
