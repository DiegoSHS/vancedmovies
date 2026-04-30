import { Button } from "@heroui/react/button"
import { lazy, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useMovieContext } from "../providers/MovieProvider"
import { PlusIcon } from "@/components/icons"
const VideoPlayer = lazy(() => import("../components/VideoPlayer"))
const MagnetInput = lazy(() => import("../components/MagnetInput"))
const BackButton = lazy(() => import("@/components/BackButton"))

export const CustomTorrentScreen: React.FC = () => {
    const [searchParams] = useSearchParams()
    const [moviePlayerState, setMoviePlayerState] = useState({
        isInvalid: true,
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
        const result = await extractMagnetInfo(magnet)
        setMoviePlayerState(prev => ({
            ...prev,
            magnetLink: magnet
        }))
        if (!result) {
            setMoviePlayerState(prev => ({
                ...prev,
                isInvalid: true
            }))
            return
        }
        const {
            toast
        } = await import('@heroui/react')
        toast.success('Enlace magnet válido, cargando película...')
        setMoviePlayerState(prev => ({
            ...prev,
            magnetLink: magnet,
            movieTitle: result.name,
            isInvalid: false,
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
                Reproductor para magnets
            </div>
            <BackButton />
            <div className="flex flex-col w-full gap-2">
                <MagnetInput magnet={moviePlayerState.magnetLink} onChange={setMagnetLink} />
                <Button
                    className="self-end"
                    isDisabled={moviePlayerState.isInvalid}
                    onPress={saveTorrentToCommunity}
                >
                    <PlusIcon />
                    Añadir a la comunidad
                </Button>
            </div>
            <VideoPlayer
                magnetLink={moviePlayerState.isInvalid ? '' : moviePlayerState.magnetLink}
                movieTitle={moviePlayerState.movieTitle.replace(/\./g, ' ')}
            />
        </div>
    )
}