import { Button, Input } from "@heroui/react"
import { VideoPlayer } from "../components/VideoPlayer"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useMovieContext } from "../providers/MovieProvider"

export const CustomTorrentScreen: React.FC = () => {
    const [searchParams] = useSearchParams()
    const [moviePlayerState, setMoviePlayerState] = useState({
        disabled: false,
        magnetLink: '',
        movieTitle: "Disfruta de tu pelicula",
        hash: ''
    });
    const {
        addCommunityHash,
    } = useMovieContext()
    const setMagnetLink = async (magnet: string) => {
        const {
            extractMagnetInfo
        } = await import('@/utils/magnetGenerator')
        const result = extractMagnetInfo(magnet)
        if (!result) return
        const {
            toast
        } = await import('@heroui/react')
        const splitTorrentName = result.name.toLowerCase().split(/(\d{3,4}p)/)
        const movieName = splitTorrentName[0].replace(/\./g, ' ').slice(0, -5)
        toast.success('Enlace magnet válido, cargando película...')
        setMoviePlayerState(prev => ({
            ...prev,
            magnetLink: magnet,
            movieTitle: movieName,
            disabled: true,
            hash: result.hash
        }))
    }
    const useMagnetFromUrl = async () => {
        const {
            getMagnetLinkFromURL,
        } = await import('@/utils/magnetGenerator')
        const magnetLink = getMagnetLinkFromURL(searchParams)
        if (!magnetLink) return
        await setMagnetLink(magnetLink)
    }
    const saveTorrentToCommunity = () => {
        const { movieTitle, hash } = moviePlayerState
        addCommunityHash(movieTitle, hash)
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
                    defaultValue={moviePlayerState.magnetLink}
                    onChange={(e) => {
                        setMagnetLink(e.target.value)
                    }}
                    disabled={moviePlayerState.disabled}
                />
                <Button
                    onPress={() => {
                        setMoviePlayerState(prev => ({ ...prev, disabled: false }))
                    }}
                >
                    Editar
                </Button>
                {
                    moviePlayerState.disabled && (
                        <Button
                            onPress={saveTorrentToCommunity}
                        >
                            Añadir a la comunidad
                        </Button>
                    )
                }
            </div>
            <VideoPlayer magnetLink={moviePlayerState.magnetLink} movieTitle={moviePlayerState.movieTitle} />
        </div>
    )
}