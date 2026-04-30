import { Movie } from "../../domain/entities/Movie";
import { Card } from "@heroui/react/card";
import { MovieRuntime } from "./MovieRuntime";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

interface MovieCardProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
    if (movie.id === 0) return <MovieCardSkeleton />
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

    return (
        <Card
            className="relative overflow-hidden w-xs shadow-md cursor-pointer p-0"
            onClick={() => onClick(movie)}
        >
            <div style={overlayStyle} />
            <Card.Header
                className="absolute top-0 left-0 right-0 h-32 flex-col items-start justify-start p-4"
                style={{ zIndex: 10 }}
            >
                <p className="text-md text-white font-bold relative z-10 drop-shadow-lg">
                    {movie.title}
                </p>
                <p className="text-white font-medium text-xl relative z-10 drop-shadow-lg">
                    {movie.year}
                </p>
            </Card.Header>
            <picture aria-label="Carátula">
                <source media="(min-width: 650px)" srcSet={movie.large_cover_image} />
                <source media="(min-width: 430px)" srcSet={movie.medium_cover_image} />
                <img
                    fetchPriority="high"
                    alt={movie.title}
                    loading="lazy"
                    className="rounded-xl z-0 w-full h-full object-cover aspect-[9/16]"
                    src={movie.medium_cover_image}
                />
            </picture>
            <Card.Footer className="absolute w-full justify-between bottom-3 flex flex-row gap-2 px-3">
                <MovieRuntime runtime={movie.runtime} size="sm" showLabel={false} />
            </Card.Footer>
        </Card >
    );
};
