import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "@heroui/spinner";

interface WebTorrentPlayerProps {
  magnetURI: string;
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

declare global {
  interface Window {
    WebTorrent?: {
      new (): WebTorrentClient;
    };
  }
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

const loadWebTorrentSDK = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (window.WebTorrent) {
      return resolve();
    }

    const script = document.createElement("script");

    script.src = "https://cdn.jsdelivr.net/npm/webtorrent@2.6.10/index.min.js";
    script.async = true;

    script.onload = () => {
      if (window.WebTorrent) {
        resolve();
      } else {
        reject(new Error("WebTorrent SDK no disponible después de cargar"));
      }
    };

    script.onerror = () => {
      reject(new Error("Error al cargar WebTorrent SDK"));
    };

    document.head.appendChild(script);
  });
};

const isVideoFile = (filename: string): boolean => {
  const lowerName = filename.toLowerCase();

  return VIDEO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
};

export const WebTorrentPlayer: React.FC<WebTorrentPlayerProps> = ({
  magnetURI,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<WebTorrentClient | null>(null);

  useEffect(() => {
    if (!magnetURI) {
      setError("No se proporcionó ningún magnet URI");
      setIsLoading(false);

      return;
    }

    const setupWebTorrent = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Load WebTorrent SDK
        await loadWebTorrentSDK();

        if (!window.WebTorrent) {
          throw new Error("WebTorrent no está disponible");
        }

        // Create WebTorrent client
        const client = new window.WebTorrent();

        clientRef.current = client;

        // Add torrent
        client.add(magnetURI, (torrent: WebTorrentTorrent) => {
          // Find the first video file
          const videoFile = torrent.files.find((file) =>
            isVideoFile(file.name),
          );

          if (!videoFile) {
            setError(
              "No se encontró ningún archivo de video compatible en el torrent",
            );
            setIsLoading(false);

            return;
          }

          // Try to get blob URL first (preferred method)
          videoFile.getBlobURL((err: Error | null, url?: string) => {
            if (err || !url) {
              // Fallback to renderTo method
              if (videoRef.current) {
                videoFile.renderTo(
                  videoRef.current,
                  (renderErr: Error | null) => {
                    if (renderErr) {
                      setError(
                        `Error al reproducir el archivo: ${renderErr.message}`,
                      );
                    }
                    setIsLoading(false);
                  },
                );
              } else {
                setError("Elemento de video no disponible");
                setIsLoading(false);
              }
            } else {
              setVideoUrl(url);
              setIsLoading(false);
            }
          });
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar WebTorrent",
        );
        setIsLoading(false);
      }
    };

    setupWebTorrent();

    // Cleanup function
    return () => {
      if (clientRef.current) {
        clientRef.current.destroy(() => {
          // WebTorrent client destroyed
        });
        clientRef.current = null;
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [magnetURI, videoUrl]);

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
