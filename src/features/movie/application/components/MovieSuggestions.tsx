import { HorizontalScrollShadow } from "@/components/HorizontalScrollShadow"
import { MovieList } from "./MovieList"
import { Movie } from "../../domain/entities/Movie"
import { useNavigate } from "react-router-dom"
import { useMovieContext } from "../providers/MovieProvider"
import { useTPBMovieContext } from "../providers/TPBMovieProvider"

interface MovieSuggestionsProps {
    items: Movie[]
    message?: string
}

export const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({
    items, message = "Tambien podria gustarte"
}) => {
    const { selectMovie, loading, error } = useMovieContext()
    const { addTorrents } = useTPBMovieContext()
    const navigate = useNavigate()
    const handleMovieClick = (movie: Movie) => {
        selectMovie(movie)
        addTorrents(movie.torrents)
        navigate(`/movie/${movie.id}`);
    }; return (
        <>
            <h1 className="pt-10 text-2xl font-bold">
                {message}
            </h1>
            <HorizontalScrollShadow>
                <MovieList
                    loading={loading}
                    className="flex gap-2"
                    error={error}
                    movies={items}
                    onMovieClick={handleMovieClick}
                />
            </HorizontalScrollShadow>
        </>
    )
}