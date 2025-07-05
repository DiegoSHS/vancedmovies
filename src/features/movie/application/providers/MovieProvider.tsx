import React, { createContext, useContext, ReactNode } from "react";

import { MovieRepository } from "../../domain/repository/MovieRepository";
import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";

interface MovieContextType {
  movieRepository: MovieRepository;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);

  const value: MovieContextType = {
    movieRepository,
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
