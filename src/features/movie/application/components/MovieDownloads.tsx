import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
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
import { Link } from "@heroui/link";

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
      className="w-full justify-start"
      color={copied ? "success" : "default"}
      size="sm"
      startContent={copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
      variant="light"
      onPress={() => {
        handleMagnetCopy(magnetLink, setCopied);
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-1 items-center">
          <span className="font-medium text-sm">{torrent.quality}</span>
          <span className="text-xs opacity-60">{torrent.size}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip size="sm" variant="dot" color="success">
            {torrent.seeds}
          </Chip>
          <Chip size="sm" variant="dot" color="primary">
            {torrent.peers}
          </Chip>
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
      <DropdownMenu items={items.sort((prev, next) => next.torrent.seeds - prev.torrent.seeds)} classNames={{
        list: 'flex gap-2'
      }}>
        {({ magnetLink, torrent }) => (
          <DropdownItem
            key={torrent.hash}
            classNames={{
              base: "p-0 m-0",
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
      classNames={{
        base: 'overflow-hidden hover:shadow-lg transition-shadow',
        body: 'flex flex-row justify-between text-sm py-0 my-0',
        header: 'flex justify-between items-center',
        footer: 'flex gap-2'
      }}
    >
      <CardHeader>
        <Chip color="primary" variant="flat">
          {torrent.quality}
        </Chip>
        <Chip color="secondary" size="sm" variant="flat">
          {torrent.type}
        </Chip>
      </CardHeader>
      <CardBody>
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
          <span className="font-medium">{torrent.size}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip size="sm" variant="dot" color="success">
            {torrent.seeds}
          </Chip>
          <Chip size="sm" variant="dot" color="primary">
            {torrent.peers}
          </Chip>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          color={copied ? "success" : "primary"}
          disabled={copied}
          size="sm"
          startContent={
            copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />
          }
          variant="light"
          onPress={() => handleMagnetCopy(magnetLink, setCopied)}
        >
          Copiar enlace
        </Button>
        <Button
          color="secondary"
          size="sm"
          as={Link}
          href={magnetLink}
          variant="light"
          isExternal={true}
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
