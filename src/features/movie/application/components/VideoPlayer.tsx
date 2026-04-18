import { Card, CloseButton } from "@heroui/react";
import { BackendStreamPlayer } from "@/components/BackendStreamPlayer";

interface HybridVideoPlayerProps {
    magnetLink?: string;
    movieTitle: string;
    onClose?: () => void;
}


export const VideoPlayer: React.FC<HybridVideoPlayerProps> = ({
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
                    <CloseButton
                        className="hover:bg-default-100"
                        onPress={onClose}
                        aria-label="Cerrar reproductor"
                    >
                    </CloseButton>
                )}
            </Card.Header>
            <BackendStreamPlayer />
        </Card>
    );
};
