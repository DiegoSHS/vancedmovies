import { TPBMovie } from "./ThePirateBayMovie";

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

export const TPBtoTorrent = (input: TPBMovie): Torrent => {
  return {
    url: '',
    hash: input.info_hash,
    audio_channels: '',
    bit_depth: '',
    quality: '',
    date_uploaded: input.added,
    date_uploaded_unix: 0,
    is_repack: '',
    peers: parseInt(input.leechers),
    seeds: parseInt(input.seeders),
    size: input.size,
    size_bytes: 0,
    video_codec: '',
    type: ''
  }
}