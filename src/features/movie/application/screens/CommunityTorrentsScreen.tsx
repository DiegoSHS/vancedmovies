import { Button, EmptyState, Table, TableLayout, Virtualizer } from "@heroui/react"
import { useEffect, useState } from "react"
import { HashResult } from "../../domain/entities/Hashes"
import { useMovieContext } from "../providers/MovieProvider"
import { PlayIcon } from "@/components/icons"
import { useNavigate } from "react-router-dom"
import { useTPBMovieContext } from "../providers/TPBMovieProvider"
import { Torrent } from "../../domain/entities/Torrent"

export const CommunityTorrentsScreen = () => {
    const { getCommunityHashes } = useMovieContext()
    const { selectTorrent } = useTPBMovieContext()
    const navigate = useNavigate()
    const [torrentHashes, setTorrentHashes] = useState<HashResult[]>([]);
    const handleClick = (hash: string) => {
        selectTorrent({ hash } as Torrent)
        navigate('/torrent')
    }
    const effect = () => {
        const fetchHashes = async () => {
            const hashes = await getCommunityHashes()
            setTorrentHashes(hashes)
        }
        fetchHashes()
    }
    useEffect(effect, []);
    return (
        <Virtualizer layout={TableLayout} layoutOptions={{
            headingHeight: 42,
            rowHeight: 60,
        }}>
            <Table>
                <Table.ScrollContainer aria-label="Descargas disponibles">
                    <Table.ResizableContainer>
                        <Table.Content
                            aria-label="Descargas"
                            className="min-w-[400px] max-h-full overflow-auto"
                        >
                            <Table.Header className={'h-full h-full'}>
                                <Table.Column isRowHeader >
                                    Nombre
                                </Table.Column>
                                <Table.Column>
                                    Acciones
                                </Table.Column>
                            </Table.Header>
                            <Table.Body renderEmptyState={() => (
                                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                    <span className="text-sm text-muted">Sin hashes disponibles</span>
                                </EmptyState>
                            )} className={'font-bold'}>
                                <Table.Collection items={torrentHashes}>
                                    {
                                        (item) => (
                                            <Table.Row id={item.hash}>
                                                <Table.Cell>
                                                    {item.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button onClick={() => {
                                                        handleClick(item.hash)
                                                    }}>
                                                        <PlayIcon />
                                                        Ver
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    }
                                </Table.Collection>
                            </Table.Body>
                        </Table.Content>
                    </Table.ResizableContainer>
                </Table.ScrollContainer>
            </Table>
        </Virtualizer>
    )
}