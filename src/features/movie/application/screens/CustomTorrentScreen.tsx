import { Button, Input } from "@heroui/react"
import { VideoPlayer } from "../components/VideoPlayer"
import { useEffect, useState } from "react"
import { useTPBMovieContext } from "../providers/TPBMovieProvider"
import { Torrent } from "../../domain/entities/Torrent"
import { useSearchParams } from "react-router-dom"

export const CustomTorrentScreen: React.FC = () => {
    const { selectMagnetLink, state: { selectedItem } } = useTPBMovieContext()
    const [searchParams] = useSearchParams()

    const [moviePlayerState, setMoviePlayerState] = useState({
        disabled: false,
        movieTitle: "Tu propia pelicula"
    });

    const setMagnetLink = async (magnet: string) => {
        const {
            checkMagnet,
            extractMagnetInfo
        } = await import('../../../../utils/magnetGenerator')
        if (!checkMagnet(magnet)) return
        const result = extractMagnetInfo(magnet)
        if (result) {
            setMoviePlayerState(prev => ({ ...prev, movieTitle: result.name?.replace(/\./g, ' ') || '' }))
        }
        selectMagnetLink({
            magnetLink: magnet,
            torrent: {} as Torrent
        })
        setMoviePlayerState(prev => ({ ...prev, disabled: true }))
        const {
            toast
        } = await import('@heroui/react')
        toast.success('Magnet añadido con éxito')
    }
    const useMagnetFromUrl = async () => {
        const { getMagnetLinkFromURL } = await import('../../../../utils/magnetGenerator')
        const magnetLink = getMagnetLinkFromURL(searchParams)
        if (magnetLink) {
            await setMagnetLink(magnetLink)
        }
    }
    useEffect(() => {
        useMagnetFromUrl()
    }, [searchParams])
    return (
        <div className="flex flex-col gap-2">
            <div className="text-2xl text-center font-bold">
                Reproductor para videos externos
            </div>
            <div className="flex w-full gap-2">
                <Input
                    fullWidth
                    placeholder="Escribe el link de la película que quieres ver"
                    defaultValue={selectedItem?.magnetLink}
                    onChange={(e) => {
                        setMagnetLink(e.target.value)
                    }}
                    disabled={moviePlayerState.disabled}
                />
                <Button
                    isDisabled={selectedItem?.magnetLink.trim() === ''}
                    onPress={() => {
                        setMoviePlayerState(prev => ({ ...prev, disabled: false }))
                    }}
                >
                    Editar
                </Button>
            </div>
            <VideoPlayer movieTitle={moviePlayerState.movieTitle} />
        </div>
    )
}