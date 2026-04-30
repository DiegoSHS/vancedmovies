import { useMovieContext } from '@/features/movie/application/providers/MovieProvider'
import { useMagnetCopy } from '@/hooks/useMagnetCopy'
import { Button } from '@heroui/react/button'
import { CheckIcon, CopyIcon } from '../icons'

export default function CopyTorrentButton({ torrent, title, isIconOnly = false }: import(".").TorrentActionButtonProps) {
    const { copied, CopyToClipboard } = useMagnetCopy()
    const { state: { selectedItem } } = useMovieContext()
    const handleClick = async () => {
        const { generateMagnetLink } = await import('@/utils/magnetGenerator')
        const { toast } = await import('@heroui/react/toast')
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