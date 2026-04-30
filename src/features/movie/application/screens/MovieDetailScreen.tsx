import { lazy, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMovieContext } from "../providers/MovieProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BackButton } from "@/components/BackButton";
const ViewModeSwitch = lazy(() => import("@/components/ViewModeSwitch"))
const VideoPlayer = lazy(() => import("../components/VideoPlayer"))
const MovieDetailsCard = lazy(() => import("../components/MovieDetailsCard"))
const MovieSuggestions = lazy(() => import("../components/MovieSuggestions"))
const MovieDownloads = lazy(() => import("../components/MovieDownloads"))

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
    getMoreTorrents,
    addTorrents,
    status,
    state: { selectedItem: movie, items },
    torrentState: { items: magnets }
  } = useMovieContext();

  const fetchMovieData = async () => {
    if (movie) {
      addTorrents(movie.torrents)
      await Promise.all([
        getMoreTorrents(movie.title),
        getMovieSuggestions(movie.id)
      ])
      return
    }
    if (!id) return;
    const result = await getMovieById(parseInt(id))
    if (!result) return
    addTorrents(result.torrents)
    await Promise.all([
      getMoreTorrents(result.title),
      getMovieSuggestions(result.id)
    ])
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
