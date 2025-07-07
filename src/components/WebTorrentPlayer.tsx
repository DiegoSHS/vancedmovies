import { useState, useEffect, useRef } from "react";
import { Spinner } from "@heroui/spinner";

interface WebTorrentPlayerProps {
  magnetLink: string;
}

declare global {
  interface Window {
    WebTorrent?: any;
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

const isVideoFile = (filename: string): boolean => {
  const lowerName = filename.toLowerCase();

  return VIDEO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
};

const loadWebTorrentSDK = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (window.WebTorrent) {
      console.log("[WebTorrent] SDK ya presente en window.WebTorrent");
      return resolve();
    }
    const script = document.createElement("script");
    // UMD oficial recomendada por los autores para navegador
    script.src = "https://cdn.jsdelivr.net/npm/webtorrent/webtorrent.min.js";
    script.async = true;
    script.onload = () => {
      if (window.WebTorrent) {
        console.log("[WebTorrent] SDK cargado y window.WebTorrent disponible (UMD oficial)");
        return resolve();
      }
      console.error("[WebTorrent] Script cargado pero window.WebTorrent no está disponible");
      reject("WebTorrent SDK no disponible tras cargar el script");
    };
    script.onerror = (e) => {
      console.error("[WebTorrent] Error al cargar el script", e);
      alert("No se pudo cargar el reproductor WebTorrent. Intenta recargar la página o verifica tu conexión. Si el problema persiste, prueba con otro CDN o contacta soporte.");
      reject("Error al cargar WebTorrent SDK");
    };
    document.head.appendChild(script);
    console.log("[WebTorrent] Script insertado en el DOM (UMD oficial)");
  });
};



export const WebTorrentPlayer: React.FC<WebTorrentPlayerProps> = ({
  magnetLink,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<any>(null);

  const onTorrentReady = (torrent: any) => {
    console.log("Evento 'ready' del torrent disparado", torrent);
    const videoFile = torrent.files.find((file: any) => isVideoFile(file.name));
    if (!videoFile) {
      setError("No se encontró ningún archivo de video compatible en el torrent");
      setIsLoading(false);
      return;
    }
    videoFile.getBlobURL((err: Error | null, url?: string) => {
      if (err || !url) {
        if (videoRef.current) {
          videoFile.renderTo(
            videoRef.current,
            (renderErr: Error | null) => {
              if (renderErr) {
                setError(`Error al reproducir el archivo: ${renderErr.message}`);
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
  }
  const onTorrentError = () => {
    console.error("[WebTorrent] Error en el torrent");
    setError(`Error al procesar el torrent`);
    setIsLoading(false);
  }
  const onClientError = (error: string | Error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[WebTorrent] Error global del cliente:", error);
    setError(`Error global de WebTorrent: ${message}`);
    setIsLoading(false);
  }
  const onNoPeers = (announceType: "tracker" | "dht") => {
    console.warn("[WebTorrent] No se encontraron peers para el torrent. Tipo:", announceType
    );
  }
  const onWarning = (err: any) => {
    console.warn("WebTorrent warning:", err);
  }
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
        await loadWebTorrentSDK();
        if (!window.WebTorrent) throw new Error("WebTorrent no está disponible tras cargar el script");
        // Log versión y prototype
        try {
          const version = window.WebTorrent.VERSION || window.WebTorrent.prototype?.VERSION;
          console.log("[WebTorrent] Versión detectada:", version);
        } catch (e) {
          console.warn("No se pudo obtener la versión de WebTorrent");
        }
        const client = new window.WebTorrent();
        clientRef.current = client;
        client.on('error', onClientError);
        client.add(magnetLink, (torrent: any) => {
          console.log("Callback de client.add llamado", torrent);
          torrent.on('noPeers', onNoPeers);
          torrent.on('warning', onWarning);
          torrent.on('ready', () => onTorrentReady(torrent));
          torrent.on('error', onTorrentError);
        });
        console.log(client)
      } catch (err) {
        console.error("[WebTorrent] Error real:", err);
        setError(
          err instanceof Error ? err.message : `Error desconocido al cargar WebTorrent: ${err}`,
        );
        setIsLoading(false);
      }
    };

    setupWebTorrent();

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy(() => { });
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
