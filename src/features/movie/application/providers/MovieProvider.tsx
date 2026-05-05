import { createContext, useContext, useMemo, useCallback } from "react";

import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { Movie } from "../../domain/entities/Movie";
import { MovieStateHandler } from "../../infrastructure/repository/MovieStateHandler";

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

interface MovieActionsContextType {
  getMovies: (page: number) => Promise<Movie[]>;
  getMoreMovies: (page: number) => Promise<Movie[]>;
  getMovieById: (id: number) => Promise<Movie | undefined>;
  searchMovies: (page: number) => Promise<Movie[]>;
  updateQuery: (newQuery: string) => void;
  resetQuery: () => void;
  selectMovie: (movie: Movie) => void;
  getMovieSuggestions: (id: number) => Promise<Movie[]>;
}

// Contextos separados
const MovieStateContext = createContext<MovieStateContextType | undefined>(
  undefined,
);
const MovieActionsContext = createContext<MovieActionsContextType | undefined>(
  undefined,
);

// Providers para los contextos
export const MovieStateProvider: React.FC<{
  children: React.ReactNode;
  value: MovieStateContextType;
}> = ({ children, value }) => (
  <MovieStateContext.Provider value={value}>
    {children}
  </MovieStateContext.Provider>
);

export const MovieActionsProvider: React.FC<{
  children: React.ReactNode;
  value: MovieActionsContextType;
}> = ({ children, value }) => (
  <MovieActionsContext.Provider value={value}>
    {children}
  </MovieActionsContext.Provider>
);

// Hooks para consumir los contextos
export const useMovieState = (): MovieStateContextType => {
  const context = useContext(MovieStateContext);

  if (!context)
    throw new Error("useMovieState must be used within MovieStateProvider");

  return context;
};

export const useMovieActions = (): MovieActionsContextType => {
  const context = useContext(MovieActionsContext);

  if (!context)
    throw new Error("useMovieActions must be used within MovieActionsProvider");

  return context;
};

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { status, query, totalResults, modifyProviderState } =
    useBaseProviderState();
  const { state, dispatch } = useBaseReducer<Movie>();
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);
  // Memoiza handler para evitar recrearlo en cada render
  const handler = useMemo(
    () => new MovieStateHandler(modifyProviderState, dispatch),
    [modifyProviderState, dispatch],
  );

  // Memoiza las funciones con useCallback
  const getMovies = useCallback(
    async (page: number) => {
      return handler.many(movieRepository.getMovies(page));
    },
    [handler, movieRepository],
  );

  const getMoreMovies = useCallback(
    async (page: number) => {
      const data = await handler.many(movieRepository.getMovies(page));

      return [...state.items, ...data];
    },
    [handler, movieRepository, state.items],
  );

  const getMovieById = useCallback(
    async (id: number) => {
      return handler.unique(movieRepository.getMovieById(id));
    },
    [handler, movieRepository],
  );

  const searchMovies = useCallback(
    async (page: number) => {
      if (query.trim() === "") return [];
      const data = await handler.many(
        movieRepository.searchMovies(query, page),
      );

      if (!data.length) {
        const { toast } = await import("@heroui/react");

        toast.warning(
          "A veces las peliculas tienen títulos muy raros, intenta con otro nombre",
        );

        return [];
      }

      return data;
    },
    [handler, movieRepository, query],
  );

  const getMovieSuggestions = useCallback(
    async (id: number) => {
      return handler.many(movieRepository.getMovieSuggestions(id));
    },
    [handler, movieRepository],
  );

  const selectMovie = useCallback(
    (movie: Movie) => {
      dispatch({ type: "SELECT", payload: movie });
    },
    [dispatch],
  );

  const updateQuery = useCallback(
    (newQuery: string) => {
      modifyProviderState({ query: newQuery });
    },
    [modifyProviderState],
  );

  const resetQuery = useCallback(() => {
    modifyProviderState({ query: "" });
  }, [modifyProviderState]);

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

  const movieActionsValue = useMemo(
    () => ({
      getMovies,
      getMoreMovies,
      getMovieById,
      searchMovies,
      updateQuery,
      resetQuery,
      selectMovie,
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
      getMovieSuggestions,
    ],
  );

  return (
    <MovieStateProvider value={movieStateValue}>
      <MovieActionsProvider value={movieActionsValue}>
        {children}
      </MovieActionsProvider>
    </MovieStateProvider>
  );
};
