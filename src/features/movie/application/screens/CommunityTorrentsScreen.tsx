import { Button, IconPlus } from "@heroui/react"
import { useEffect, useState } from "react"
import { HashResult } from "../../domain/entities/Hashes"
import { useMovieContext } from "../providers/MovieProvider"
import { MovieCommunityModal } from "../components/MovieCommunityAdd"
import { BackButton } from "@/components/BackButton"
import { CommunityTorrentsTable } from "../components/CommunityTorrentsTable"

export const CommunityTorrentsScreen = () => {
    const {
        getCommunityHashes,
    } = useMovieContext()
    const [torrentHashes, setTorrentHashes] = useState<HashResult[]>([]);
    const [open, setOpen] = useState(false);

    const effect = () => {
        const fetchHashes = async () => {
            const hashes = await getCommunityHashes()
            setTorrentHashes(hashes)
        }
        fetchHashes()
    }
    useEffect(effect, [])

    return (
        <div className="flex flex-col gap-2">
            <div className="text-2xl text-center font-bold">
                Torrents traidos por la comunidad
            </div>
            <div className="flex items-center justify-between">
                <BackButton />
                <MovieCommunityModal
                    isOpen={open}
                    onOpenChange={setOpen}
                    setHashes={setTorrentHashes}
                />
                <Button
                    onPress={() => setOpen(true)}
                    variant="secondary"
                >
                    <IconPlus />
                    Añadir nuevo
                </Button>
            </div>
            <CommunityTorrentsTable items={torrentHashes} />
        </div>
    )
}