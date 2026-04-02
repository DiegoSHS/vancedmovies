import { Card, Button } from "@heroui/react";
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

    return (
        <Card className="w-full">
            <Card.Header className="flex flex-row items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{movieTitle}</h3>
                    <div className="flex gap-1">
                        <p className="text-sm text-gray-500">
                            Ver película con streaming vía torrent
                        </p>
                    </div>
                </div>
                {onClose && (
                    <Button
                        isIconOnly
                        className="hover:bg-default-100"
                        onPress={onClose}
                        aria-label="Cerrar reproductor"
                    >
                        <CrossIcon size={24} />
                    </Button>
                )}
            </Card.Header>
            <div className="flex flex-col gap-3 p-4">
                <BackendStreamPlayer
                    magnetLink={magnetLink}
                />
            </div>
        </Card>
    );
};
