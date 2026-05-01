import { createContext, useContext, useMemo } from "react";

import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { Movie } from "../../domain/entities/Movie";
import { HashResult } from "../../domain/entities/Hashes";
import { MovieStateHandler } from "../../infrastructure/repository/MovieStateHandler";
import { Torrent } from "../../domain/entities/Torrent";

import {
  BaseState,
  ProviderState,
  useBaseProviderState,
  useBaseReducer,
} from "@/utils/baseProvider";

// Interfaces para los contextos separados
interface MovieStateContextType extends ProviderState {
  state: BaseState<Movie>;
}

interface TorrentStateContextType {
  torrentState: BaseState<Torrent>;
}

interface MovieActionsContextType {
  getMovies: (page: number) => Promise<Movie[]>;
  getMoreMovies: (page: number) => Promise<Movie[]>;
  getMovieById: (id: number) => Promise<Movie | undefined>;
  searchMovies: (page: number) => Promise<Movie[]>;
  updateQuery: (newQuery: string) => void;
  resetQuery: () => void;
  selectMovie: (movie: Movie) => void;
  addCommunityHash: (id: string, hash: string) => Promise<number>;
  getCommunityHashes: () => Promise<HashResult[]>;
  getMovieSuggestions: (id: number) => Promise<Movie[]>;
}

interface TorrentActionsContextType {
  getMoreTorrents: (title: string, initial?: Torrent[]) => Promise<Torrent[]>;
  addTorrents: (torrents: Torrent[], initial?: Torrent[]) => Promise<Torrent[]>;
  selectTorrent: (magnet: Torrent) => Promise<void>;
  autoSelectTorrent: (magnets?: Torrent[]) => Promise<void>;
}

// Contextos separados
const MovieStateContext = createContext<MovieStateContextType | undefined>(
  undefined,
);
const TorrentStateContext = createContext<TorrentStateContextType | undefined>(
  undefined,
);
const MovieActionsContext = createContext<MovieActionsContextType | undefined>(
  undefined,
);
const TorrentActionsContext = createContext<
  TorrentActionsContextType | undefined
>(undefined);

// Providers para los contextos
export const MovieStateProvider: React.FC<{
  children: React.ReactNode;
  value: MovieStateContextType;
}> = ({ children, value }) => (
  <MovieStateContext.Provider value={value}>
    {children}
  </MovieStateContext.Provider>
);

export const TorrentStateProvider: React.FC<{
  children: React.ReactNode;
  value: TorrentStateContextType;
}> = ({ children, value }) => (
  <TorrentStateContext.Provider value={value}>
    {children}
  </TorrentStateContext.Provider>
);

export const MovieActionsProvider: React.FC<{
  children: React.ReactNode;
  value: MovieActionsContextType;
}> = ({ children, value }) => (
  <MovieActionsContext.Provider value={value}>
    {children}
  </MovieActionsContext.Provider>
);

export const TorrentActionsProvider: React.FC<{
  children: React.ReactNode;
  value: TorrentActionsContextType;
}> = ({ children, value }) => (
  <TorrentActionsContext.Provider value={value}>
    {children}
  </TorrentActionsContext.Provider>
);

// Hooks para consumir los contextos
export const useMovieState = (): MovieStateContextType => {
  const context = useContext(MovieStateContext);

  if (!context)
    throw new Error("useMovieState must be used within MovieStateProvider");

  return context;
};

export const useTorrentState = (): TorrentStateContextType => {
  const context = useContext(TorrentStateContext);

  if (!context)
    throw new Error("useTorrentState must be used within TorrentStateProvider");

  return context;
};

export const useMovieActions = (): MovieActionsContextType => {
  const context = useContext(MovieActionsContext);

  if (!context)
    throw new Error("useMovieActions must be used within MovieActionsProvider");

  return context;
};

export const useTorrentActions = (): TorrentActionsContextType => {
  const context = useContext(TorrentActionsContext);

  if (!context)
    throw new Error(
      "useTorrentActions must be used within TorrentActionsProvider",
    );

  return context;
};

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { status, query, totalResults, modifyProviderState } =
    useBaseProviderState();
  const { state, dispatch } = useBaseReducer<Movie>();
  const { state: torrentState, dispatch: torrentDispatch } =
    useBaseReducer<Torrent>();
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);
  const handler = new MovieStateHandler(modifyProviderState, dispatch);
  const getMovies = async (page: number) => {
    return handler.many(movieRepository.getMovies(page));
  };
  const getMoreMovies = async (page: number) => {
    const data = await handler.many(movieRepository.getMovies(page));

    return [...state.items, ...data];
  };
  const getMovieById = async (id: number) => {
    return handler.unique(movieRepository.getMovieById(id));
  };
  const searchMovies = async (page: number) => {
    if (query.trim() === "") return [];
    const data = await handler.many(movieRepository.searchMovies(query, page));
    if (!data.length) {
      const { toast } = await import("@heroui/react");
      toast.warning(
        "A veces las peliculas tienen títulos muy raros, intenta con otro nombre",
      );
      return [];
    }

    return data;
  };
  const getMovieSuggestions = async (id: number) => {
    return handler.many(movieRepository.getMovieSuggestions(id));
  };

  const addCommunityHash = async (id: string, hash: string) => {
    const { toast } = await import("@heroui/react");
    const result = await movieRepository.addCommunityHash(id, hash);
    const message =
      result > 0
        ? "Torrent añadido"
        : result === -1
          ? "Error al añadir el torrent"
          : "El torrent ya existe";

    toast(message);

    return result;
  };
  const getCommunityHashes = async () => {
    return handler.base(movieRepository.getCommunityHashes());
  };
  const selectTorrent = async (magnet: Torrent) => {
    torrentDispatch({ type: "SELECT", payload: magnet });
    const { toast } = await import("@heroui/react");

    toast.info("Torrent seleccionado");
  };
  const autoSelectTorrent = async (magnets: Torrent[] = torrentState.items) => {
    const { getBestQualityMagnets } = await import("@/utils/magnet/filter");
    const bestMagnets = getBestQualityMagnets(magnets);

    if (!bestMagnets.length) return;
    selectTorrent(bestMagnets[0]);
  };
  const addTorrents = async (torrents: Torrent[], initial?: Torrent[]) => {
    const sourceItems = initial ?? torrentState.items;
    const merged = [...torrents, ...sourceItems];

    if (!merged.length) return [];
    const { filterUniqueTorrents } = await import("@/utils/torrent");
    const filtered = filterUniqueTorrents(merged);
    const sorted = filtered.sort((p, n) => n.seeds - p.seeds);

    torrentDispatch({ type: "SET", payload: sorted });

    return sorted;
  };
  const getMoreTorrents = async (title: string, initial?: Torrent[]) => {
    const data = await handler.base(movieRepository.getMoreTorrents(title));
    const magnets = await addTorrents(data, initial);
    const dualMagnet = magnets.find((item) =>
      item.type.toUpperCase().includes("DUAL"),
    );

    if (dualMagnet) {
      await selectTorrent(dualMagnet);
    } else {
      await autoSelectTorrent(magnets);
    }

    return magnets;
  };
  const selectMovie = (movie: Movie) => {
    dispatch({ type: "SELECT", payload: movie });
  };
  const updateQuery = (newQuery: string) => {
    modifyProviderState({ query: newQuery });
  };
  const resetQuery = () => {
    modifyProviderState({ query: "" });
  };

  // Valores memoizados para los contextos separados
  const movieStateValue = useMemo(
    () => ({
      state,
      query,
      totalResults,
      status,
    }),
    [state, query, totalResults, status],
  );

  const torrentStateValue = useMemo(
    () => ({
      torrentState,
    }),
    [torrentState],
  );

  const movieActionsValue = useMemo(
    () => ({
      getMovies,
      getMoreMovies,
      getMovieById,
      searchMovies,
      updateQuery,
      resetQuery,
      selectMovie,
      addCommunityHash,
      getCommunityHashes,
      getMovieSuggestions,
    }),
    [
      getMovies,
      getMoreMovies,
      getMovieById,
      searchMovies,
      updateQuery,
      resetQuery,
      selectMovie,
      addCommunityHash,
      getCommunityHashes,
      getMovieSuggestions,
    ],
  );

  const torrentActionsValue = useMemo(
    () => ({
      getMoreTorrents,
      addTorrents,
      selectTorrent,
      autoSelectTorrent,
    }),
    [getMoreTorrents, addTorrents, selectTorrent, autoSelectTorrent],
  );

  return (
    <MovieStateProvider value={movieStateValue}>
      <TorrentStateProvider value={torrentStateValue}>
        <MovieActionsProvider value={movieActionsValue}>
          <TorrentActionsProvider value={torrentActionsValue}>
            {children}
          </TorrentActionsProvider>
        </MovieActionsProvider>
      </TorrentStateProvider>
    </MovieStateProvider>
  );
};
