import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
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
    <button
      className="w-full flex items-center gap-2 text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onClick={() => {
        handleMagnetCopy(magnetLink, setCopied);
      }}
    >
      {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
      <span className="font-medium text-sm">{torrent.quality}</span>
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {torrent.size}
      </span>
    </button>
  );
}

export const MovieDownloadOptions = ({
  items,
  isDisabled,
}: MovieDownloadOptionsProps) => {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <Button disabled color="primary" radius="full" size="sm">
        No hay descargas disponibles
      </Button>
    );
  }

  return (
    <Dropdown closeOnSelect={false} isDisabled={isDisabled}>
      <DropdownTrigger>
        <Button
          color="primary"
          radius="full"
          size="sm"
          startContent={<DownloadIcon size={20} />}
        >
          Descargar
        </Button>
      </DropdownTrigger>
      <DropdownMenu items={items}>
        {({ magnetLink, torrent }) => (
          <DropdownItem
            key={torrent.hash}
            classNames={{
              wrapper: "p-0 m-0",
              title: "p-0 m-0",
            }}
          >
            <MovieDropdownItem magnetLink={magnetLink} torrent={torrent} />
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
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
      <CardBody className="flex gap-1">
        <div className="flex justify-between items-center">
          <Chip color="primary" size="lg" variant="flat">
            {torrent.quality}
          </Chip>
          <Chip color="secondary" size="sm" variant="flat">
            {torrent.type}
          </Chip>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
          <span className="font-medium">{torrent.size}</span>
        </div>
      </CardBody>
      <CardFooter className="flex gap-2">
        <Button
          color={copied ? "success" : "primary"}
          disabled={copied}
          size="sm"
          startContent={
            copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />
          }
          variant="solid"
          onPress={() => handleMagnetCopy(magnetLink, setCopied)}
        >
          Copiar enlace
        </Button>
        <Button
          color="secondary"
          size="sm"
          variant="bordered"
          onPress={() => handleOpenTorrentApp(magnetLink)}
        >
          Abrir torrent
        </Button>
      </CardFooter>
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
        {items.map(({ torrent, magnetLink }) => (
          <MovieDownloadCard
            key={torrent.hash}
            magnetLink={magnetLink}
            torrent={torrent}
          />
        ))}
      </div>
    </div>
  );
};
