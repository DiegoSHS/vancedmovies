import { Button, Card, Chip, Dropdown, EmptyState, Link, Switch, Table } from "@heroui/react";
import { useState } from "react";

import { Torrent } from "../../domain/entities/Torrent";

import { copyMagnetToClipboard, MagnetLinkResult } from "@/types";
import { CheckIcon, CopyIcon, DownloadIcon, ListIcon, SquaresIcon } from "@/components/icons";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const handleOpenTorrentApp = (magnetLink: string) => {
  window.open(magnetLink, "_blank");
};

export async function handleMagnetCopy(
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

export const CopyTorrentButton = ({ magnetLink, isIconOnly = false }: { magnetLink: string, isIconOnly?: boolean }) => {
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

export const OpenTorrentButton = ({ magnetLink, isIconOnly = false }: { magnetLink: string, isIconOnly?: boolean }) => {
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
        {
          <DownloadIcon />
        }
        {
          isIconOnly || (
            "Abrir torrent"
          )
        }
      </Button>
    </Link>
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
      </Card.Footer>
    </Card>
  );
};

interface MovieDownloadsProps {
  items: MagnetLinkResult[];
}

export const MovieDownloads = ({ items }: MovieDownloadsProps) => {
  const { item, setItem } = useLocalStorage('viewMode', 'card')
  const swapViewMode = () => {
    if (item === 'table') {
      setItem('card')
    } else {
      setItem('table')
    }
  }
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No hay descargas disponibles
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Descargas disponibles

      </h2>
      <div className="flex w-full items-center justify-end">
        <Switch size="lg" isSelected={item === 'table'} onChange={swapViewMode}>
          {
            ({ isSelected }) => (
              <>
                <Switch.Control className="bg-default">
                  <Switch.Thumb>
                    <Switch.Icon>
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
      </div>
      <div>
        {
          item === 'card' ? (

            <div className="flex flex-wrap gap-2 justify-center items-center">
              {items.sort((prev, next) => next.torrent.seeds - prev.torrent.seeds).map(({ torrent, magnetLink }, index) => (
                <MovieDownloadCard
                  key={index}
                  magnetLink={magnetLink}
                  torrent={torrent}
                />
              ))}
            </div>
          ) : (
            <MovieDownloadsTable items={items}></MovieDownloadsTable>
          )
        }
      </div>
    </div>
  );
};

export const MovieDownloadsTable = ({ items }: MovieDownloadsProps) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Column>
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