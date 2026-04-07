import { Button, Card, Chip, Dropdown, EmptyState, Link, Switch, Table } from "@heroui/react";
import { useState } from "react";

import { Torrent } from "../../domain/entities/Torrent";

import { copyMagnetToClipboard, MagnetLinkResult } from "@/types";
import { CheckIcon, CopyIcon, DownloadIcon, ListIcon, PlayIcon, SquaresIcon } from "@/components/icons";

async function handleMagnetCopy(
  magnetLink: string,
  setCopied: (value: boolean) => void,
) {
  try {
    await copyMagnetToClipboard(magnetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    setCopied(false);
    setTimeout(() => setCopied(false), 2000);
  }
}

const NoDownloadsAvailable = ({ message = "No hay descargas disponibles" }: { message?: string }) => {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400">
      {message}
    </div>
  )
}

interface TorrentActionButtonProps {
  magnetLink: string
  isIconOnly?: boolean
}

export const CopyTorrentButton = ({ magnetLink, isIconOnly = false }: TorrentActionButtonProps) => {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="secondary"
      isIconOnly={isIconOnly}
      isDisabled={copied}
      className={`${copied ? "text-success" : ""}`}
      onClick={() => handleMagnetCopy(magnetLink, setCopied)}
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

export const OpenTorrentButton = ({ magnetLink, isIconOnly = false }: TorrentActionButtonProps) => {
  return (
    <Link
      href={magnetLink}
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

export const PlayTorrentButton = ({ magnetLink, isIconOnly }: TorrentActionButtonProps) => {
  return (
    <Button
      size="sm"
      variant="secondary"
      isIconOnly={isIconOnly}
      onPress={() => {
        console.log(magnetLink)
      }}
    >
      <PlayIcon />
      Ver
    </Button>
  )
}

interface MovieDownloadOptionsProps {
  items: MagnetLinkResult[];
  isDisabled: boolean;
}

interface MovieDropdownItemProps {
  magnetLink: string;
  torrent: Torrent;
}

export function MovieDropdownItem({
  magnetLink,
  torrent,
}: MovieDropdownItemProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className={`flex items-center justify-between w-full w-full`}
      onClick={() => {
        handleMagnetCopy(magnetLink, setCopied);
      }}>
      <div className="flex gap-2 items-center">
        {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
        <div className="flex gap-1 items-center">
          <span className="font-medium text-sm">{torrent.quality}</span>
          <span className="text-xs opacity-60">{torrent.size}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Chip className="inline-flex items-center px-2 py-1">
          <Chip.Label>{torrent.seeds}</Chip.Label>
        </Chip>
        <Chip className="inline-flex items-center px-2 py-1">
          <Chip.Label>{torrent.peers}</Chip.Label>
        </Chip>
      </div>
    </div>
  );
}

export const MovieDownloadOptions = ({
  items,
  isDisabled,
}: MovieDownloadOptionsProps) => {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <Button isDisabled className="rounded-full px-3 py-1 text-sm">
        No hay descargas disponibles
      </Button>
    );
  }

  return (
    <Dropdown.Root>
      <Button
        size="sm"
        isDisabled={isDisabled}
      >
        <DownloadIcon size={20} />
        Descargar
      </Button>
      <Dropdown.Popover>

        <Dropdown.Menu className="flex flex-col gap-2 ">
          {items
            .slice()
            .sort((prev, next) => next.torrent.seeds - prev.torrent.seeds)
            .map(({ magnetLink, torrent }) => (
              <Dropdown.Item
                id={torrent.hash}
              >
                <MovieDropdownItem magnetLink={magnetLink} torrent={torrent} />
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};

export const MovieDownloadCard = ({
  torrent,
  magnetLink,
}: MagnetLinkResult) => {
  return (
    <Card
      key={torrent.hash}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Card.Header className="flex flex-row gap-2 justify-between">
        <Chip className="inline-flex items-center px-2 py-1">
          <Chip.Label>{torrent.quality}</Chip.Label>
        </Chip>
        <Chip className="inline-flex items-center px-2 py-1 text-sm">
          <Chip.Label>{torrent.type}</Chip.Label>
        </Chip>
      </Card.Header>
      <Card.Content className="flex flex-col gap-2 text-sm py-0 my-0">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
          <span className="font-medium">{torrent.size}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip color="success" className="inline-flex items-center px-2 py-1">
            <Chip.Label>Seeders: {torrent.seeds}</Chip.Label>
          </Chip>
          <Chip color="success" className="inline-flex items-center px-2 py-1">
            <Chip.Label>Peers: {torrent.peers}</Chip.Label>
          </Chip>
        </div>
      </Card.Content>
      <Card.Footer className="flex gap-2">
        <CopyTorrentButton magnetLink={magnetLink} />
        <OpenTorrentButton magnetLink={magnetLink} />
        <PlayTorrentButton magnetLink={magnetLink} />
      </Card.Footer>
    </Card>
  );
};

interface ViewModeSwitchProps {
  mode: string
  swapViewMode: () => void
}

export const ViewModeSwitch = ({ mode, swapViewMode }: ViewModeSwitchProps) => {
  return (
    <Switch size="lg" isSelected={mode === 'table'} onChange={swapViewMode}>
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
      <div>
        {
          mode === 'card' ? (
            <MovieDownloadCards items={items} />
          ) : (
            <MovieDownloadsTable items={items} />
          )
        }
      </div>
    </div >
  );
};

export const MovieDownloadCards = ({ items }: Omit<MovieDownloadsProps, 'mode'>) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      {
        items.map(({ magnetLink, torrent }) => (
          <MovieDownloadCard
            key={torrent.hash}
            magnetLink={magnetLink}
            torrent={torrent}
          />
        ))
      }
    </div>
  )
}

export const MovieDownloadsTable = ({ items }: Omit<MovieDownloadsProps, 'mode'>) => {
  return (
    <Table>
      <Table.ScrollContainer aria-label="Descargas disponibles">
        <Table.Content aria-label="Descargas">
          <Table.Header>
            <Table.Column isRowHeader>
              Calidad
            </Table.Column>
            <Table.Column>
              Tipo
            </Table.Column>
            <Table.Column>
              Tamaño
            </Table.Column>
            <Table.Column>
              Seeds
            </Table.Column>
            <Table.Column>
              Peers
            </Table.Column>
            <Table.Column>
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
                      {item.torrent.type}
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
                      <CopyTorrentButton magnetLink={item.magnetLink} />
                      <OpenTorrentButton magnetLink={item.magnetLink} />
                    </Table.Cell>
                  </Table.Row>
                )
              }
            </Table.Collection>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}