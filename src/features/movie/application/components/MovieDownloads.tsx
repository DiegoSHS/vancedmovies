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
    <Button
      className={`w-full justify-start px-2 py-1 ${copied ? "bg-success text-white" : ""}`}
      onPress={() => {
        handleMagnetCopy(magnetLink, setCopied);
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2 items-center">
          {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
          <div className="flex gap-1 items-center">
            <span className="font-medium text-sm">{torrent.quality}</span>
            <span className="text-xs opacity-60">{torrent.size}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Chip.Root className="inline-flex items-center px-2 py-1">
            <Chip.Label>{torrent.seeds}</Chip.Label>
          </Chip.Root>
          <Chip.Root className="inline-flex items-center px-2 py-1">
            <Chip.Label>{torrent.peers}</Chip.Label>
          </Chip.Root>
        </div>
      </div>
    </Button>
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
      <Dropdown.Trigger>
        <Button
          isDisabled={isDisabled}
          className="rounded-full px-3 py-1 text-sm"
        >
          <DownloadIcon size={20} />
          Descargar
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Menu className="flex flex-col gap-2 p-0">
        {items
          .slice()
          .sort((prev, next) => next.torrent.seeds - prev.torrent.seeds)
          .map(({ magnetLink, torrent }) => (
            <Dropdown.Item
              key={torrent.hash}
              className="p-0 m-0"
            >
              <MovieDropdownItem magnetLink={magnetLink} torrent={torrent} />
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
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
      <Card.Header>
        <Chip.Root className="inline-flex items-center px-2 py-1">
          <Chip.Label>{torrent.quality}</Chip.Label>
        </Chip.Root>
        <Chip.Root className="inline-flex items-center px-2 py-1 text-sm">
          <Chip.Label>{torrent.type}</Chip.Label>
        </Chip.Root>
      </Card.Header>
      <Card.Content className="flex flex-col gap-2 text-sm py-0 my-0">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
          <span className="font-medium">{torrent.size}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip.Root className="inline-flex items-center px-2 py-1">
            <Chip.Label>{torrent.seeds}</Chip.Label>
          </Chip.Root>
          <Chip.Root className="inline-flex items-center px-2 py-1">
            <Chip.Label>{torrent.peers}</Chip.Label>
          </Chip.Root>
        </div>
      </Card.Content>
      <Card.Footer>
        <button
          disabled={copied}
          className={copied ? "bg-success text-white px-3 py-1 rounded" : "px-3 py-1 rounded"}
          onClick={() => handleMagnetCopy(magnetLink, setCopied)}
        >
          {copied ? <><CheckIcon size={20} /> Copiado</> : <><CopyIcon size={20} /> Copiar enlace</>}
        </button>
        <a
          className="bg-slate-700 text-white px-3 py-1 rounded"
          href={magnetLink}
          target="_blank"
          rel="noreferrer noopener"
        >
          Abrir torrent
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
