import { Movie } from "../entities/Movie";
import { MovieListResponse } from "../entities/MovieListResponse";

import { ApiResult } from "@/utils/ApiResult";

export abstract class MovieDatasource {
  abstract getMovies(
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>>;
  abstract getMovieById(id: number): Promise<ApiResult<Movie>>;
  abstract createMovie(movie: Omit<Movie, "id">): Promise<ApiResult<Movie>>;
  abstract updateMovie(
    id: number,
    movie: Partial<Movie>,
  ): Promise<ApiResult<Movie>>;
  abstract deleteMovie(id: number): Promise<ApiResult<boolean>>;
  abstract searchMovies(
    query: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>>;
  abstract getMoviesByGenre(
    genre: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>>;
  abstract getMoviesByYear(
    year: number,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>>;
  abstract getMoviesByRating(
    minimum_rating: number,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>>;
}
