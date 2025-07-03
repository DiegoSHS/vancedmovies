import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { CircularProgress } from "@heroui/progress";

import { Movie } from "../../domain/entities/Movie";
import { useMovies } from "../hooks/useMovies";
import { MovieList } from "../components/MovieList";
import { MoviePagination } from "../components/MoviePagination";

export const MoviesScreen: React.FC = () => {
  const { movies, movieListData, loading, error, getMovies, searchMovies } =
    useMovies();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialMovies = async () => {
      setInitialLoading(true);
      await getMovies(currentPage);
      setInitialLoading(false);
    };

    loadInitialMovies();
  }, [currentPage]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await getMovies(1);
      setCurrentPage(1);

      return;
    }

    await searchMovies(searchQuery, 1);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    getMovies(1);
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = movieListData
    ? Math.ceil(movieListData.movie_count / 20)
    : 1;

  const isLoading = loading || initialLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl text-center font-bold text-gray-900 dark:text-white mb-6">
          BoliPeliculas
        </h1>

        <div className="flex gap-2">
          <Input
            isClearable
            className="flex-1"
            isDisabled={isLoading}
            placeholder="Buscar películas..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            color="primary"
            isDisabled={!searchQuery.trim()}
            onPress={handleSearch}
          >
            Buscar
          </Button>
          <Button
            color="secondary"
            isDisabled={!searchQuery.trim()}
            variant="bordered"
            onPress={handleClearSearch}
          >
            Quitar búsqueda
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          {isLoading ? (
            <>
              <Chip isDisabled>Cargando</Chip>
              <CircularProgress size="sm" />
            </>
          ) : (
            movieListData && (
              <>
                <Chip>
                  Mostrando {movies.length} de {movieListData.movie_count}{" "}
                  películas
                </Chip>
                <Chip>
                  Página {currentPage} de {totalPages}
                </Chip>
              </>
            )
          )}
        </div>

        <MoviePagination
          currentPage={currentPage}
          isLoading={isLoading}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <MovieList
          error={error}
          loading={isLoading}
          movies={movies}
          onMovieClick={handleMovieClick}
        />
        {!isLoading && (
          <MoviePagination
            currentPage={currentPage}
            isLoading={isLoading}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
