import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link, ScrollShadow, Spinner } from "@heroui/react";
import { VideoPlayer } from "../components/VideoPlayer";
import { MovieDownloads, ViewModeSwitch } from "../components/MovieDownloads";
import { useMovieContext } from "../providers/MovieProvider";
import { MovieDetailsCard } from "../components/MovieDetailsCard";
import { useTPBMovieContext } from "../providers/TPBMovieProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BackButton } from "@/components/BackButton";
import { Movie } from "../../domain/entities/Movie";
import { MovieList } from "../components/MovieList";

export const MovieDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { item: viewMode, setItem } = useLocalStorage('viewMode', 'card')
  const swapViewMode = () => {
    if (viewMode === 'table') {
      setItem('card')
    } else {
      setItem('table')
    }
  }
  const navigate = useNavigate()
  const {
    getMovieById,
    selectMovie,
    getMovieSuggestions,
    error,
    state: { selectedItem: movie, items },
  } = useMovieContext();
  const {
    getMoreTorrents,
    addTorrents,
    state: { items: magnets }
  } = useTPBMovieContext()
  const handleMovieClick = (movie: Movie) => {
    selectMovie(movie)
    addTorrents(movie.torrents)
    navigate(`/movie/${movie.id}`);
  };
  const fetchMovieData = async () => {
    if (movie) {
      addTorrents(movie.torrents)
      getMoreTorrents(movie.title)
      getMovieSuggestions(movie.id)
      return
    }
    if (!id) return;
    const result = await getMovieById(parseInt(id))
    if (!result) return
    addTorrents(result.torrents)
    getMoreTorrents(result.title)
    getMovieSuggestions(result.id)
  }
  const effect = () => {
    fetchMovieData()
  }

  useEffect(effect, [id]);
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Error al cargar la película
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error || "No se encontró la película"}
        </p>
        <Link
          href="/page/1"
          className='no-underline button button--primary'
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  const shouldBeViewModeTable = magnets.length > 10

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-2 items-center">
      <BackButton />
      <MovieDetailsCard
        movie={movie}
      />
      <VideoPlayer
        movieTitle={movie.title}
      />
      <div className="flex w-full items-center justify-end">
        <ViewModeSwitch
          isDisabled={shouldBeViewModeTable}
          mode={shouldBeViewModeTable ? 'table' : viewMode}
          swapViewMode={swapViewMode}
        />
      </div>
      <MovieDownloads
        mode={shouldBeViewModeTable ? 'table' : viewMode}
      />
      <h1 className="pt-10 text-2xl font-bold">
        Tambien podria gustarte
      </h1>
      <ScrollShadow hideScrollBar className="w-full flex overflow-auto" orientation="horizontal">
        <MovieList
          className="flex gap-2"
          error={error}
          movies={items}
          onMovieClick={handleMovieClick}
        />
      </ScrollShadow>
    </div>
  );
};
