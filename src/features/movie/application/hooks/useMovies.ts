import { useState } from "react";

import { Movie } from "../../domain/entities/Movie";
import { MovieListResponse } from "../../domain/entities/MovieListResponse";
import { useMovieContext } from "../providers/MovieProvider";

export const useMovies = () => {
  const { movieRepository } = useMovieContext();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieListData, setMovieListData] = useState<MovieListResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getMovies = async (page: number = 1, limit: number = 20) => {
    setLoading(true);
    setError("");

    try {
      const result = await movieRepository.getMovies(page, limit);

      if (result.status === "ok" && result.data) {
        setMovieListData(result.data);
        setMovies(result.data.movies);
      } else {
        setError(result.status_message || "Error al obtener películas");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const getMovieById = async (id: number): Promise<Movie | null> => {
    try {
      const result = await movieRepository.getMovieById(id);

      if (result.status === "ok" && result.data) {
        return result.data;
      }

      return null;
    } catch {
      return null;
    }
  };

  const searchMovies = async (
    query: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    setLoading(true);
    setError("");

    try {
      const result = await movieRepository.searchMovies(query, page, limit);

      if (result.status === "ok" && result.data) {
        setMovieListData(result.data);
        setMovies(result.data.movies);
      } else {
        setError(result.status_message || "Error en la búsqueda");
      }
    } catch (err: any) {
      setError(err.message || "Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  };

  const getMoviesByGenre = async (
    genre: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    setLoading(true);
    setError("");

    try {
      const result = await movieRepository.getMoviesByGenre(genre, page, limit);

      if (result.status === "ok" && result.data) {
        setMovieListData(result.data);
        setMovies(result.data.movies);
      } else {
        setError(
          result.status_message || "Error al obtener películas por género",
        );
      }
    } catch (err: any) {
      setError(err.message || "Error al obtener películas por género");
    } finally {
      setLoading(false);
    }
  };

  const getMoviesByYear = async (
    year: number,
    page: number = 1,
    limit: number = 20,
  ) => {
    setLoading(true);
    setError("");

    try {
      const result = await movieRepository.getMoviesByYear(year, page, limit);

      if (result.status === "ok" && result.data) {
        setMovieListData(result.data);
        setMovies(result.data.movies);
      } else {
        setError(result.status_message || "Error al obtener películas por año");
      }
    } catch (err: any) {
      setError(err.message || "Error al obtener películas por año");
    } finally {
      setLoading(false);
    }
  };

  const getMoviesByRating = async (
    minimum_rating: number,
    page: number = 1,
    limit: number = 20,
  ) => {
    setLoading(true);
    setError("");

    try {
      const result = await movieRepository.getMoviesByRating(
        minimum_rating,
        page,
        limit,
      );

      if (result.status === "ok" && result.data) {
        setMovieListData(result.data);
        setMovies(result.data.movies);
      } else {
        setError(
          result.status_message || "Error al obtener películas por rating",
        );
      }
    } catch (err: any) {
      setError(err.message || "Error al obtener películas por rating");
    } finally {
      setLoading(false);
    }
  };

  return {
    movies,
    movieListData,
    loading,
    error,
    getMovies,
    getMovieById,
    searchMovies,
    getMoviesByGenre,
    getMoviesByYear,
    getMoviesByRating,
  };
};
