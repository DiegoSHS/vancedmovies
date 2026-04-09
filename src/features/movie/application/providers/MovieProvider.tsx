import { createContext, useContext, ReactNode } from "react";
import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { BaseState, useBaseProviderState, useBaseReducer } from "@/utils";
import { Movie } from "../../domain/entities/Movie";
import { Torrent, XMovieToTorrent } from "../../domain/entities/Torrent";
export interface MovieProviderProps {
  children: ReactNode;
}

interface MovieContextType {
  state: BaseState<Movie>;
  getMovies: (page: number) => Promise<Movie[]>;
  getMovieById: (id: number) => Promise<Movie | undefined>;
  getMoreTorrents: (movie: Movie) => Promise<Torrent[]>;
  cleanSelectedMovie: () => void;
  searchMovies: (page: number) => Promise<Movie[]>;
  updateQuery: (newQuery: string) => void;
  resetQuery: () => void;
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
        loading: false,
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
  const getMoreTorrents = async (movie: Movie) => {
    try {
      modifyProviderState({ error: null });
      const data = await movieRepository.getMoreTorrents(movie);
      if (!data?.movies) return []
      const magnetLinks = data.movies.map(XMovieToTorrent)
      return magnetLinks
    } catch (error) {
      modifyProviderState({ error: "Error al obtener más torrents" });
      return []
    }
  }
  const searchMovies = async (page: number) => {
    try {
      if (query.trim() === '') return []
      modifyProviderState({ loading: true, error: null });
      const { data } = await movieRepository.searchMovies(query, page);
      modifyProviderState
      if (!data?.movies) return []
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
  const cleanSelectedMovie = () => {
    dispatch({ type: "SELECT", payload: undefined });
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
    getMovieById,
    getMoreTorrents,
    cleanSelectedMovie,
    searchMovies,
    updateQuery,
    resetQuery,
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
