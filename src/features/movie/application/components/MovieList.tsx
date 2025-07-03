import React from "react";

import { Movie } from "../../domain/entities/Movie";

import { MovieCard } from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  error?: string;
  onMovieClick?: (movie: Movie) => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading = false,
  error,
  onMovieClick,
}) => {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-6 justify-center">
        {Array.from({ length: 20 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar las películas
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🎬</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron películas
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Intenta con una búsqueda diferente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
};
