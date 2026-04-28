import { useEffect, useState } from "react";
import { Movie } from "../../domain/entities/Movie";
import { useMovieContext } from "../providers/MovieProvider";
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
        {Array.from({ length: 24 }).map((_, index) => (
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
      <Virtualizer
        layout={ListLayout}
        layoutOptions={{
          rowHeight: 480
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </Virtualizer>
    </div>
  );
};

export const MovieListInfiniteScroll = () => {
  const { state: { items: movies }, getMoreMovies, getMovies } = useMovieContext()
  const [page, setPage] = useState(0);
  const debounce = (func: (args: any) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (...args: any) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(args);
      }, delay);
    };
  };
  const handleScroll = debounce(() => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight - 1000
    console.log(bottom)
    if (bottom) {
      getMoreMovies(page + 1)
      setPage(page => page + 1)
    }
  }, 300)
  useEffect(() => {
    getMovies(0)
    return () => {

    };
  }, []);
  return (
    <div onWheel={handleScroll} className="flex flex-wrap gap-2 justify-center">
      <Virtualizer
        layout={ListLayout}
        layoutOptions={{
          rowHeight: 480
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => { }} />
        ))}
      </Virtualizer>
    </div>
  )
}