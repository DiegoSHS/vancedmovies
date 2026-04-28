import { Card } from "@heroui/react";
import { BackendStreamPlayer } from "@/components/BackendStreamPlayer";

interface HybridVideoPlayerProps {
    magnetLink?: string;
    movieTitle: string;
    onClose?: () => void;
}


export const VideoPlayer: React.FC<HybridVideoPlayerProps> = ({
    magnetLink,
    movieTitle,
}) => {

    return (
        <Card className="w-full rounded-xl">
            <Card.Header className="flex flex-row items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold capitalize">{movieTitle}
                    </h3>
                </div>
            </Card.Header>
            <BackendStreamPlayer magnetLink={magnetLink} />
        </Card>
    );
};
