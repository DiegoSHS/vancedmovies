import { useEffect, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chip } from "@heroui/react/chip";

import { useMovieState, useMovieActions } from "../providers/MovieProvider";

import { useTorrentActions } from "@/features/torrent/application/providers/TorrentProvider";

const MoviePagination = lazy(() => import("../components/MoviePagination"));
const MovieList = lazy(() => import("../components/MovieList"));

export const PaginatedMoviesScreen: React.FC = () => {
  const { state, totalResults, status, query } = useMovieState();
  const { getMovies, searchMovies, selectMovie } = useMovieActions();
  const { addTorrents, cleanTorrent } = useTorrentActions();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const pageFromUrl = id ? parseInt(id, 10) : 1;
  const validPage = !isNaN(pageFromUrl) && pageFromUrl > 0;
  const currentPage = validPage ? pageFromUrl : 1;
  const totalPages = Math.ceil(totalResults / 24);

  useEffect(() => {
    const loadInitialMovies = async () => {
      if (query) {
        searchMovies(currentPage);

        return;
      }
      getMovies(currentPage);
    };

    loadInitialMovies();
  }, [id]);

  const handleMovieClick = (
    movie: import("../../domain/entities/Movie").Movie,
  ) => {
    cleanTorrent();
    selectMovie(movie);
    addTorrents(movie.torrents);
    navigate(`/movie/${movie.id}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/page/${page}`);
  };
  const error = status === "error";
  const loading = status === "loading";

  return (
    <div className="mx-auto px-4 py-8 flex flex-col gap-2 rounded-xl">
      <h1 className="text-4xl text-center font-bold text-gray-900 dark:text-white mb-6">
        BOLIPeliculas
      </h1>

      <div className="flex gap-2 items-center justify-center">
        <Chip.Root>
          <Chip.Label>
            Mostrando {state.items.length || 0} de {totalResults} películas
          </Chip.Label>
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
        movies={state.items}
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
