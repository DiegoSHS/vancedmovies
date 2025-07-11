import { useState, useEffect, useRef } from "react";
import { Spinner } from "@heroui/spinner";
import { useWebTorrentContext } from "@/features/webtorrent/application/providers/webTorrentProvider";
import { InvalidMagnetPlayer } from "./InvalidMagnetPlayer";

interface WebTorrentPlayerProps {
  magnetLink: string;
}


export const WebTorrentPlayer: React.FC<WebTorrentPlayerProps> = ({
  magnetLink,
}) => {
  if (magnetLink === '' || !magnetLink) return <InvalidMagnetPlayer />
  const { addOrGetTorrent, findVideoFile } = useWebTorrentContext()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onTorrentReady = (torrent: any) => {
    const videoFile = findVideoFile(torrent);
    console.log("Evento 'ready' del torrent disparado", torrent);
    if (!videoFile) {
      setError("No se encontró ningún archivo de video compatible en el torrent");
      setIsLoading(false)
      return;
    }
    videoFile.getBlobURL((err, url) => {
      if (err || !url) {
        if (videoRef.current) {
          videoFile.renderTo(
            videoRef.current,
            {
              controls: true,
              autoplay: true,
            },
            (renderErr) => {
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
  const onTorrentError = (err?: any) => {
    console.error("[WebTorrent] Error en el torrent", err);
    setError(`Error al procesar el torrent${err && err.message ? ': ' + err.message : ''}`);
    setIsLoading(false);
  }
  const onNoPeers = (announceType: "tracker" | "dht") => {
    const msg = `[WebTorrent] No se encontraron peers para el torrent. Tipo: ${announceType}`;
    console.warn(msg);
    setWarning("No se encontraron peers para el torrent. Intenta con otro magnet o espera más seeds.");
  }
  const onWarning = (err: any) => {
    const msg = `WebTorrent warning: ${err?.message || err}`;
    console.warn(msg);
    setWarning(msg);
  }
  useEffect(() => {
    if (!magnetLink) {
      setError("No se proporcionó ningún magnet URI");
      setIsLoading(false);
      return;
    }

    const setupWebTorrent = async (): Promise<void> => {
      try {
        const torrent = addOrGetTorrent(magnetLink);
        if (!torrent) return
        torrent.on('noPeers', onNoPeers);
        torrent.on('warning', onWarning);
        torrent.on('ready', () => onTorrentReady(torrent));
        torrent.on('error', onTorrentError);
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

  if (error || warning) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
        <div className={error ? "text-red-600 mb-4" : "text-yellow-500 mb-4"}>
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
        <h4 className="text-lg font-semibold mb-2" style={{ color: error ? '#991b1b' : '#b45309' }}>
          {error ? 'Error en el Reproductor WebTorrent' : 'Advertencia en el Reproductor WebTorrent'}
        </h4>
        <p className={error ? "text-red-600 mb-4" : "text-yellow-600 mb-4"}>{error || warning}</p>
        <p className="text-sm text-gray-500 mb-2">
          Verifica que el magnet URI sea válido, que contenga archivos de video compatibles y que haya seeds disponibles.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-2">
          Puedes intentar reproducir con otro reproductor (Backend o Webtor) usando las opciones de selección.
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


export const WebTorrentSWPlayer: React.FC<WebTorrentPlayerProps> = ({
  magnetLink,
}) => {
  if (magnetLink === '' || !magnetLink) return <InvalidMagnetPlayer />
  const { state: { selectedItem: client } } = useWebTorrentContext()
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!client) return
    const setupVideo = async () => {
      client.add(magnetLink, {}, (torrent) => {
        const file = torrent.files.find((f) => isVideoFile(f.name))
        if (!file) {
          console.error("No se encontró ningún archivo de video compatible en el torrent");
          return;
        }
        file.on('stream', ({ stream: _, file, req }) => {
          if (req.destination === 'video') {
            console.log(`Video player requested data from ${file.name}! Ranges: ${req.headers.range}`)
          }
        });
        file.streamTo(videoRef);
      });
    };
    setupVideo();
    return () => {
      // Aquí podrías limpiar el cliente o desregistrar el SW si lo deseas
    };
  }, [magnetLink]);
  return (
    <video ref={videoRef} controls className="w-full rounded-md">
      <track
        default
        kind="captions"
        label="Sin subtítulos disponibles"
        srcLang="es"
      />
      Tu navegador no soporta el elemento de video.
    </video>
  );
}