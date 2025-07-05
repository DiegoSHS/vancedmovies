import { CheckIcon, CopyIcon, DownloadIcon } from "@/components/icons";
import { copyMagnetToClipboard, MagnetLinkResult } from "@/types";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { useState } from "react";

export const handleOpenTorrentApp = (magnetLink: string) => {
    window.open(magnetLink, "_blank");
};

export async function handleMagnetCopy(magnetLink: string, setCopied: (value: boolean) => void) {
    try {
        await copyMagnetToClipboard(magnetLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
};


interface MovieDownloadOptionProps {
    items: MagnetLinkResult[];
    isDisabled: boolean
}

export const MovieDownloadOptions = ({ items, isDisabled }: MovieDownloadOptionProps) => {
    // Verifica si items es un arreglo y tiene al menos un elemento
    const itemsValid = Array.isArray(items) && items.length > 0;

    if (!itemsValid) {
        return (
            <Button color="primary" radius="full" size="sm" disabled>
                No hay descargas disponibles
            </Button>
        );
    }

    return (
        <Dropdown
            closeOnSelect={false}
            isDisabled={isDisabled}
        >
            <DropdownTrigger>
                <Button
                    color="primary"
                    radius="full"
                    size="sm"
                    startContent={
                        <DownloadIcon size={20} />
                    }
                >
                    Descargar
                </Button>
            </DropdownTrigger>
            <DropdownMenu items={items}>
                {({ magnetLink, torrent }) => {
                    const [copied, setCopied] = useState<boolean>(false);
                    return (
                        <DropdownItem
                            onPress={() => {
                                handleMagnetCopy(magnetLink, setCopied);
                            }}
                            startContent={
                                copied
                                    ? <CheckIcon size={20} />
                                    : <CopyIcon size={20} />
                            }
                            classNames={{
                                title: 'flex items-center gap-2'
                            }}
                            key={torrent.hash}
                        >
                            <span className="font-medium text-sm">
                                {torrent.quality}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                {torrent.size}
                            </span>
                        </DropdownItem>
                    )
                }}
            </DropdownMenu>
        </Dropdown>
    )
}

export const MovieDownloadCard = ({ torrent, magnetLink }: MagnetLinkResult) => {
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
                    <span className="text-gray-600 dark:text-gray-400">
                        Tamaño:
                    </span>
                    <span className="font-medium">{torrent.size}</span>
                </div>
            </CardBody>
            <CardFooter className="flex gap-2">
                <Button
                    startContent={copied ?
                        <CheckIcon size={20} /> :
                        <CopyIcon size={20} />
                    }
                    color={
                        copied
                            ? "success"
                            : "primary"
                    }
                    disabled={copied}
                    size="sm"
                    variant="solid"
                    onPress={() =>
                        handleMagnetCopy(magnetLink, setCopied)
                    }
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
}


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
                {items.map(({ torrent, magnetLink }) =>
                    <MovieDownloadCard torrent={torrent} magnetLink={magnetLink} key={torrent.hash} />
                )}
            </div>
        </div>
    )
}