import { CrossIcon, SearchIcon } from "@/components/icons"
import { Button } from "@heroui/react/button"
import { Input } from "@heroui/react/input"
import { useMovieActions, useMovieState } from "../providers/MovieProvider"
import { useNavigate } from "react-router-dom"

export const MovieSearch: React.FC = ({ }) => {
    const { getMovies, searchMovies, resetQuery, updateQuery } = useMovieActions()
    const { query, status } = useMovieState()
    const navigate = useNavigate()
    const loading = status === "loading"
    const handleSearch = async () => {
        if (!query.trim()) {
            getMovies(1);
            navigate("/page/1");
            return;
        }

        searchMovies(1);
        navigate("/page/1");
    };

    const handleClearSearch = () => {
        getMovies(1);
        resetQuery();
        navigate("/page/1");
    };
    return (
        <div className="flex gap-2">
            <Input
                aria-label="Buscar películas"
                disabled={loading}
                placeholder="Buscar películas"
                type="search"
                variant="secondary"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
                isIconOnly
                aria-label="Buscar"
                className="px-3 py-1"
                isDisabled={!query.trim()}
                variant="ghost"
                onPress={handleSearch}
            >
                <SearchIcon />
            </Button>
            <Button
                isIconOnly
                aria-label="Limpiar búsqueda"
                isDisabled={!query.trim()}
                variant="ghost"
                onPress={handleClearSearch}
            >
                <CrossIcon />
            </Button>
        </div>
    )
}

export default MovieSearch