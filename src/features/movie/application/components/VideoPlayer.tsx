import { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { CrossIcon } from "@/components/icons";
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

    const [playerType, setPlayerType] = useState<"default" | "webtorrent" | "worker" | "backend">(
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
                <BackendStreamPlayer
                    magnetLink={magnetLink}
                />
            </CardBody>
            <CardFooter className="flex gap-2 items-center justify-center">
                <Button
                    size="sm"
                    isIconOnly
                    radius="full"
                    variant={playerType === "default" ? "solid" : "bordered"}
                    onPress={() => setPlayerType("default")}
                >
                    1
                </Button>
                <Button
                    size="sm"
                    isIconOnly
                    radius="full"
                    variant={playerType === "worker" ? "solid" : "bordered"}
                    onPress={() => setPlayerType("worker")}
                >
                    2
                </Button>
                <Button
                    size="sm"
                    isIconOnly
                    radius="full"
                    variant={playerType === "webtorrent" ? "solid" : "bordered"}
                    onPress={() => setPlayerType("webtorrent")}
                >
                    3
                </Button>
                <Button
                    isIconOnly
                    size="sm"
                    radius="full"
                    variant={playerType === "backend" ? "solid" : "bordered"}
                    onPress={() => setPlayerType("backend")}
                >
                    4
                </Button>
            </CardFooter>
        </Card >
    );
};
