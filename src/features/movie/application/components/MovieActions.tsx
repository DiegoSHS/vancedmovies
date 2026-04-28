import { generateMagnetLink } from '@/utils/magnetGenerator'
import { useMovieContext } from '../providers/MovieProvider'
import { useTPBMovieContext } from '../providers/TPBMovieProvider'
import { Button, Link } from '@heroui/react'
import { CheckIcon, CopyIcon, DownloadIcon, PlayIcon } from '@/components/icons'
import { useMagnetCopy } from '@/hooks/useMagnetCopy'
import { Torrent } from '../../domain/entities/Torrent'

interface TorrentActionButtonProps {
    torrent: Torrent
    title?: string
    isIconOnly?: boolean
}

export const CopyTorrentButton = ({ torrent, title, isIconOnly = false }: TorrentActionButtonProps) => {
    const { copied, CopyToClipboard } = useMagnetCopy()
    const { state: { selectedItem } } = useMovieContext()
    const handleClick = async () => {
        const { generateMagnetLink } = await import('@/utils/magnetGenerator')
        const { toast } = await import('@heroui/react')
        const { data, error } = generateMagnetLink(torrent, title || selectedItem?.title || 'Movie name')
        if (error) {
            toast.warning(error)
            return
        }
        CopyToClipboard(data)
        toast.success('Copiado al portapapeles')
    }

    return (
        <Button
            size="sm"
            variant="ghost"
            isIconOnly={isIconOnly}
            isDisabled={copied}
            className={`${copied ? "text-success" : ""}`}
            onClick={handleClick}
        >
            {
                copied ? <CheckIcon /> : <CopyIcon />
            }
            {
                isIconOnly || (
                    "Copiar"
                )
            }
        </Button>
    )
}

export const OpenTorrentButton = ({ torrent, title, isIconOnly = false }: TorrentActionButtonProps) => {
    const { state: { selectedItem } } = useMovieContext()
    const { state: { selectedItem: selectedTorrent } } = useTPBMovieContext()
    const { data } = generateMagnetLink(torrent || selectedTorrent, title || selectedItem?.title || '')

    return (
        <Link
            className={`button button--ghost button--sm gap-2 no-underline ${isIconOnly && "button--icon-only"}`}
            href={data}
        >
            <DownloadIcon />
            {
                isIconOnly || (
                    "Abrir torrent"
                )
            }
        </Link>
    )
}

export const PlayTorrentButton = ({ torrent, isIconOnly }: TorrentActionButtonProps) => {
    const { selectTorrent } = useTPBMovieContext()
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