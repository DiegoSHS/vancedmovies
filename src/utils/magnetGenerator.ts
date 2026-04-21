import { Torrent } from "../features/movie/domain/entities/Torrent";

const TRACKERS = [
  'udp://opentor.org:2710',
  "https://tracker.zhuqiy.top:443/announce",
  "wss://tracker.openwebtorrent.com",
];


/**
 * Source - https://stackoverflow.com/a/19707059
 * Posted by Jimbo, modified by community.
 * See post 'Timeline' for change history
 * Retrieved 2026-04-02, License - CC BY-SA 4.0
 */
const magnetRegExp = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i

export const checkMagnet = (magnet: string) => {
  return magnet.match(magnetRegExp)
}

export const getMagnetLinkFromURL = (params: URLSearchParams) => {
  const xt = params.get('xt')
  const dn = params.get('dn')
  const xl = params.get('xl')
  const tr = params.getAll('tr')
  if (!xt || !dn) return null
  return `magnet:?xt=${xt}&dn=${dn}${xl ? `&xl=${xl}${tr ? `${tr.join('&tr=')}` : ''}` : ''}`
}

const hashRegex = /^[a-fA-F0-9]{40}$/;

/**
 * Valida que un torrent tenga los datos mínimos necesarios
 * @param torrent - El objeto torrent a validar
 * @returns boolean - true si el torrent es válido
 */
const validateTorrent = (torrent: Torrent): boolean => {
  if (!torrent.hash || typeof torrent.hash !== 'string' || torrent.hash.trim().length === 0) {
    return false;
  }
  if (!hashRegex.test(torrent.hash.trim())) {
    return false;
  }

  return true;
};

/**
 * Valida que el título de la película sea válido
 * @param movieTitle - El título a validar
 * @returns boolean - true si el título es válido
 */
const validateMovieTitle = (movieTitle: string): boolean => {
  if (!movieTitle || typeof movieTitle !== 'string' || movieTitle.trim().length === 0) {
    return false;
  }

  if (movieTitle.trim().length === 0) {
    return false;
  }

  return true;
};

/**
 * Genera un enlace magnet para un torrent específico
 * @param torrent - El objeto torrent del que generar el enlace magnet
 * @param movieTitle - El título de la película para incluir en el enlace
 * @param opts - Opciones, por ejemplo { browser: true } para usar solo trackers WebSocket
 * @returns Objeto con el enlace magnet o error
 */
export const generateMagnetLink = (
  torrent: Torrent,
  movieTitle: string,
): { error: null | string, data: string } => {
  if (!torrent) {
    return {
      error: "El torrent no puede estar vacío o ser nulo",
      data: "",
    };
  }

  if (!validateMovieTitle(movieTitle)) {
    return {
      error: "El título de la película no puede estar vacío o ser inválido",
      data: "",
    };
  }

  if (!validateTorrent(torrent)) {
    return {
      error: "El torrent debe tener un hash válido (40 caracteres hexadecimales) y una calidad válida",
      data: "",
    };
  }

  const normalizedHash = torrent.hash.trim().toLowerCase();
  const normalizedTitle = movieTitle.trim();
  const normalizedQuality = torrent.quality.trim();

  const displayName = `${normalizedTitle} (${normalizedQuality}) [BoliPeliculas]`;
  const encodedName = encodeURIComponent(displayName);

  const magnetParams = [
    `xt=urn:btih:${normalizedHash}`,
    `dn=${encodedName}`,
    ...TRACKERS.map((tracker) => `tr=${encodeURIComponent(tracker)}`),
  ];

  const magnetLink = `magnet:?${magnetParams.join("&")}`;

  return {
    error: null,
    data: magnetLink,
  };
};

export interface MagnetLinkResult {
  torrent: Torrent;
  magnetLink: string;
}

/**
 * Genera enlaces magnet para todos los torrents de una película
 * @param torrents - Array de torrents
 * @param movieTitle - El título de la película
 * @returns Array de objetos con información del torrent y su enlace magnet
 * @throws Error si no hay torrents válidos o el título es inválido
 */
export const generateMagnetLinks = (
  torrents: Torrent[],
  movieTitle: string,
): { data: MagnetLinkResult[], error: null | string } => {
  if (!torrents || !Array.isArray(torrents)) return {
    error: "La lista de torrents debe ser un array válido",
    data: [],
  }

  if (torrents.length === 0) return {
    error: "No hay torrents disponibles para generar enlaces magnet",
    data: [],
  }

  if (!validateMovieTitle(movieTitle)) return {
    error: "El título de la película no puede estar vacío o ser inválido",
    data: [],
  }

  const processedResults = torrents
    .filter(validateTorrent)
    .map(torrent => ({
      torrent,
      magnetResult: generateMagnetLink(torrent, movieTitle)
    }));

  const results = processedResults
    .filter(({ magnetResult }) => !magnetResult.error)
    .map(({ torrent, magnetResult }) => ({
      torrent,
      magnetLink: magnetResult.data,
    }));

  if (results.length === 0) return {
    error: 'Error al generar los magnets',
    data: [],
  };

  return {
    error: null,
    data: results,
  };
};

/**
 * Copia un enlace magnet al portapapeles
 * @param magnetLink - El enlace magnet a copiar
 * @returns Promise que se resuelve cuando se copia exitosamente
 * @throws Error si el enlace magnet no es válido o no se puede copiar
 */
export const copyMagnetToClipboard = async (
  magnetLink: string,
): Promise<void> => {
  try {
    if (!checkMagnet(magnetLink)) {
      throw new Error("El enlace magnet no tiene un formato válido");
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(magnetLink);
    } else {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");

      textArea.value = magnetLink;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (!successful) {
          throw new Error("No se pudo copiar el enlace magnet usando el método fallback");
        }
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (error) {
    throw new Error(`Error al copiar el enlace magnet: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

/**
 * Valida si un enlace magnet tiene el formato correcto
 * @param magnetLink - El enlace magnet a validar
 * @returns boolean - true si el enlace es válido
 */
export const validateMagnetLink = (magnetLink: string): boolean => {
  if (!checkMagnet(magnetLink.trim())) return false;
  const hashMatch = magnetLink.match(/xt=urn:btih:([a-fA-F0-9]{40})/);
  if (!hashMatch) return false;
  return true;
};

/**
 * Extrae información de un enlace magnet
 * @param magnetLink - El enlace magnet del que extraer información
 * @returns Objeto con información extraída o null si no es válido
 */
export const extractMagnetInfo = (magnetLink: string): {
  hash: string;
  name?: string;
  trackers: string[];
} | null => {
  if (!validateMagnetLink(magnetLink)) return null;
  const urlParams = new URLSearchParams(magnetLink.split('?')[1]);
  const xt = urlParams.get('xt');
  const hash = xt?.replace('urn:btih:', '') || '';
  const name = urlParams.get('dn') || undefined;
  const trackers = urlParams.getAll('tr');
  return {
    hash,
    name,
    trackers
  };
};
