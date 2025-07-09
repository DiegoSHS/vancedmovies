import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";
import { WTVideoPlayer } from "../../../../components/WebtorVideoPlayer";
import { CrossIcon } from "@/components/icons";
import { WebTorrentPlayer } from "@/components/WebTorrentPlayer";
import { BackendStreamPlayer } from "@/components/BackendStreamPlayer";

interface HybridVideoPlayerProps {
    torrent: Torrent;
    movieTitle: string;
    onClose?: () => void;
}


export const VideoPlayer: React.FC<HybridVideoPlayerProps> = ({
    torrent,
    movieTitle,
    onClose,
}) => {

    const { data: magnetLink, error } = generateMagnetLink(torrent, movieTitle);
    const [playerType, setPlayerType] = useState<"default" | "webtorrent" | "backend">(
        "default",
    );
    // Magnet link para cada tipo de reproductor
    const magnetLinkDefault = generateMagnetLink(torrent, movieTitle).data;
    const magnetLinkWebTorrent = generateMagnetLink(torrent, movieTitle, { browser: true }).data;

    useEffect(() => {
        console.log('🎬 HybridVideoPlayer - Información de la película:', {
            título: movieTitle,
            calidad: torrent.quality,
            hash: torrent.hash.substring(0, 8) + '...',
            hashCompleto: torrent.hash
        });

        if (error) {
            console.error('❌ Error generando magnet link:', error);
        } else {
            console.log('🔗 Magnet link generado exitosamente:', {
                magnetParcial: magnetLink.substring(0, 60) + '...',
                longitud: magnetLink.length
            });
        }
    }, [torrent, movieTitle]);

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{movieTitle}</h3>
                    <div className="flex gap-1">
                        <p className="text-sm text-gray-500">
                            Ver película con
                        </p>
                        <p className="text-sm text-secondary">{playerType === "default" ? "Webtor.io" : playerType === "webtorrent" ? "WebTorrent" : "WebTorrent"}</p>
                    </div>
                </div>
                {onClose && (
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={onClose}
                        aria-label="Cerrar reproductor"
                    >
                        <CrossIcon size={24} />
                    </Button>
                )}
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
                {
                    playerType === "default" ? (
                        <WTVideoPlayer
                            magnetLink={magnetLinkDefault}
                            movieTitle={movieTitle}
                        />
                    ) : playerType === "webtorrent" ? (
                        <WebTorrentPlayer
                            magnetLink={magnetLinkWebTorrent}
                        />
                    ) : (
                        <BackendStreamPlayer
                            magnetLink={magnetLinkDefault}
                        />
                    )
                }
            </CardBody>
            <CardFooter className="flex gap-2 items-center justify-center">
                <Button
                    size="sm"
                    variant={playerType === "default" ? "solid" : "bordered"}
                    onPress={() => setPlayerType("default")}
                >
                    WebTor
                </Button>
                <Button
                    size="sm"
                    variant={playerType === "webtorrent" ? "solid" : "bordered"}
                    onPress={() => setPlayerType("webtorrent")}
                >
                    WebTorrent
                </Button>
                <Button
                    size="sm"
                    variant={playerType === "backend" ? "solid" : "bordered"}
                    onPress={() => setPlayerType("backend")}
                >
                    Custom
                </Button>
            </CardFooter>
        </Card >
    );
};
