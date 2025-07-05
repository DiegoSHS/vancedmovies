import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { CircularProgress } from "@heroui/progress";

import { Movie } from "../../domain/entities/Movie";
import { MovieList } from "../components/MovieList";
import { MoviePagination } from "../components/MoviePagination";
import { CrossIcon, SearchIcon } from "@/components/icons";
import { useMovieContext } from "../providers/MovieProvider";

export const MoviesScreen: React.FC = () => {
  const { state: { items: movies }, totalResults, query, loading, error, getMovies, searchMovies, resetQuery, updateQuery } =
    useMovieContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const loadInitialMovies = async () => {
      getMovies(currentPage);
    };

    loadInitialMovies();
  }, [currentPage]);

  const handleSearch = async () => {
    if (!query.trim()) {
      getMovies(1);
      setCurrentPage(1);
      return;
    }

    searchMovies(1);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    resetQuery();
    setCurrentPage(1);
    getMovies(1);
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalResults / 20)

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

        <div className="flex gap-2 mb-4">
          {loading ? (
            <>
              <Chip isDisabled>Cargando</Chip>
              <CircularProgress size="sm" />
            </>
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
