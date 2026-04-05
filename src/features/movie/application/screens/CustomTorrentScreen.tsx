import { Button, Input, toast } from "@heroui/react"
import { VideoPlayer } from "../components/VideoPlayer"
import { ChangeEvent, useState } from "react"
import { extractMagnetInfo } from "@/types"

export const CustomTorrentScreen: React.FC = () => {
    /**
     * Source - https://stackoverflow.com/a/19707059
     * Posted by Jimbo, modified by community.
     * See post 'Timeline' for change history
     * Retrieved 2026-04-02, License - CC BY-SA 4.0
     */
    const magnetRegExp = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i

    const [magnetLink, setMagnetLink] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [movieTitle, setMovieTitle] = useState("Tu propia pelicula");
    const checkMagnet = (magnet: string) => {
        return magnet.match(magnetRegExp)
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        if (!checkMagnet(event.target.value)) return
        const result = extractMagnetInfo(event.target.value)
        if (result !== null) {
            setMovieTitle(result.name?.replace(/\./g, ' ') || '')
        }
        toast.success('Magnet añadido con éxito')
        setMagnetLink(event.target.value)
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
                    isDisabled={magnetLink.trim() === ''}
                    onPress={() => {
                        setDisabled(false)
                    }}
                >
                    Editar
                </Button>
            </div>
            <VideoPlayer movieTitle={movieTitle} magnetLink={magnetLink} />
        </div>
    )
}