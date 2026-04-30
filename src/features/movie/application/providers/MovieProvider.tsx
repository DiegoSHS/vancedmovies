import { createContext, useContext, ReactNode, useMemo } from "react";
import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { Movie } from "../../domain/entities/Movie";
import { HashResult } from "../../domain/entities/Hashes";
import { BaseState, ProviderState, useBaseProviderState, useBaseReducer } from "@/utils/baseProvider";
import { MovieStateHandler } from "../../infrastructure/repository/MovieStateHandler";
export interface MovieProviderProps {
  children: ReactNode;
}

interface MovieContextType extends ProviderState {
  state: BaseState<Movie>;
  getMovies: (page: number) => Promise<Movie[]>;
  getMoreMovies: (page: number) => Promise<Movie[]>
  getMovieById: (id: number) => Promise<Movie | undefined>;
  cleanSelectedMovie: () => void;
  searchMovies: (page: number) => Promise<Movie[]>;
  updateQuery: (newQuery: string) => void;
  resetQuery: () => void;
  selectMovie: (movie: Movie) => void
  addCommunityHash: (id: string, hash: string) => Promise<number>
  getCommunityHashes: () => Promise<HashResult[]>
  getMovieSuggestions: (id: number) => Promise<Movie[]>
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const {
    status,
    query,
    totalResults,
    modifyProviderState
  } = useBaseProviderState()
  const { state, dispatch } = useBaseReducer<Movie>()
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);
  const handler = new MovieStateHandler(modifyProviderState, dispatch)
  const getMovies = async (page: number) => {
    return handler.mhandler(movieRepository.getMovies(page))
  };
  const getMoreMovies = async (page: number) => {
    const data = await handler.mhandler(movieRepository.getMovies(page))
    const merged = [...state.items, ...data]
    const hashes = new Set<string>()
    const filtered = merged.filter((item) => {
      if (!hashes.has(item.imdb_code)) {
        hashes.add(item.imdb_code)
        return true
      }
      return false
    })
    return filtered
  }
  const getMovieById = async (id: number) => {
    return handler.shandler(movieRepository.getMovieById(id))
  }
  const searchMovies = async (page: number) => {
    if (query.trim() === '') return []
    const data = await handler.mhandler(movieRepository.searchMovies(query, page))
    if (!data.length) {
      const { toast } = await import('@heroui/react')
      toast.info('A veces las peliculas tienen títulos muy raros, intenta con otro nombre')
      return []
    }
    return data
  }
  const getMovieSuggestions = async (id: number) => {
    return handler.mhandler(movieRepository.getMovieSuggestions(id))
  }
  const addCommunityHash = async (id: string, hash: string) => {
    const { toast } = await import('@heroui/react')
    const result = await movieRepository.addCommunityHash(id, hash)
    const message =
      result > 0 ? "Torrent añadido" :
        result === -1 ? "Error al añadir el torrent" :
          "El torrent ya existe"
    toast(message)
    return result
  }
  const getCommunityHashes = async () => {
    return movieRepository.getCommunityHashes()
  }
  const cleanSelectedMovie = () => {
    dispatch({ type: "SELECT", payload: undefined });
  }
  const selectMovie = (movie: Movie) => {
    dispatch({ type: 'SELECT', payload: movie })
  }
  const updateQuery = (newQuery: string) => {
    modifyProviderState({ query: newQuery });
  };
  const resetQuery = () => {
    modifyProviderState({ query: '' });
  };
  const value: MovieContextType = useMemo(() => ({
    state,
    getMovies,
    getMoreMovies,
    getMovieById,
    cleanSelectedMovie,
    searchMovies,
    updateQuery,
    resetQuery,
    selectMovie,
    addCommunityHash,
    getCommunityHashes,
    getMovieSuggestions,
    query,
    totalResults,
    status
  }), [state])

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export const useMovieContext = (): MovieContextType => {
  const context = useContext(MovieContext);

  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }

  return context;
};
