import { getQualityFromName } from '@/utils'
import { useNavigate } from 'react-router-dom'
import { HashResult } from '../../domain/entities/Hashes'
import { Torrent } from '../../domain/entities/Torrent'
import { Button, EmptyState, Table, TableLayout, Virtualizer } from '@heroui/react'
import type { SortDescriptor } from "@heroui/react"
import { PlayIcon } from '@/components/icons'
import { useMemo, useState } from 'react'
import { CopyTorrentButton, OpenTorrentButton } from './MovieActions'

interface CommunityTorrentTableProps {
    items: HashResult[]
}

export const CommunityTorrentsTable: React.FC<CommunityTorrentTableProps> = ({ items }) => {
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
                                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                    <span className="text-sm text-muted">Sin hashes disponibles</span>
                                </EmptyState>
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