
export const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const filterUniqueTorrents = (torrents: import("@/features/movie/domain/entities/Torrent").Torrent[]) => {
    const hashes = new Set<string>()
    return torrents
        .filter((item) => {
            if (!hashes.has(item.hash)) {
                hashes.add(item.hash)
                return true
            }
            return false
        })
}