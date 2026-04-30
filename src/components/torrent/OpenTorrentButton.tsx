import { useMovieContext } from "@/features/movie/application/providers/MovieProvider"
import { Button } from "@heroui/react/button"
import { DownloadIcon } from "../icons"

const OpenTorrentButton = ({ torrent, title, isIconOnly = false }: import(".").TorrentActionButtonProps) => {
    const {
        state: { selectedItem },
        torrentState: { selectedItem: selectedTorrent }
    } = useMovieContext()
    const handleClick = async () => {
        const { generateMagnetLink } = await import("@/utils/magnetGenerator")
        const { data } = generateMagnetLink(torrent || selectedTorrent, title || selectedItem?.title || '')
        window.open(data, "_blank")
    }
    return (
        <Button
            variant='ghost'
            isIconOnly={isIconOnly}
            onPress={handleClick}
        >
            <DownloadIcon />
            {
                isIconOnly || (
                    "Abrir torrent"
                )
            }
        </Button>
    )
}

export default OpenTorrentButton