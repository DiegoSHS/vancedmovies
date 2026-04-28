import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Movie } from "../../domain/entities/Movie";
import { MovieList } from "../components/MovieList";
import { MoviePagination } from "../components/MoviePagination";
import { CrossIcon, SearchIcon } from "@/components/icons";
import { useMovieContext } from "../providers/MovieProvider";
import { Button, Chip, Input } from "@heroui/react";
import { useTPBMovieContext } from "../providers/TPBMovieProvider";

export const PaginatedMoviesScreen: React.FC = () => {
    const {
        state: { items: movies },
        totalResults,
        loading,
        error,
        query,
        getMovies,
        searchMovies,
        updateQuery,
        resetQuery,
        selectMovie
    } = useMovieContext();
    const { addTorrents } = useTPBMovieContext()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const pageFromUrl = id ? parseInt(id, 10) : 1;
    const validPage = !isNaN(pageFromUrl) && pageFromUrl > 0;
    const [currentPage, setCurrentPage] = useState<number>(validPage ? pageFromUrl : 1);

    const totalPages = Math.ceil(totalResults / 20);

    useEffect(() => {
        setCurrentPage(validPage ? pageFromUrl : 1)
        const loadInitialMovies = async () => {
            if (query) {
                searchMovies(currentPage)
                return
            }
            getMovies(currentPage);
        };
        loadInitialMovies();
    }, [id]);

    const handleSearch = async () => {
        if (!query.trim()) {
            getMovies(1);
            setCurrentPage(1);
            navigate("/page/1");
            return;
        }

        searchMovies(1);
        setCurrentPage(1);
        navigate("/page/1");
    };

    const handleClearSearch = () => {
        getMovies(1);
        resetQuery();
        setCurrentPage(1);
        navigate("/page/1");
    };

    const handleMovieClick = (movie: Movie) => {
        selectMovie(movie)
        addTorrents(movie.torrents)
        navigate(`/movie/${movie.id}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        navigate(`/page/${page}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col gap-2 rounded-xl">
            <h1 className="text-4xl text-center font-bold text-gray-900 dark:text-white mb-6">
                BOLIPeliculas
            </h1>
            <div className="flex gap-2">
                <Input
                    disabled={loading}
                    placeholder="Buscar películas"
                    aria-label="Buscar películas"
                    type="search"
                    value={query}
                    onChange={(e) => updateQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                    variant="ghost"
                    aria-label="Buscar"
                    isIconOnly
                    isDisabled={!query.trim()}
                    onPress={handleSearch}
                    className="px-3 py-1"
                >
                    <SearchIcon />
                </Button>
                <Button
                    variant="ghost"
                    isIconOnly
                    aria-label="Limpiar búsqueda"
                    isDisabled={!query.trim()}
                    onPress={handleClearSearch}
                >
                    <CrossIcon />
                </Button>
            </div>

            <div className="flex gap-2 items-center justify-center">
                <Chip.Root>
                    <Chip.Label>Mostrando {movies.length} de {totalResults} películas</Chip.Label>
                </Chip.Root>
            </div>

            <MoviePagination
                currentPage={currentPage}
                isLoading={loading}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <MovieList
                error={error}
                loading={loading}
                movies={movies}
                onMovieClick={handleMovieClick}
            />
            <MoviePagination
                currentPage={currentPage}
                isLoading={loading}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
