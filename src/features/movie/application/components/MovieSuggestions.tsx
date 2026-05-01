import { useNavigate } from "react-router-dom";

import {
  useMovieState,
  useMovieActions,
  useTorrentActions,
} from "../providers/MovieProvider";

import { MovieList } from "./MovieList";

import { HorizontalScrollShadow } from "@/components/HorizontalScrollShadow";

interface MovieSuggestionsProps {
  items: import("../../domain/entities/Movie").Movie[];
  message?: string;
}

export const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({
  items,
  message = "Tambien podria gustarte",
}) => {
  const { status } = useMovieState();
  const { selectMovie } = useMovieActions();
  const { addTorrents } = useTorrentActions();
  const navigate = useNavigate();
  const handleMovieClick = (
    movie: import("../../domain/entities/Movie").Movie,
  ) => {
    selectMovie(movie);
    addTorrents(movie.torrents);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <>
      <h1 className="pt-10 text-2xl font-bold">{message}</h1>
      <HorizontalScrollShadow>
        <MovieList
          className="flex gap-2"
          error={status === "error"}
          loading={status === "loading"}
          movies={items}
          onMovieClick={handleMovieClick}
        />
      </HorizontalScrollShadow>
    </>
  );
};

export default MovieSuggestions;
