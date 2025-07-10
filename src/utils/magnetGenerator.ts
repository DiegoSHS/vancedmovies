import { Movie } from "@/features/movie/domain/entities/1337XMovie";
import { Torrent } from "../features/movie/domain/entities/Torrent";

const TRACKERS = [
  "udp://tracker.opentrackr.org:1337/announce",
  "http://tracker.opentrackr.org:1337/announce",
  "udp://open.demonii.com:1337/announce",
  "udp://open.stealth.si:80/announce",
  "udp://exodus.desync.com:6969/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://explodie.org:6969/announce",
  "udp://wepzone.net:6969/announce",
  "udp://ttk2.nbaonlineservice.com:6969/announce",
  "udp://tracker2.dler.org:80/announce",
  "udp://tracker.tryhackx.org:6969/announce",
  "udp://tracker.therarbg.to:6969/announce",
  "udp://tracker.theoks.net:6969/announce",
  "udp://tracker.srv00.com:6969/announce",
  "udp://tracker.qu.ax:6969/announce",
  "udp://tracker.ololosh.space:6969/announce",
  "udp://tracker.gmi.gd:6969/announce",
  "udp://tracker.gigantino.net:6969/announce",
  "udp://tracker.fnix.net:6969/announce",
  "udp://tracker.filemail.com:6969/announce",
  "udp://tracker.dump.cl:6969/announce",
  "udp://tracker.dler.org:6969/announce",
  "udp://tracker.bittor.pw:1337/announce",
  "udp://tracker-udp.gbitt.info:80/announce",
  "udp://tr4ck3r.duckdns.org:6969/announce",
  "udp://t.overflow.biz:6969/announce",
  "udp://retracker01-msk-virt.corbina.net:80/announce",
  "udp://retracker.lanta.me:2710/announce",
  "udp://public.tracker.vraphim.com:6969/announce",
  "udp://p4p.arenabg.com:1337/announce",
  "udp://opentracker.io:6969/announce",
  "udp://open.free-tracker.ga:6969/announce",
  "udp://open.dstud.io:6969/announce",
  "udp://ns-1.x-fins.com:6969/announce",
  "udp://martin-gebhardt.eu:25/announce",
  "udp://isk.richardsw.club:6969/announce",
  "udp://ipv4.rer.lol:2710/announce",
  "udp://evan.im:6969/announce",
  "udp://discord.heihachi.pw:6969/announce",
  "udp://d40969.acod.regrucolo.ru:6969/announce",
  "udp://bt.ktrackers.com:6666/announce",
  "udp://bittorrent-tracker.e-n-c-r-y-p-t.net:1337/announce",
  "udp://bandito.byterunner.io:6969/announce",
  "udp://1c.premierzal.ru:6969/announce",
  "https://tracker.zhuqiy.top:443/announce",
  "https://tracker.yemekyedim.com:443/announce",
  "https://tracker.pmman.tech:443/announce",
  "https://tracker.moeblog.cn:443/announce",
  "https://tracker.linvk.com:443/announce",
  "https://tracker.itscraftsoftware.my.id:443/announce",
  "https://tracker.ghostchu-services.top:443/announce",
  "https://tracker.gcrenwp.top:443/announce",
  "https://tracker.expli.top:443/announce",
  "https://tracker.bt4g.com:443/announce",
  "https://sparkle.ghostchu-services.top:443/announce",
  "http://www.torrentsnipe.info:2701/announce",
  "http://www.genesis-sp.org:2710/announce",
  "http://wepzone.net:6969/announce",
  "http://tracker810.xyz:11450/announce",
  "http://tracker2.dler.org:80/announce",
  "http://tracker.xiaoduola.xyz:6969/announce",
  "http://tracker.waaa.moe:6969/announce",
  "http://tracker.vanitycore.co:6969/announce",
  "http://tracker.sbsub.com:2710/announce",
  "http://tracker.renfei.net:8080/announce",
  "http://tracker.qu.ax:6969/announce",
  "http://tracker.mywaifu.best:6969/announce",
  "http://tracker.moxing.party:6969/announce",
  "http://tracker.lintk.me:2710/announce",
  "http://tracker.ipv6tracker.org:80/announce",
  "http://tracker.ghostchu-services.top:80/announce",
  "http://tracker.dmcomic.org:2710/announce",
  "http://tracker.corpscorp.online:80/announce",
  "http://tracker.bz:80/announce",
  "http://tracker.bt4g.com:2095/announce",
  "http://tracker.bt-hash.com:80/announce",
  "http://tracker.bittor.pw:1337/announce",
  "http://tracker.23794.top:6969/announce",
  "http://tr.kxmp.cf:80/announce",
  "http://taciturn-shadow.spb.ru:6969/announce",
  "http://t.overflow.biz:6969/announce",
  "http://t.jaekr.sh:6969/announce",
  "http://shubt.net:2710/announce",
  "http://share.hkg-fansub.info:80/announce.php",
  "http://servandroidkino.ru:80/announce",
  "http://seeders-paradise.org:80/announce",
  "http://retracker.spark-rostov.ru:80/announce",
  "http://public.tracker.vraphim.com:6969/announce",
  "http://p4p.arenabg.com:1337/announce",
  "http://open.trackerlist.xyz:80/announce",
  "http://home.yxgz.club:6969/announce",
  "http://highteahop.top:6960/announce",
  "http://finbytes.org:80/announce.php",
  "http://buny.uk:6969/announce",
  "http://bt1.xxxxbt.cc:6969/announce",
  "http://bt.poletracker.org:2710/announce",
  "http://bittorrent-tracker.e-n-c-r-y-p-t.net:1337/announce",
  "http://0d.kebhana.mx:443/announce",
  "http://0123456789nonexistent.com:80/announce",
  "udp://tracker.torrust-demo.com:6969/announce",
  "udp://tracker.ddunlimited.net:6969/announce",
  "udp://p2p.publictracker.xyz:6969/announce",
  "udp://ipv4announce.sktorrent.eu:6969/announce",
  "udp://concen.org:6969/announce",
  "udp://bt.rer.lol:6969/announce",
  "udp://bt.rer.lol:2710/announce",
  "https://tracker.leechshield.link:443/announce",
  "http://tracker1.itzmx.com:8080/announce",
  "http://tracker.zhuqiy.top:80/announce",
  "http://tracker.dler.org:6969/announce",
  "http://tracker.dler.com:6969/announce"
];

const WS_TRACKERS = [
  "wss://tracker.openwebtorrent.com",
  "wss://tracker.btorrent.xyz",
  "wss://tracker.fastcast.nz",
  "wss://tracker.webtorrent.dev",
  "wss://tracker.files.fm:7073/announce",
  "ws://tracker.files.fm:7072/announce"
];

/**
 * Valida que un torrent tenga los datos mínimos necesarios
 * @param torrent - El objeto torrent a validar
 * @returns boolean - true si el torrent es válido
 */
const validateTorrent = (torrent: Torrent): boolean => {
  if (!torrent) {
    return false;
  }

  if (!torrent.hash || typeof torrent.hash !== 'string' || torrent.hash.trim().length === 0) {
    return false;
  }

  const hashRegex = /^[a-fA-F0-9]{40}$/;
  if (!hashRegex.test(torrent.hash.trim())) {
    return false;
  }

  if (!torrent.quality || typeof torrent.quality !== 'string' || torrent.quality.trim().length === 0) {
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
  opts?: { browser?: boolean }
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

  const displayName = `${normalizedTitle} (${normalizedQuality}) [YTS.MX]`;
  const encodedName = encodeURIComponent(displayName);

  // Selecciona trackers según entorno
  let trackers = TRACKERS;
  if (opts?.browser) {
    trackers = WS_TRACKERS;
  }

  if (!trackers || trackers.length === 0) {
    return {
      error: "No hay trackers disponibles para generar el enlace magnet",
      data: "",
    };
  }

  const magnetParams = [
    `xt=urn:btih:${normalizedHash}`,
    `dn=${encodedName}`,
    ...trackers.map((tracker) => `tr=${encodeURIComponent(tracker)}`),
  ];

  const magnetLink = `magnet:?${magnetParams.join("&")}`;

  if (!magnetLink.startsWith("magnet:?")) {
    return {
      error: "Error al generar el enlace magnet",
      data: "",
    };
  }

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

  if (results.length === 0) {
    const errors = processedResults
      .filter(({ magnetResult }) => magnetResult.error)
      .map(({ torrent, magnetResult }) => `Error en torrent ${torrent.quality}: ${magnetResult.error}`);

    const errorMessage = errors.length > 0
      ? `No se encontraron torrents válidos. Errores: ${errors.join(', ')}`
      : "No se encontraron torrents válidos para generar enlaces magnet";

    return {
      error: errorMessage,
      data: [],
    };
  }

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
  // Validar entrada
  if (!magnetLink || typeof magnetLink !== 'string' || magnetLink.trim().length === 0) {
    throw new Error("El enlace magnet no puede estar vacío");
  }

  if (!magnetLink.startsWith("magnet:?")) {
    throw new Error("El enlace magnet no tiene un formato válido");
  }

  try {
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
  if (!magnetLink || typeof magnetLink !== 'string' || magnetLink.trim().length === 0) {
    return false;
  }

  // Debe comenzar con "magnet:?"
  if (!magnetLink.startsWith("magnet:?")) {
    return false;
  }

  // Debe contener al menos un hash (xt=urn:btih:)
  if (!magnetLink.includes("xt=urn:btih:")) {
    return false;
  }

  // Extraer el hash del enlace magnet
  const hashMatch = magnetLink.match(/xt=urn:btih:([a-fA-F0-9]{40})/);
  if (!hashMatch) {
    return false;
  }

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
  if (!validateMagnetLink(magnetLink)) {
    return null;
  }

  const urlParams = new URLSearchParams(magnetLink.split('?')[1]);

  // Extraer hash
  const xt = urlParams.get('xt');
  const hash = xt?.replace('urn:btih:', '') || '';

  // Extraer nombre
  const name = urlParams.get('dn') || undefined;

  // Extraer trackers
  const trackers = urlParams.getAll('tr');

  return {
    hash,
    name,
    trackers
  };
};


export function generateMagnetLinksFromBackend(scrapperTorrents: Movie[]): MagnetLinkResult[] {
  return scrapperTorrents.map(generateMagnetLinkFromBackend);
}

export const generateMagnetLinkFromBackend = (item: Movie): MagnetLinkResult => ({
  torrent: {
    url: '',
    hash: item.info_hash,
    quality: item.name.match(/(\d{3,4}p)/)?.[1] || item.type || 'HD',
    type: item.type || '',
    is_repack: '',
    video_codec: '',
    bit_depth: '',
    audio_channels: '',
    seeds: parseInt(item.seeders) || 0,
    peers: parseInt(item.leechers) || 0,
    size: item.size,
    size_bytes: 0, // No disponible
    date_uploaded: item.date_uploaded,
    date_uploaded_unix: 0, // No disponible
  },
  magnetLink: item.magnet_link,
})