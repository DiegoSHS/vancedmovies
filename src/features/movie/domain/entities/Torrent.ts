import { formatBytes } from "@/utils/torrent";
import { TPBMovie } from "./ThePirateBayMovie";
import { XMovie } from "./1337XMovie";

export interface Torrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  is_repack: string;
  video_codec: string;
  bit_depth: string;
  audio_channels: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}

export const getQualityFromName = (name: string) => {
  return name.match(/(\d{3,4}p)/)?.[1] || 'HD'
}

export const parseSeedPeers = (input: string) => {
  return parseInt(input) || 0
}

export const TPBtoTorrent = (input: TPBMovie): Torrent => {
  const upperName = input.name.toUpperCase()
  const isDual = upperName.includes('DUAL')
  const type = upperName.includes('WEB') ? 'web' : upperName.includes('BLURAY') ? 'bluray' : upperName.includes('HDRIP') ? 'hdrip' : 'hd'
  return {
    url: '',
    hash: input.info_hash,
    audio_channels: '',
    bit_depth: '',
    quality: getQualityFromName(input.name),
    date_uploaded: input.added,
    date_uploaded_unix: 0,
    is_repack: '',
    peers: parseSeedPeers(input.leechers),
    seeds: parseSeedPeers(input.seeders),
    size: formatBytes(parseInt(input.size)),
    size_bytes: parseInt(input.size),
    video_codec: '',
    type: `${type}${isDual ? ' - Dual' : ''}`
  }
}

export const XMovieToTorrent = (input: XMovie): Torrent => {
  return {
    url: '',
    hash: input.info_hash,
    quality: getQualityFromName(input.name),
    type: input.type || '',
    is_repack: '',
    video_codec: '',
    bit_depth: '',
    audio_channels: '',
    seeds: parseSeedPeers(input.seeders),
    peers: parseSeedPeers(input.leechers),
    size: input.size,
    size_bytes: 0, // No disponible
    date_uploaded: input.date_uploaded,
    date_uploaded_unix: 0, // No disponible
  }
}