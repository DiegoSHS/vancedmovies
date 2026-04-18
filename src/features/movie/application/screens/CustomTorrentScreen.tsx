import { Button, Input, toast } from "@heroui/react"
import { VideoPlayer } from "../components/VideoPlayer"
import { ChangeEvent, useState } from "react"
import { checkMagnet, extractMagnetInfo } from "@/types"
import { useTPBMovieContext } from "../providers/TPBMovieProvider"
import { Torrent } from "../../domain/entities/Torrent"

export const CustomTorrentScreen: React.FC = () => {
    const { selectMagnetLink, state: { selectedItem } } = useTPBMovieContext()
    const [disabled, setDisabled] = useState(false);
    const [movieTitle, setMovieTitle] = useState("Tu propia pelicula");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!checkMagnet(event.target.value)) return
        const result = extractMagnetInfo(event.target.value)
        if (result) {
            setMovieTitle(result.name?.replace(/\./g, ' ') || '')
        }
        toast.success('Magnet añadido con éxito')
        selectMagnetLink({
            magnetLink: event.target.value,
            torrent: {} as Torrent
        })
        setDisabled(true)
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="text-2xl text-center font-bold">
                Reproductor para videos externos
            </div>
            <div className="flex w-full gap-2">
                <Input
                    fullWidth
                    placeholder="Escribe el link de la película que quieres ver"
                    onChange={handleChange}
                    disabled={disabled}
                />
                <Button
                    isDisabled={selectedItem?.magnetLink.trim() === ''}
                    onPress={() => {
                        setDisabled(false)
                    }}
                >
                    Editar
                </Button>
            </div>
            <VideoPlayer movieTitle={movieTitle} />
        </div>
    )
}