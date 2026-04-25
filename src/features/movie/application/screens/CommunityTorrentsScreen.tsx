import { Button, EmptyState, IconPlus, Table, TableLayout, Virtualizer } from "@heroui/react"
import type { SortDescriptor } from "@heroui/react"
import { useEffect, useMemo, useState } from "react"
import { HashResult } from "../../domain/entities/Hashes"
import { useMovieContext } from "../providers/MovieProvider"
import { PlayIcon } from "@/components/icons"
import { useNavigate } from "react-router-dom"
import { Torrent } from "../../domain/entities/Torrent"
import { CopyTorrentButton, OpenTorrentButton } from "../components/MovieDownloads"
import { getQualityFromName } from "@/utils/"
import { MovieCommunityModal } from "../components/MovieCommunityAdd"

export const CommunityTorrentsScreen = () => {
    const {
        getCommunityHashes,
    } = useMovieContext()
    const navigate = useNavigate()
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending"
    });
    const [torrentHashes, setTorrentHashes] = useState<HashResult[]>([]);
    const [open, setOpen] = useState(false);
    const sortedHashes = useMemo(() => {
        return torrentHashes.sort((a, b) => {
            let cmp = a.name.localeCompare(b.name)
            if (sortDescriptor.direction === "descending") {
                cmp *= -1
            }
            return cmp
        })
    }, [sortDescriptor, torrentHashes])
    const effect = () => {
        const fetchHashes = async () => {
            const hashes = await getCommunityHashes()
            setTorrentHashes(hashes)
        }
        fetchHashes()
    }
    useEffect(effect, [])

    const RowItem = (item: HashResult) => {
        const quality = getQualityFromName(item.name.toLowerCase())
        const torrent = { hash: item.hash, quality } as Torrent
        const handleClick = async () => {
            const { generateMagnetLink } = await import('@/utils/magnetGenerator')
            const { data } = generateMagnetLink(torrent, item.name)
            navigate(`/torrent/${data}`)
        }
        return (
            <Table.Row key={item.hash} id={item.hash}>
                <Table.Cell>
                    {item.name}
                </Table.Cell>
                <Table.Cell className="flex items-center gap-2">
                    <Button onClick={handleClick}>
                        <PlayIcon />
                        Ver
                    </Button>
                    <CopyTorrentButton torrent={torrent} title={item.name} />
                    <OpenTorrentButton torrent={torrent} title={item.name} />
                </Table.Cell>
            </Table.Row>
        )
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="text-2xl text-center font-bold">
                Torrents traidos por la comunidad
            </div>
            <MovieCommunityModal
                isOpen={open}
                onOpenChange={setOpen}
                setHashes={setTorrentHashes}
            />
            <Button
                onPress={() => setOpen(true)}
                className={"self-end"}
                variant="secondary"
            >
                <IconPlus />
                Añadir nuevo
            </Button>
            <Virtualizer layout={TableLayout} layoutOptions={{
                headingHeight: 42,
                rowHeight: 60,
            }}>
                <Table>
                    <Table.ScrollContainer aria-label="Descargas disponibles">
                        <Table.ResizableContainer>
                            <Table.Content
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                                aria-label="Descargas"
                                className={`${!torrentHashes.length ? 'min-h-[100px] min-w-[100px]' : 'min-w-[500px]'} max-h-full overflow-auto`}
                            >
                                <Table.Header className={'h-full h-full'}>
                                    <Table.Column
                                        id="name"
                                        allowsSorting
                                        isRowHeader
                                        minWidth={torrentHashes.length ? 150 : 50}
                                    >
                                        Nombre
                                    </Table.Column>
                                    <Table.Column minWidth={torrentHashes.length ? 350 : 50}>
                                        Acciones
                                    </Table.Column>
                                </Table.Header>
                                <Table.Body renderEmptyState={() => (
                                    <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                        <span className="text-sm text-muted">Sin hashes disponibles</span>
                                    </EmptyState>
                                )} className={'font-bold'}>
                                    <Table.Collection items={!sortedHashes.length ? torrentHashes : sortedHashes}>
                                        {RowItem}
                                    </Table.Collection>
                                </Table.Body>
                            </Table.Content>
                        </Table.ResizableContainer>
                    </Table.ScrollContainer>
                </Table>
            </Virtualizer>
        </div>
    )
}