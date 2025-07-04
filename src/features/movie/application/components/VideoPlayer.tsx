import { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Torrent } from "../../domain/entities/Torrent";
import { generateMagnetLink } from "../../../../utils/magnetGenerator";
import { WTVideoPlayer } from "./WebtorVideoPlayer";
import { CrossIcon } from "@/components/icons";

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
                    <p className="text-sm text-gray-500">Ver película con webtor</p>
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
                <WTVideoPlayer
                    magnetLink={magnetLink}
                    movieTitle={movieTitle}
                />
            </CardBody>
        </Card >
    );
};
