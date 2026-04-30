import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { MovieDownloads } from "../components/MovieDownloads";
import { useMovieContext } from "../providers/MovieProvider";
import { MovieDetailsCard } from "../components/MovieDetailsCard";
import { useTPBMovieContext } from "../providers/TPBMovieProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BackButton } from "@/components/BackButton";
import { MovieSuggestions } from "../components/MovieSuggestions";
import { ViewModeSwitch } from "@/components/ViewModeSwitch";

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
  const {
    getMovieById,
    getMovieSuggestions,
    status,
    state: { selectedItem: movie, items },
  } = useMovieContext();
  const {
    getMoreTorrents,
    addTorrents,
    state: { items: magnets }
  } = useTPBMovieContext()

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

  if (status === "error") return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Error al cargar la película
        </h1>
        <BackButton />
      </div>
    </div>
  );

  const shouldBeViewModeTable = magnets.length > 10

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-2 items-center">
      <BackButton />
      <MovieDetailsCard
        movie={movie}
      />
      <VideoPlayer
        movieTitle={movie?.title || 'Disfruta tu película'}
      />
      <ViewModeSwitch
        isDisabled={shouldBeViewModeTable}
        mode={shouldBeViewModeTable ? 'table' : viewMode}
        swapViewMode={swapViewMode}
      />
      <MovieDownloads
        mode={shouldBeViewModeTable ? 'table' : viewMode}
      />
      <MovieSuggestions
        items={items}
      />
    </div>
  );
};
