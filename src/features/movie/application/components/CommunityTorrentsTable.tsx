import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react/button'
import { Table } from '@heroui/react/table'
import { TableLayout, Virtualizer, type SortDescriptor } from "@heroui/react"
import { PlayIcon } from '@/components/icons'
import { lazy, useMemo, useState } from 'react'
import { NoDownloadsAvailable } from './MovieDownloads'
const CopyTorrentButton = lazy(() => import("@/components/torrent/CopyTorrentButton"))
const OpenTorrentButton = lazy(() => import("@/components/torrent/OpenTorrentButton"))
const getQualityFromName = lazy(() => import("@/utils/magnetName"))

interface CommunityTorrentTableProps {
    items: import("../../domain/entities/Hashes").HashResult[],
    loading: boolean
}

export const CommunityTorrentsTable: React.FC<CommunityTorrentTableProps> = ({ items, loading }) => {
    const navigate = useNavigate()
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending"
    });
    const sortedItems = useMemo(() => {
        return items.sort((a, b) => {
            let cmp = a.name.localeCompare(b.name)
            if (sortDescriptor.direction === "descending") {
                cmp *= -1
            }
            return cmp
        })
    }, [sortDescriptor, items])
    const RowItem = (item: import("../../domain/entities/Hashes").HashResult) => {
        const quality = getQualityFromName(item.name.toLowerCase())
        const torrent = { hash: item.hash, quality } as import("../../domain/entities/Torrent").Torrent
        const handleClick = async () => {
            const { generateMagnetLink } = await import('@/utils/magnetGenerator')
            const { data } = generateMagnetLink(torrent, item.name)
            navigate(`/torrent/${data}`)
        }
        return (
            <Table.Row key={item.hash} id={item.hash}>
                <Table.Cell>
                    {item.name.replace(/\./g, ' ')}
                </Table.Cell>
                <Table.Cell className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleClick}
                    >
                        <PlayIcon />
                        Ver
                    </Button>
                    <CopyTorrentButton
                        torrent={torrent}
                        title={item.name}
                    />
                    <OpenTorrentButton
                        torrent={torrent}
                        title={item.name}
                    />
                </Table.Cell>
            </Table.Row>
        )
    }
    return (
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
                            className={`${(!sortedItems.length || !items.length) ? 'min-h-[100px] min-w-[100px]' : 'min-w-[500px]'} max-h-full overflow-auto`}
                        >
                            <Table.Header className={'h-full h-full'}>
                                <Table.Column
                                    id="name"
                                    allowsSorting
                                    isRowHeader
                                    minWidth={sortedItems.length ? 150 : 50}
                                >
                                    Nombre
                                </Table.Column>
                                <Table.Column minWidth={sortedItems.length ? 350 : 50}>
                                    Acciones
                                </Table.Column>
                            </Table.Header>
                            <Table.Body renderEmptyState={() => (
                                <NoDownloadsAvailable message={loading ? "Cargando..." : undefined} />
                            )} className={'font-bold'}>
                                <Table.Collection items={sortedItems}>
                                    {RowItem}
                                </Table.Collection>
                            </Table.Body>
                        </Table.Content>
                    </Table.ResizableContainer>
                </Table.ScrollContainer>
            </Table>
        </Virtualizer>
    )
}

export default CommunityTorrentsTable