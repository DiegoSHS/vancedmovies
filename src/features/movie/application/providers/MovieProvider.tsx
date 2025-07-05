import React, { createContext, useContext, ReactNode, useState } from "react";

import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { BaseState, useBaseReducer } from "@/utils";
import { Movie } from "../../domain/entities/Movie";

interface MovieContextType {
  state: BaseState<Movie>;
  getMovies: (page: number) => Promise<void>;
  getMovieById: (id: number) => Promise<void>;
  searchMovies: (page: number) => Promise<void>;
  updateQuery: (newQuery: string) => void;
  resetQuery: () => void;
  query: string;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);
  const { state, dispatch } = useBaseReducer<Movie>()

  const getMovies = async (page: number) => {
    try {
      const { data } = await movieRepository.getMovies(page);
      if (!data?.movies) return
      dispatch({ type: "SET", payload: data.movies });
    } catch (error) {
      dispatch({ type: "RESET" });
    }
  };
  const getMovieById = async (id: number) => {
    try {
      const { data } = await movieRepository.getMovieById(id);
      if (!data) return
      dispatch({ type: "SELECT", payload: data });
    } catch (error) {
      dispatch({ type: "RESET" });
    }
  };
  const searchMovies = async (page: number) => {
    try {
      const { data } = await movieRepository.searchMovies(query, page);
      if (!data?.movies) return
      dispatch({ type: "SET", payload: data.movies });
    } catch (error) {
      dispatch({ type: "RESET" });
    }
  };
  const updateQuery = (newQuery: string) => {
    setQuery((_) => newQuery);
  };
  const resetQuery = () => {
    setQuery('');
  };
  const value: MovieContextType = {
    state,
    getMovies,
    getMovieById,
    searchMovies,
    updateQuery,
    resetQuery,
    query,
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
