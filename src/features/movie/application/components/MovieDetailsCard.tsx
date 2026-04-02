import { MovieYear } from "./MovieYear"
import { MovieRating } from "./MovieRating"
import { MovieRuntime } from "./MovieRuntime"
import { MovieLanguage } from "./MovieLanguage"
import { MovieGenres } from "./MovieGenres"

interface MovieDetailsCardProps {
    genres: string[]
    title: string
    year: number
    rating: number
    runtime: number
    posterUrl: string
    language: string
}

export const MovieDetailsCard = ({ genres, language, rating, runtime, posterUrl, title, year }: MovieDetailsCardProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-8 justify-evenly items-start gap-2">
            <img
                alt={title}
                className="relative w-xs aspect-[9/16] inset-0 w-full object-cover rounded-xl"
                src={posterUrl}
            />

            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold mb-2">{title}</h1>
                <div className="flex flex-wrap gap-2">
                    <MovieYear showLabel={true} year={year} />
                    <MovieRating rating={rating} showLabel={true} size="lg" />
                    <MovieRuntime runtime={runtime} showLabel={true} size="lg" />
                    <MovieLanguage
                        language={language}
                        showLabel={true}
                        size="lg"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Géneros</h3>
                    <MovieGenres genres={genres} />
                </div>
            </div>
        </div>
    )
}