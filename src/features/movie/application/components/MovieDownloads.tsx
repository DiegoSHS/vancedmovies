import { Button, Card, Chip, Dropdown } from "@heroui/react";
import { useState } from "react";

import { Torrent } from "../../domain/entities/Torrent";

import { copyMagnetToClipboard, MagnetLinkResult } from "@/types";
import { CheckIcon, CopyIcon, DownloadIcon } from "@/components/icons";

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
  const [copied, setCopied] = useState<boolean>(false);

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
        <Button
          size="sm"
          isDisabled={copied}
          className={`${copied ? "bg-success" : "bg-primary "}`}
          onClick={() => handleMagnetCopy(magnetLink, setCopied)}
        >
          {copied ? <><CheckIcon size={20} /> Copiado</> : <><CopyIcon size={20} /> Copiar enlace</>}
        </Button>
        <a
          href={magnetLink}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Button size="sm" variant="secondary">
            Abrir torrent
          </Button>
        </a>
      </Card.Footer>
    </Card>
  );
};

interface MovieDownloadsProps {
  items: MagnetLinkResult[];
}

export const MovieDownloads = ({ items }: MovieDownloadsProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No hay descargas disponibles
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Descargas disponibles
      </h2>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {items.sort((prev, next) => next.torrent.seeds - prev.torrent.seeds).map(({ torrent, magnetLink }, index) => (
          <MovieDownloadCard
            key={index}
            magnetLink={magnetLink}
            torrent={torrent}
          />
        ))}
      </div>
    </div>
  );
};
