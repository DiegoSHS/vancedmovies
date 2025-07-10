import React, { createContext, useContext, ReactNode, useState } from "react";

import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { BaseState, useBaseReducer } from "@/utils";
import { Movie } from "../../domain/entities/Movie";
import { generateMagnetLinksFromBackend, MagnetLinkResult } from "@/types";

interface MovieContextType {
  state: BaseState<Movie>;
  getMovies: (page: number) => Promise<void>;
  getMovieById: (id: number) => Promise<void>;
  getMoreTorrents: (movie: Movie) => Promise<MagnetLinkResult[]>;
  cleanSelectedMovie: () => void;
  searchMovies: (page: number) => Promise<void>;
  updateQuery: (newQuery: string) => void;
  resetQuery: () => void;
  query: string;
  loading: boolean;
  totalResults: number;
  error: string | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

interface MovieProviderProps {
  children: ReactNode;
}

interface ProviderState {
  query: string;
  totalResults: number;
  loading: boolean;
  error: string | null;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [{ error, loading, query, totalResults }, setProviderState] = useState<ProviderState>({
    query: '',
    totalResults: 0,
    loading: false,
    error: null,
  });
  const modifyProviderState = (newState: Partial<ProviderState>) => {
    setProviderState((prev) => ({
      ...prev,
      ...newState,
    }));
  }
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);
  const { state, dispatch } = useBaseReducer<Movie>()
  const getMovies = async (page: number) => {
    try {
      modifyProviderState({ loading: true, error: null });
      const { data } = await movieRepository.getMovies(page);
      if (!data?.movies) return
      modifyProviderState({
        totalResults: data.movie_count,
        loading: false,
        error: null,
      })
      dispatch({ type: "SET", payload: data.movies });
    } catch (error) {
      dispatch({ type: "RESET" });
      modifyProviderState({ error: "Error al obtener las películas" });
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
    } catch (error) {
      dispatch({ type: "RESET" });
      modifyProviderState({ error: "Error al obtener la película" });
    } finally {
      modifyProviderState({ loading: false });
    }
  };
  const getMoreTorrents = async (movie: Movie) => {
    try {
      modifyProviderState({ loading: true, error: null });
      const data = await movieRepository.getMoreTorrents(movie);
      if (!data?.movies) return []
      const magnetLinks = generateMagnetLinksFromBackend(data.movies);
      return magnetLinks
    } catch (error) {
      modifyProviderState({ error: "Error al obtener más torrents" });
      return []
    } finally {
      modifyProviderState({ loading: false });
    }
  }
  const searchMovies = async (page: number) => {
    try {
      if (query.trim() === '') return;
      modifyProviderState({ loading: true, error: null });
      const { data } = await movieRepository.searchMovies(query, page);
      modifyProviderState
      if (!data?.movies) return
      modifyProviderState({
        totalResults: data.movie_count
      });
      dispatch({ type: "SET", payload: data.movies });
    } catch (error) {
      modifyProviderState({ error: "Error al buscar películas" });
      dispatch({ type: "RESET" });
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
