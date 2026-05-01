import { lazy, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  useMovieState,
  useTorrentState,
  useMovieActions,
  useTorrentActions,
} from "../providers/MovieProvider";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BackButton } from "@/components/BackButton";
const ViewModeSwitch = lazy(() => import("@/components/ViewModeSwitch"));
const VideoPlayer = lazy(() => import("../components/VideoPlayer"));
const MovieDetailsCard = lazy(() => import("../components/MovieDetailsCard"));
const MovieSuggestions = lazy(() => import("../components/MovieSuggestions"));
const MovieDownloads = lazy(() => import("../components/MovieDownloads"));

export const MovieDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { item: viewMode, setItem } = useLocalStorage("viewMode", "card");
  const swapViewMode = () => {
    if (viewMode === "table") {
      setItem("card");
    } else {
      setItem("table");
    }
  };
  const { state, status } = useMovieState();
  const { torrentState } = useTorrentState();
  const { getMovieById, getMovieSuggestions } = useMovieActions();
  const { getMoreTorrents, addTorrents } = useTorrentActions();

  const fetchMovieData = async () => {
    if (state.selectedItem) {
      const initialMagnets = await addTorrents(state.selectedItem.torrents);

      await Promise.all([
        getMoreTorrents(state.selectedItem.title, initialMagnets),
        getMovieSuggestions(state.selectedItem.id),
      ]);

      return;
    }
    if (!id) return;
    const result = await getMovieById(parseInt(id));

    if (!result) return;
    const initialMagnets = await addTorrents(result.torrents);

    await Promise.all([
      getMoreTorrents(result.title, initialMagnets),
      getMovieSuggestions(result.id),
    ]);
  };

  const effect = () => {
    fetchMovieData();
  };

  useEffect(effect, [id]);

  if (status === "error")
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error al cargar la película
          </h1>
          <BackButton />
        </div>
      </div>
    );

  const shouldBeViewModeTable = torrentState.items.length > 10;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-2 items-center">
      <BackButton />
      <MovieDetailsCard movie={state.selectedItem} />
      <VideoPlayer
        magnetLink={torrentState.selectedItem?.hash}
        movieTitle={state.selectedItem?.title || "Disfruta tu película"}
      />
      <ViewModeSwitch
        isDisabled={shouldBeViewModeTable}
        mode={shouldBeViewModeTable ? "table" : viewMode}
        swapViewMode={swapViewMode}
      />
      <MovieDownloads mode={shouldBeViewModeTable ? "table" : viewMode} />
      <MovieSuggestions items={state.items} />
    </div>
  );
};
