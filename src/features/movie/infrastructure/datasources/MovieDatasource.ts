import { Movie } from "../../domain/entities/Movie";
import { MovieListResponse } from "../../domain/entities/YTSMovieListResponse";
import { MovieDatasource } from "../../domain/datasources/MovieDatasource";

import { ApiResult } from "@/utils/ApiResult";

export class MovieDatasourceImp extends MovieDatasource {
  async getMovies(
    page: number = 1,
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    const { GetMovies } = await import("./transactions")
    return GetMovies(page, limit)
  }
  async getMovieSuggestions(id: number): Promise<ApiResult<MovieListResponse>> {
    const { GetMovieSuggestions } = await import("./transactions")
    return GetMovieSuggestions(id)
  }
  async getMovieById(id: number): Promise<ApiResult<Movie>> {
    const { GetMovieById } = await import("./transactions")
    return GetMovieById(id)
  }
  async searchMovies(
    query: string,
    page: number = 1,
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    const { SearchMovies } = await import("./transactions")
    return SearchMovies(query, page, limit)
  }
  async getMoviesByGenre(
    genre: string,
    page: number = 1,
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    const { GetMoviesByGenre } = await import("./transactions")
    return GetMoviesByGenre(genre, page, limit)
  }

  async getMoviesByYear(
    year: number,
    page: number = 1,
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    const { GetMoviesByYear } = await import("./transactions")
    return GetMoviesByYear(year, page, limit)
  }

  async getMoviesByRating(
    minimum_rating: number,
    page: number = 1,
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    const { GetMoviesByRating } = await import("./transactions")
    return GetMoviesByRating(minimum_rating, page, limit)
  }
}
