import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Divider } from "@heroui/divider";
import { Movie } from "../../domain/entities/Movie";
import { MovieGenres } from "./MovieGenres";
import { MovieDescription } from "./MovieDescription";
import { MovieInfo } from "./MovieInfo";
import { MovieRating } from "./MovieRating";
import { MovieRuntime } from "./MovieRuntime";
import { MovieLanguage } from "./MovieLanguage";
import { MovieDownloadOptions } from "./MovieDownloads";
import { generateMagnetLinks } from "@/types";

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
            isPressable
            className="relative overflow-hidden max-w-xs"
            shadow="lg"
            onPress={handleClick}
        >
            <Image
                removeWrapper
                alt={movie.title}
                className="z-0 w-full h-full object-cover"
                src={posterUrl}
            />
            <div style={overlayStyle} />
            <CardHeader
                className="absolute top-0 left-0 right-0 h-32 flex-col items-start justify-start p-4"
                style={{ zIndex: 10 }}
            >
                <p className="text-md text-white font-bold relative z-10 drop-shadow-lg">
                    {movie.title}
                </p>
                <h4 className="text-white font-medium text-xl relative z-10 drop-shadow-lg">
                    {movie.year}
                </h4>
            </CardHeader>
            <CardFooter className="absolute bottom-0 z-10 p-2 flex flex-col gap-2 bg-default-50 border-t-3 border-solid border-default-200">
                <Accordion isCompact>
                    <AccordionItem
                        key={`${movie.id}-details`}
                        classNames={{
                            content: "flex flex-col gap-2",
                        }}
                        title="Detalles"
                    >
                        <div className="flex flex-wrap gap-2">
                            <MovieInfo type="year" value={movie.year} />
                            <MovieRating rating={movie.rating} />
                            <MovieRuntime runtime={movie.runtime} />
                            <MovieLanguage language={movie.language} />
                            <MovieGenres genres={movie.genres} show={2} />
                        </div>
                        {movie.description_full && (
                            <div className="mb-2">
                                <MovieDescription description={movie.description_full} maxWords={10} size="sm" />
                            </div>
                        )}
                        <Divider />
                        <MovieDownloadOptions
                            items={magnetLinks}
                            isDisabled={!Array.isArray(movie.torrents) || magnetError !== null || magnetLinks.length === 0}
                        />
                    </AccordionItem>
                </Accordion>
            </CardFooter>
        </Card >
    );
};
