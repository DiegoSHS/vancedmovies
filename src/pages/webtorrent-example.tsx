import React from "react";

import { WebTorrentPlayer } from "../components/WebTorrentPlayer";

/**
 * Ejemplo de uso del componente WebTorrentPlayer
 *
 * Este ejemplo demuestra cómo usar el componente WebTorrentPlayer
 * con un magnet URI de ejemplo.
 */
export const WebTorrentPlayerExample: React.FC = () => {
  // Ejemplo de magnet URI - Big Buck Bunny (Open Source movie)
  const exampleMagnetURI =
    "magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          WebTorrent Player - Ejemplo de Uso
        </h1>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Características:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Carga dinámica del WebTorrent CDN</li>
            <li>Detección automática de archivos de video</li>
            <li>Spinner de carga mientras se inicializa</li>
            <li>Manejo de errores para archivos incompatibles</li>
            <li>Soporte para múltiples formatos de video</li>
            <li>Limpieza automática de recursos</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Reproductor en Acción:</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Magnet URI de ejemplo: Big Buck Bunny (película de código abierto)
          </p>

          <WebTorrentPlayer magnetURI={exampleMagnetURI} />

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Código de ejemplo:
            </h3>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
              {`<WebTorrentPlayer magnetURI="${exampleMagnetURI}" />`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
