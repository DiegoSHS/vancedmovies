import { Button, EmptyState, Popover, Table, TableLayout, Virtualizer } from "@heroui/react"
import { useEffect, useState } from "react"
import { HashResult } from "../../domain/entities/Hashes"
import { useMovieContext } from "../providers/MovieProvider"
import { PlayIcon } from "@/components/icons"
import { useNavigate } from "react-router-dom"
import { useTPBMovieContext } from "../providers/TPBMovieProvider"
import { Torrent } from "../../domain/entities/Torrent"
import { CopyTorrentButton } from "../components/MovieDownloads"
import { getQualityFromName } from "@/utils/"
import { Movie } from "../../domain/entities/Movie"

export const CommunityTorrentsScreen = () => {
    const {
        getCommunityHashes,
        selectMovie
    } = useMovieContext()
    const { selectTorrent } = useTPBMovieContext()
    const navigate = useNavigate()
    const [torrentHashes, setTorrentHashes] = useState<HashResult[]>([]);
    const effect = () => {
        const fetchHashes = async () => {
            const hashes = await getCommunityHashes()
            setTorrentHashes(hashes)
        }
        fetchHashes()
    }
    useEffect(effect, []);
    const RowItem = (item: HashResult) => {
        const quality = getQualityFromName(item.name.toLowerCase())
        const torrent = { hash: item.hash, quality } as Torrent
        const movie = { title: item.name } as any as Movie
        return (
            <Table.Row id={item.hash}>
                <Table.Cell>
                    {item.name}
                </Table.Cell>
                <Table.Cell className="flex items-center gap-2">
                    <Button onClick={() => {
                        selectTorrent(torrent)
                        selectMovie(movie)
                        navigate('/community/movies')
                    }}>
                        <PlayIcon />
                        Ver
                    </Button>
                    <Popover>
                        <Popover.Trigger className="button button--secondary">
                            Ver hash
                        </Popover.Trigger>
                        <Popover.Content>
                            <Popover.Dialog className="flex items-center">
                                {item.hash}
                            </Popover.Dialog>
                        </Popover.Content>
                    </Popover>
                    <CopyTorrentButton torrent={torrent} title={item.name} />
                </Table.Cell>
            </Table.Row>
        )
    }
    return (
        <div>
            <div className="text-2xl text-center font-bold">
                Torrents traidos por la comunidad
            </div>
            <Virtualizer layout={TableLayout} layoutOptions={{
                headingHeight: 42,
                rowHeight: 60,
            }}>
                <Table>
                    <Table.ScrollContainer aria-label="Descargas disponibles">
                        <Table.ResizableContainer>
                            <Table.Content
                                aria-label="Descargas"
                                className={`${!torrentHashes.length ? 'min-h-[100px] min-w-[100px]' : 'min-w-[500px]'} max-h-full overflow-auto`}
                            >
                                <Table.Header className={'h-full h-full'}>
                                    <Table.Column isRowHeader minWidth={torrentHashes.length ? 150 : 50}>
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
                                    <Table.Collection items={torrentHashes}>
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