import { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { WTVideoPlayer } from "../../../../components/WebtorVideoPlayer";
import { CrossIcon } from "@/components/icons";
import { WebTorrentPlayer, WebTorrentSWPlayer } from "@/components/WebTorrentPlayer";
import { BackendStreamPlayer } from "@/components/BackendStreamPlayer";

interface HybridVideoPlayerProps {
    magnetLink: string;
    movieTitle: string;
    onClose?: () => void;
}


export const VideoPlayer: React.FC<HybridVideoPlayerProps> = ({
    magnetLink,
    movieTitle,
    onClose,
}) => {

    const [playerType, setPlayerType] = useState<"default" | "webtorrent" | "backend">(
        "default",
    );

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
                            magnetLink={magnetLink}
                            movieTitle={movieTitle}
                        />
                    ) : playerType === "webtorrent" ? (
                        <WebTorrentSWPlayer
                            magnetLink={magnetLink}
                        />
                    ) : (
                        <BackendStreamPlayer
                            magnetLink={magnetLink}
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
