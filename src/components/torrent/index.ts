export interface TorrentActionButtonProps {
    torrent: import("@/features/movie/domain/entities/Torrent").Torrent
    title?: string
    isIconOnly?: boolean
}