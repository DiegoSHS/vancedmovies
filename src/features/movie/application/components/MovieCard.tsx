import { Movie } from "../../domain/entities/Movie";
import { MovieDownloadOptions } from "./MovieDownloads";
import { generateMagnetLinks } from "@/types";
import { Card } from "@heroui/react";

interface MovieCardProps {
    movie: Movie;
    onClick?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
    const { data: magnetLinks, error: magnetError } = generateMagnetLinks(movie.torrents, movie.title);

    const overlayStyle = {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        height: "128px",
        background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%)",
        zIndex: 5,
        pointerEvents: "none" as const,
    };

    const handleClick = () => {
        if (onClick) onClick(movie);
    };

    const posterUrl =
        movie.large_cover_image ||
        movie.medium_cover_image ||
        movie.small_cover_image ||
        "/placeholder-movie.jpg";

    return (
        <Card
            className="relative overflow-hidden max-w-xs shadow-md cursor-pointer p-0"
            onClick={handleClick}
        >
            <div style={overlayStyle} />
            <Card.Header
                className="absolute top-0 left-0 right-0 h-32 flex-col items-start justify-start p-4"
                style={{ zIndex: 10 }}
            >
                <p className="text-md text-white font-bold relative z-10 drop-shadow-lg">
                    {movie.title}
                </p>
                <h4 className="text-white font-medium text-xl relative z-10 drop-shadow-lg">
                    {movie.year}
                </h4>
            </Card.Header>
            <img
                alt={movie.title}
                className="rounded-xl z-0 w-full h-full object-cover"
                src={posterUrl}
            />
            <Card.Footer className="absolute bottom-3 right-3 flex flex-col gap-2">
                <MovieDownloadOptions
                    items={magnetLinks}
                    isDisabled={!Array.isArray(movie.torrents) || magnetError !== null || magnetLinks.length === 0}
                />
            </Card.Footer>
        </Card >
    );
};
