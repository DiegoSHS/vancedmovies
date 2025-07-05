import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Movie } from "../../domain/entities/Movie";
import { MovieList } from "../components/MovieList";
import { MoviePagination } from "../components/MoviePagination";
import { CrossIcon, SearchIcon } from "@/components/icons";
import { useMovieContext } from "../providers/MovieProvider";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";

export const LoadMoviesInfo = () => (
    <>
        <Chip variant="shadow" color="primary" >Cargando</Chip>
        <Progress size="md" isIndeterminate />
    </>
)

export const PaginatedMoviesScreen: React.FC = () => {
    const { state: { items: movies }, totalResults, loading, error, query, getMovies, searchMovies, updateQuery, resetQuery } =
        useMovieContext();
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
            } else {
                getMovies(currentPage);
            }
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
        navigate(`/movie/${movie.id}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        navigate(`/page/${page}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl text-center font-bold text-gray-900 dark:text-white mb-6">
                    BOLIPeliculas
                </h1>

                <div className="flex gap-2">
                    <Input
                        isClearable
                        isDisabled={loading}
                        placeholder="Buscar películas"
                        type="search"
                        value={query}
                        onChange={(e) => updateQuery(e.target.value)}
                        onClear={resetQuery}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button
                        isIconOnly
                        color="primary"
                        isDisabled={!query.trim()}
                        onPress={handleSearch}
                    >
                        <SearchIcon />
                    </Button>
                    <Button
                        isIconOnly
                        color="secondary"
                        isDisabled={!query.trim()}
                        variant="bordered"
                        onPress={handleClearSearch}
                    >
                        <CrossIcon />
                    </Button>
                </div>

                <div className="flex gap-2 items-center justify-center">
                    {loading ? (
                        <LoadMoviesInfo />
                    ) : (
                        <>
                            <Chip>
                                Mostrando {movies.length} de {totalResults}{" "}
                                películas
                            </Chip>
                            <Chip>
                                Página {currentPage} de {totalPages}
                            </Chip>
                        </>

                    )}
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
                {!loading && (
                    <MoviePagination
                        currentPage={currentPage}
                        isLoading={loading}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};
