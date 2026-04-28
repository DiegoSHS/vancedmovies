import { Movie } from "../../domain/entities/Movie";
import { MovieCard } from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";
import { ListLayout, Virtualizer } from "@heroui/react";

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  error: string | null;
  className?: string
  onMovieClick: (movie: Movie) => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading = false,
  error,
  onMovieClick,
  className = "flex flex-wrap gap-2 justify-center"
}) => {
  if (loading || movies.length === 0) {
    return (
      <div className={className}>
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

  return (
    <div className={className}>
      <Virtualizer layout={ListLayout} layoutOptions={{
        rowHeight: 480
      }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </Virtualizer>
    </div>
  );
};
