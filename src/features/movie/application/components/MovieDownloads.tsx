import { Card } from "@heroui/react/card";
import { Chip } from "@heroui/react/chip";
import { EmptyState } from "@heroui/react/empty-state";
import { Popover } from "@heroui/react/popover";
import { Table } from "@heroui/react/table";
import { TableLayout, Virtualizer } from "@heroui/react";
import { Repeater } from "@/components/Repeater";
import { lazy } from "react";
import { useMovieContext } from "../providers/MovieProvider";
const CopyTorrentButton = lazy(() => import("@/components/torrent/CopyTorrentButton"))
const OpenTorrentButton = lazy(() => import("@/components/torrent/OpenTorrentButton"))
const PlayTorrentButton = lazy(() => import("@/components/torrent/PlayTorrentButton"))

export const NoDownloadsAvailable = ({ message = "Sin descargas disponibles" }: { message?: string }) => {
  return (
    <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <span className="text-sm text-muted">{message}</span>
    </EmptyState>
  )
}

const MovieDownloadCard = ({ item,
}: { item: import("../../domain/entities/Torrent").Torrent }) => {
  return (
    <Card
      key={item.hash}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Card.Header className="flex flex-row gap-2 justify-between">
        <Chip className="inline-flex items-center px-2 py-1">
          <Chip.Label>{item.quality}</Chip.Label>
        </Chip>

        <Popover>
          <Popover.Trigger className="bg-default rounded-full m-0 py-1.5 px-3 font-medium text-sm">
            Detalles
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Dialog>
              {item.type || "Sin detalles"}
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </Card.Header>
      <Card.Content className="flex flex-col gap-2 text-sm py-0 my-0">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
          <span className="font-medium">{item.size}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip color="success" className="inline-flex items-center px-2 py-1">
            <Chip.Label>Seeders: {item.seeds}</Chip.Label>
          </Chip>
          <Chip color="success" className="inline-flex items-center px-2 py-1">
            <Chip.Label>Peers: {item.peers}</Chip.Label>
          </Chip>
        </div>
      </Card.Content>
      <Card.Footer className="flex gap-2">
        <CopyTorrentButton torrent={item} />
        <OpenTorrentButton torrent={item} />
        <PlayTorrentButton torrent={item} />
      </Card.Footer>
    </Card>
  );
};



const MovieDownloadCards = ({ items }: Omit<MovieDownloadsProps, 'mode'>) => {
  if (!items.length) return <NoDownloadsAvailable />
  const Item = (item: import("../../domain/entities/Torrent").Torrent) => {
    return (
      <MovieDownloadCard
        key={item.hash}
        item={item}
      />
    )
  }
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      <Repeater items={items}>
        {Item}
      </Repeater>
    </div>
  )
}

interface MovieDownloadsProps {
  items: import("../../domain/entities/Torrent").Torrent[];
  mode: string
}

export const MovieDownloadsTable = ({ items }: Omit<MovieDownloadsProps, 'mode'>) => {

  const RowItem = (item: import("../../domain/entities/Torrent").Torrent) => (
    <Table.Row id={item.hash}>
      <Table.Cell>
        {item.quality}
      </Table.Cell>
      <Table.Cell>
        <Popover>
          <Popover.Trigger>
            Detalles
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Dialog>
              <Popover.Heading>
                {item.type}
              </Popover.Heading>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </Table.Cell>
      <Table.Cell>
        {item.size}
      </Table.Cell>
      <Table.Cell className={'text-success'}>
        {item.seeds}
      </Table.Cell>
      <Table.Cell className={'text-success'}>
        {item.peers}
      </Table.Cell>
      <Table.Cell className="flex gap-1">
        <CopyTorrentButton torrent={item} />
        <OpenTorrentButton torrent={item} />
        <PlayTorrentButton torrent={item} />
      </Table.Cell>
    </Table.Row>
  )

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
              className="min-w-[770px] max-h-[300px] overflow-auto"
            >
              <Table.Header className={'h-full h-full'}>
                <Table.Column isRowHeader minWidth={75}>
                  Calidad
                </Table.Column>
                <Table.Column minWidth={100}>
                  Detalles
                </Table.Column>
                <Table.Column minWidth={100}>
                  Tamaño
                </Table.Column>
                <Table.Column minWidth={75}>
                  Seeds
                </Table.Column>
                <Table.Column minWidth={75}>
                  Peers
                </Table.Column>
                <Table.Column minWidth={330}>
                  Accciones
                </Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => (
                <NoDownloadsAvailable />
              )} className={'font-bold'}>
                <Table.Collection items={items}>
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

export const MovieDownloads = ({ mode }: Omit<MovieDownloadsProps, 'items'>) => {
  const { torrentState: { items } } = useMovieContext()
  return (
    <div className="flex w-full flex-col gap-2 items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Descargas disponibles
      </h2>
      {
        mode === 'card' ? (
          <MovieDownloadCards items={items} />
        ) : (
          <MovieDownloadsTable items={items} />
        )
      }
    </div >
  );
}

export default MovieDownloads