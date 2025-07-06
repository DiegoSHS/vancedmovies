import React, { useState, useEffect } from "react";
import { CircularProgress } from "@heroui/progress";

interface WebtorVideoPlayerProps {
  magnetLink: string;
  movieTitle: string;
}

interface WebtorSDK {
  push: (config: WebtorConfig) => void;
  length?: number;
}

interface WebtorConfig {
  id: string;
  magnet: string;
  lang: string;
  width: string;
}

declare global {
  interface Window {
    webtor?: WebtorSDK;
  }
}

const loadWebtorSDK = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (window.webtor) {
      return resolve();
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js";
    script.async = true;

    script.onload = () => {
      // Dar tiempo al SDK para inicializarse
      setTimeout(() => {
        if (window.webtor) {
          return resolve();
        }
        reject(new Error("Webtor SDK no disponible después de la carga"));
      }, 100);
    };

    script.onerror = () => {
      reject(new Error("Error al cargar Webtor SDK"));
    };

    document.head.appendChild(script);
  });
};

export const WTVideoPlayer: React.FC<WebtorVideoPlayerProps> = ({
  magnetLink,
  movieTitle,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (magnetLink === "" || !magnetLink) {
      setError("No se proporcionó un enlace magnet válido");
      setIsLoading(false);

      return;
    }

    const setupWebtor = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await loadWebtorSDK();

        if (!window.webtor) {
          throw new Error("Webtor SDK no está disponible");
        }

        // Inicializar el reproductor Webtor
        window.webtor.push({
          id: "player",
          magnet: magnetLink,
          lang: "es",
          width: "100%",
        });

        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error cargando Webtor";

        setError(errorMessage);
        setIsLoading(false);
      }
    };

    setupWebtor();
  }, [magnetLink, movieTitle]);

  if (magnetLink === "" || !magnetLink) {
    return (
      <>
        <h1 className="text-lg font-semibold text-red-800 mb-2">
          No se dió ningún magnet
        </h1>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="text-red-600 mb-2">
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
          Servicio Webtor No Disponible
        </h4>
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-red-500">
          Intenta con otra opción de reproductor o verifica tu conexión a
          internet.
        </p>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-64">
        <CircularProgress
          className="mb-4"
          color="primary"
          label="Cargando reproductor Webtor..."
          size="lg"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Conectando con el servicio de streaming...
        </p>
      </div>
    );
  }

  return <div className="w-full rounded-md" id="player" />;
};
