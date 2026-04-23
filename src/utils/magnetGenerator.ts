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
  return `magnet:?xt=${xt}&dn=${dn}&xl=${xl}${tr.join('&tr=')}`
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

  if (!validateTorrent(torrent)) {
    return {
      error: "El torrent debe tener un hash válido (40 caracteres hexadecimales) y una calidad válida",
      data: "",
    };
  }

  const encodedName = encodeURIComponent(movieTitle);
  const magnetParams = [
    `xt=urn:btih:${torrent.hash}`,
    `dn=${encodedName}`,
    ...TRACKERS.map((tracker) => `tr=${encodeURIComponent(tracker)}`),
  ];

  const magnetLink = `magnet:?${magnetParams.join("&")}`;

  return {
    error: null,
    data: magnetLink,
  };
};

/**
 * Extrae información de un enlace magnet
 * @param magnetLink - El enlace magnet del que extraer información
 * @returns Objeto con información extraída o null si no es válido
 */
export const extractMagnetInfo = (magnetLink: string): {
  hash: string;
  name: string;
  trackers: string[];
} | null => {
  if (!checkMagnet(magnetLink)) return null;
  const urlParams = new URLSearchParams(magnetLink.split('?')[1]);
  const xt = urlParams.get('xt');
  const hash = xt?.replace('urn:btih:', '') || '';
  const name = urlParams.get('dn') || ''
  const trackers = urlParams.getAll('tr') || [];
  return {
    hash,
    name,
    trackers
  };
};
