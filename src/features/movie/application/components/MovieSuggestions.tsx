import { HorizontalScrollShadow } from "@/components/HorizontalScrollShadow"
import { MovieList } from "./MovieList"
import { useNavigate } from "react-router-dom"
import { useMovieContext } from "../providers/MovieProvider"

interface MovieSuggestionsProps {
    items: import("../../domain/entities/Movie").Movie[]
    message?: string
}

export const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({
    items, message = "Tambien podria gustarte"
}) => {
    const { selectMovie, status, addTorrents } = useMovieContext()
    const navigate = useNavigate()
    const handleMovieClick = (movie: import("../../domain/entities/Movie").Movie) => {
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
                    loading={status === "loading"}
                    className="flex gap-2"
                    error={status === "error"}
                    movies={items}
                    onMovieClick={handleMovieClick}
                />
            </HorizontalScrollShadow>
        </>
    )
}

export default MovieSuggestions