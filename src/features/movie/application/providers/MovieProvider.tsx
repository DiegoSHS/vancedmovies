import { createContext, useContext, ReactNode } from "react";
import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { BaseState, useBaseProviderState, useBaseReducer } from "@/utils";
import { Movie } from "../../domain/entities/Movie";
import { HashResult } from "../../domain/entities/Hashes";
export interface MovieProviderProps {
  children: ReactNode;
}

interface MovieContextType {
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
  query: string;
  loading: boolean;
  totalResults: number;
  error: string | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);



export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const {
    error,
    loading,
    query,
    totalResults,
    modifyProviderState
  } = useBaseProviderState()
  const { state, dispatch } = useBaseReducer<Movie>()
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);
  const getMovies = async (page: number) => {
    try {
      modifyProviderState({ loading: true, error: null });
      const { data } = await movieRepository.getMovies(page);
      if (!data?.movies) return []
      modifyProviderState({
        totalResults: data.movie_count,
        error: null,
      })
      dispatch({ type: "SET", payload: data.movies });
      return data.movies
    } catch (error) {
      dispatch({ type: "RESET" });
      modifyProviderState({ error: "Error al obtener las películas" });
      return []
    } finally {
      modifyProviderState({ loading: false });
    }
  };
  const getMoreMovies = async (page: number) => {
    try {
      modifyProviderState({ loading: true, error: null });
      const { data } = await movieRepository.getMovies(page);
      if (!data?.movies) return []
      modifyProviderState({
        totalResults: data.movie_count,
        error: null,
      })
      const merged = [...state.items, ...data.movies]
      const hashes = new Set<string>()
      const filtered = merged
        .filter((item) => {
          if (!hashes.has(item.imdb_code)) {
            hashes.add(item.imdb_code)
            return true
          }
          return false
        })
      dispatch({ type: "SET", payload: filtered });
      return data.movies
    } catch (error) {
      dispatch({ type: "RESET" });
      modifyProviderState({ error: "Error al obtener las películas" });
      return []
    } finally {
      modifyProviderState({ loading: false });
    }
  }
  const getMovieById = async (id: number) => {
    try {
      modifyProviderState({ loading: true, error: null });
      const { data } = await movieRepository.getMovieById(id);
      if (!data) return
      dispatch({ type: "SELECT", payload: data });
      return data
    } catch (error) {
      dispatch({ type: "RESET" });
      modifyProviderState({ error: "Error al obtener la película" });
    } finally {
      modifyProviderState({ loading: false });
    }
  };
  const searchMovies = async (page: number) => {
    try {
      if (query.trim() === '') return []
      modifyProviderState({ loading: true, error: null });
      const { data } = await movieRepository.searchMovies(query, page);
      modifyProviderState
      if (!data?.movies) {
        const { toast } = await import('@heroui/react')
        toast.info('A veces las peliculas tienen títulos muy raros, intenta con otro nombre')
        dispatch({ type: "RESET" });
        modifyProviderState({ totalResults: 0, error: null })
        return []
      }
      modifyProviderState({
        totalResults: data.movie_count
      });
      dispatch({ type: "SET", payload: data.movies });
      return data.movies
    } catch (error) {
      modifyProviderState({ error: "Error al buscar películas" });
      dispatch({ type: "RESET" });
      return []
    } finally {
      modifyProviderState({ loading: false });
    }
  };
  const getMovieSuggestions = async (id: number) => {
    try {
      modifyProviderState({ loading: true, error: null })
      const { data } = await movieRepository.getMovieSuggestions(id)
      if (!data?.movies) return []
      modifyProviderState({ totalResults: data.movie_count })
      dispatch({ type: "SET", payload: data.movies })
      return data.movies
    } catch (error) {
      modifyProviderState({ error: "Error al conseguir recomendaciones" })
      dispatch({ type: "SET", payload: [] })
      return []
    } finally {
      modifyProviderState({ loading: false })
    }
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
    modifyProviderState({ loading: true })
    const hashes = await movieRepository.getCommunityHashes()
    modifyProviderState({ loading: false })
    return hashes
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
  const value: MovieContextType = {
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
    loading,
    totalResults,
    error
  };

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
