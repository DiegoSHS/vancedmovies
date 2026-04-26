import { MovieYear } from "./MovieYear"
import { MovieRating } from "./MovieRating"
import { MovieRuntime } from "./MovieRuntime"
import { MovieLanguage } from "./MovieLanguage"
import { MovieGenres } from "./MovieGenres"
import { MovieDescription } from "./MovieDescription"
import { Movie } from "../../domain/entities/Movie"

export const MovieDetailsCard = ({
    movie }: { movie: Movie }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-8 justify-evenly items-center gap-2">
            <picture className="relative w-xs aspect-[9/16] inset-0 w-full object-cover rounded-xl" aria-label="Carátula">
                <source
                    media="(min-width: 650px)"
                    srcSet={movie.large_cover_image}
                />
                <source
                    media="(min-width: 430px)"
                    srcSet={movie.medium_cover_image}
                />
                <img
                    className="relative w-xs aspect-[9/16] inset-0 w-full object-cover rounded-xl"
                    alt={movie.title}
                    loading="lazy"
                    fetchPriority="high"
                    src={movie.medium_cover_image}
                />
            </picture>
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold mb-2">
                    {movie.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                    <MovieYear
                        size="lg"
                        showLabel={true}
                        year={movie.year}
                    />
                    <MovieRating
                        rating={movie.rating}
                        showLabel={true}
                        size="lg"
                    />
                    <MovieRuntime
                        runtime={movie.runtime}
                        showLabel={true}
                        size="lg"
                    />
                    <MovieLanguage
                        language={movie.language}
                        showLabel={true}
                        size="lg"
                    />
                </div>
                <div className="flex flex-col gap-2 items-start">
                    <h3 className="text-lg font-semibold">Géneros</h3>
                    <MovieGenres genres={movie.genres} />
                </div>
                <div className="flex flex-col gap-2 items-start">
                    <h3 className="text-lg font-semibold">Descripción</h3>
                    <MovieDescription
                        full
                        description={movie.description_full}
                    />
                </div>
            </div>
        </div>
    )
}