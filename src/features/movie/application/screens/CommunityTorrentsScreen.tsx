import { Button } from "@heroui/react/button"
import { lazy, useEffect, useState } from "react"
import { useMovieContext } from "../providers/MovieProvider"
import { PlusIcon } from "@/components/icons"
const MovieCommunityModal = lazy(() => import("../components/MovieCommunityAdd"))
const BackButton = lazy(() => import("@/components/BackButton"))
const CommunityTorrentsTable = lazy(() => import("../components/CommunityTorrentsTable"))

export const CommunityTorrentsScreen = () => {
    const {
        getCommunityHashes,
        status
    } = useMovieContext()
    const [torrentHashes, setTorrentHashes] = useState<import("../../domain/entities/Hashes").HashResult[]>([]);
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
                    variant="tertiary"
                    onPress={() => setOpen(true)}
                >
                    <PlusIcon />
                    Añadir nuevo
                </Button>
            </div>
            <CommunityTorrentsTable loading={status === "loading"} items={torrentHashes} />
        </div>
    )
}