import { Button } from "@heroui/react/button"
import { PlayIcon } from "../icons"
import { useMovieContext } from "@/features/movie/application/providers/MovieProvider"

const PlayTorrentButton = ({ torrent, isIconOnly }: import(".").TorrentActionButtonProps) => {
    const { selectTorrent } = useMovieContext()
    const handleClick = () => {
        if (!torrent) return
        selectTorrent(torrent)
    }
    return (
        <Button
            size="sm"
            variant="ghost"
            isIconOnly={isIconOnly}
            onPress={handleClick}
        >
            <PlayIcon />
            {
                isIconOnly || (
                    "Ver"
                )
            }
        </Button>
    )
}

export default PlayTorrentButton