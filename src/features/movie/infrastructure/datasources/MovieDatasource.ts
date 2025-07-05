import { Movie } from "../../domain/entities/Movie";
import { MovieListResponse } from "../../domain/entities/MovieListResponse";
import { MovieDatasource } from "../../domain/datasources/MovieDatasource";

import { ApiResult } from "@/utils/ApiResult";
import { ApiClient } from "@/utils/ApiClient";

export class MovieDatasourceImp extends MovieDatasource {
  async getMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { data } = await ApiClient.get<ApiResult<MovieListResponse>>(
        `/list_movies.json?page=${page}&limit=${limit}&sort_by=year&order_by=desc`,
      );
      return data
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movies",
      };
    }
  }

  async getMovieById(id: number): Promise<ApiResult<Movie>> {
    try {
      const { data } = await ApiClient.get(
        `/movie_details.json?movie_id=${id}`,
      );
      return {
        status_message: data.status_message,
        status: data.status,
        data: data.data.movie,
        "@meta": data["@meta"],
      }
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movie by ID",
      };
    }
  }

  async createMovie(_movie: Omit<Movie, "id">): Promise<ApiResult<Movie>> {
    try {
      // YTS API no soporta crear películas, esto es solo para mantener la interfaz
      throw new Error("YTS API does not support creating movies");
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error creating movie",
      };
    }
  }

  async updateMovie(
    _id: number,
    _movie: Partial<Movie>,
  ): Promise<ApiResult<Movie>> {
    try {
      // YTS API no soporta actualizar películas, esto es solo para mantener la interfaz
      throw new Error("YTS API does not support updating movies");
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error updating movie",
      };
    }
  }

  async deleteMovie(_id: number): Promise<ApiResult<boolean>> {
    try {
      // YTS API no soporta eliminar películas, esto es solo para mantener la interfaz
      throw new Error("YTS API does not support deleting movies");
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error deleting movie",
      };
    }
  }

  async searchMovies(
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { data } = await ApiClient.get<ApiResult<MovieListResponse>>(
        `/list_movies.json?query_term=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      return data;
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error searching movies",
      };
    }
  }

  async getMoviesByGenre(
    genre: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { data } = await ApiClient.get<ApiResult<MovieListResponse>>(
        `/list_movies.json?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`,
      );
      return data;
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movies by genre",
      };
    }
  }

  async getMoviesByYear(
    year: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { data } = await ApiClient.get<ApiResult<MovieListResponse>>(
        `/list_movies.json?year=${year}&page=${page}&limit=${limit}`,
      );
      return data;
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movies by year",
      };
    }
  }

  async getMoviesByRating(
    minimum_rating: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { data } = await ApiClient.get<ApiResult<MovieListResponse>>(
        `/list_movies.json?minimum_rating=${minimum_rating}&page=${page}&limit=${limit}`,
      );
      return data;
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movies by rating",
      };
    }
  }
}
