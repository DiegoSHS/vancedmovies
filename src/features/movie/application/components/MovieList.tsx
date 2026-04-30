import { useEffect, useState } from "react";
import { Movie } from "../../domain/entities/Movie";
import { useMovieContext } from "../providers/MovieProvider";
import { MovieCard } from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";
import { Repeater } from "@/components/Repeater";
import { NoDownloadsAvailable } from "./MovieDownloads";

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  error: boolean;
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
  if (loading) {
    const Item = (item: { id: number }) => <MovieCardSkeleton key={item.id} />
    return (
      <div className={className}>
        <Repeater
          items={Array.from({ length: 24 }, (_, k) => ({ id: k }))}
        >
          {Item}
        </Repeater>
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
  if (!movies.length) return <NoDownloadsAvailable message="Sin contenido para mostrar" />
  const Item = (movie: Movie) => <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
  return (
    <div className={className}>
      <Repeater items={movies}>
        {Item}
      </Repeater>
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
  const Item = (movie: Movie) => <MovieCard key={movie.id} movie={movie} onClick={() => { }} />
  return (
    <div onWheel={handleScroll} className="flex flex-wrap gap-2 justify-center">
      <Repeater items={movies}>
        {Item}
      </Repeater>
    </div>
  )
}

export default MovieList