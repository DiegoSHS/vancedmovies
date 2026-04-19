import { Button, Card, Chip, Dropdown, EmptyState, Link, Popover, Switch, Table, TableLayout, Virtualizer } from "@heroui/react";
import { CheckIcon, CopyIcon, DownloadIcon, ListIcon, PlayIcon, SquaresIcon } from "@/components/icons";
import { useTPBMovieContext } from "../providers/TPBMovieProvider";
import { useMagnetCopy } from "@/hooks/useMagnetCopy";
import { MagnetLinkResult } from "@/utils/magnetGenerator";

const NoDownloadsAvailable = ({ message = "No hay descargas disponibles" }: { message?: string }) => {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400">
      {message}
    </div>
  )
}

interface TorrentActionButtonProps {
  torrent: MagnetLinkResult
  isIconOnly?: boolean
}

export const CopyTorrentButton = ({ torrent, isIconOnly = false }: TorrentActionButtonProps) => {
  const { copied, CopyToClipboard } = useMagnetCopy()
  const handleClick = async () => {
    const { toast } = await import('@heroui/react')
    CopyToClipboard(torrent.magnetLink)
    toast.success('Copiado al portapapeles')
  }
  return (
    <Button
      size="sm"
      variant="secondary"
      isIconOnly={isIconOnly}
      isDisabled={copied}
      className={`${copied ? "text-success" : ""}`}
      onClick={handleClick}
    >
      {
        copied ? <CheckIcon /> : <CopyIcon />
      }
      {
        isIconOnly || (
          "Copiar"
        )
      }
    </Button>
  )
}

export const OpenTorrentButton = ({ torrent, isIconOnly = false }: TorrentActionButtonProps) => {
  return (
    <Link
      href={torrent.magnetLink}
      target="_blank"
      rel="noreferrer noopener"
      className="no-underline"
    >
      <Button
        size="sm"
        variant="secondary"
        isIconOnly={isIconOnly}
      >
        <DownloadIcon />
        {
          isIconOnly || (
            "Abrir torrent"
          )
        }
      </Button>
    </Link>
  )
}

export const PlayTorrentButton = ({ torrent, isIconOnly }: TorrentActionButtonProps) => {
  const { selectMagnetLink } = useTPBMovieContext()
  const handleClick = () => {
    selectMagnetLink(torrent)
  }
  return (
    <Button
      size="sm"
      variant="secondary"
      isIconOnly={isIconOnly}
      onPress={handleClick}
    >
      <PlayIcon />
      {
        isIconOnly || (
          "Ver"
        )
      }
    </Button>
  )
}

const MovieDownloadCard = ({ item,
}: { item: MagnetLinkResult }) => {
  return (
    <Card
      key={item.torrent.hash}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Card.Header className="flex flex-row gap-2 justify-between">
        <Chip className="inline-flex items-center px-2 py-1">
          <Chip.Label>{item.torrent.quality}</Chip.Label>
        </Chip>

        <Dropdown>
          <Dropdown.Trigger className="bg-default rounded-full m-0 py-1.5 px-3 text-accent font-medium text-sm">
            Detalles
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Item className="hover:cursor-default">
                {item.torrent.type}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </Card.Header>
      <Card.Content className="flex flex-col gap-2 text-sm py-0 my-0">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
          <span className="font-medium">{item.torrent.size}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip color="success" className="inline-flex items-center px-2 py-1">
            <Chip.Label>Seeders: {item.torrent.seeds}</Chip.Label>
          </Chip>
          <Chip color="success" className="inline-flex items-center px-2 py-1">
            <Chip.Label>Peers: {item.torrent.peers}</Chip.Label>
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
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      {
        items.map((item) => (
          <MovieDownloadCard
            key={item.torrent.hash}
            item={item}
          />
        ))
      }
    </div>
  )
}
interface ViewModeSwitchProps {
  mode: string
  isDisabled?: boolean
  swapViewMode: () => void
}

export const ViewModeSwitch = ({ mode, isDisabled = false, swapViewMode }: ViewModeSwitchProps) => {
  return (
    <Switch isDisabled={isDisabled} size="lg" isSelected={mode === 'table'} onChange={swapViewMode}>
      {
        ({ isSelected }) => (
          <>
            <Switch.Control className="bg-default">
              <Switch.Thumb>
                <Switch.Icon className="text-default">
                  {
                    isSelected ? (
                      <ListIcon className="size-5" />
                    ) : (
                      <SquaresIcon className="size-5" />
                    )
                  }
                </Switch.Icon>
              </Switch.Thumb>
            </Switch.Control>
          </>
        )
      }
    </Switch>
  )
}

interface MovieDownloadsProps {
  items: MagnetLinkResult[];
  mode: string
}


export const MovieDownloads = ({ items, mode }: MovieDownloadsProps) => {
  if (!items || items.length === 0) {
    return (
      <NoDownloadsAvailable />
    );
  }

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
};


export const MovieDownloadsTable = ({ items }: Omit<MovieDownloadsProps, 'mode'>) => {
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
                <Table.Column isRowHeader width={75}>
                  Calidad
                </Table.Column>
                <Table.Column width={100}>
                  Detalles
                </Table.Column>
                <Table.Column width={100}>
                  Tamaño
                </Table.Column>
                <Table.Column width={75}>
                  Seeds
                </Table.Column>
                <Table.Column width={75}>
                  Peers
                </Table.Column>
                <Table.Column width={330}>
                  Accciones
                </Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  <span className="text-sm text-muted">Sin descargas disponibles</span>
                </EmptyState>
              )} className={'font-bold'}>
                <Table.Collection items={items}>
                  {
                    (item) => (
                      <Table.Row id={item.torrent.hash}>
                        <Table.Cell>
                          {item.torrent.quality}
                        </Table.Cell>
                        <Table.Cell>
                          <Popover>
                            <Popover.Trigger>
                              Detalles
                            </Popover.Trigger>
                            <Popover.Content>
                              <Popover.Dialog>
                                <Popover.Heading>
                                  {item.torrent.type}
                                </Popover.Heading>
                              </Popover.Dialog>
                            </Popover.Content>
                          </Popover>
                        </Table.Cell>
                        <Table.Cell>
                          {item.torrent.size}
                        </Table.Cell>
                        <Table.Cell className={'text-success'}>
                          {item.torrent.seeds}
                        </Table.Cell>
                        <Table.Cell className={'text-success'}>
                          {item.torrent.peers}
                        </Table.Cell>
                        <Table.Cell className="flex gap-1">
                          <CopyTorrentButton torrent={item} />
                          <OpenTorrentButton torrent={item} />
                          <PlayTorrentButton torrent={item} />
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