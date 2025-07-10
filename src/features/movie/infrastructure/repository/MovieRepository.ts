import { Movie } from "../../domain/entities/Movie";
import { MovieListResponse } from "../../domain/entities/YTSMovieListResponse";
import { MovieRepository } from "../../domain/repository/MovieRepository";
import { MovieDatasource } from "../../domain/datasources/MovieDatasource";

import { ApiResult } from "@/utils/ApiResult";
import { MovieListResult } from "../../domain/entities/1337XMovieListResult";

export class MovieRepositoryImp extends MovieRepository {
  constructor(private readonly datasource: MovieDatasource) {
    super();
  }

  async getMovies(
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return await this.datasource.getMovies(page, limit);
  }

  async getMovieById(id: number): Promise<ApiResult<Movie>> {
    return await this.datasource.getMovieById(id);
  }

  async createMovie(movie: Omit<Movie, "id">): Promise<ApiResult<Movie>> {
    return await this.datasource.createMovie(movie);
  }

  async updateMovie(
    id: number,
    movie: Partial<Movie>,
  ): Promise<ApiResult<Movie>> {
    return await this.datasource.updateMovie(id, movie);
  }

  async deleteMovie(id: number): Promise<ApiResult<boolean>> {
    return await this.datasource.deleteMovie(id);
  }

  async searchMovies(
    query: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return await this.datasource.searchMovies(query, page, limit);
  }

  async getMoviesByGenre(
    genre: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return await this.datasource.getMoviesByGenre(genre, page, limit);
  }

  async getMoviesByYear(
    year: number,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return await this.datasource.getMoviesByYear(year, page, limit);
  }

  async getMoviesByRating(
    minimum_rating: number,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return await this.datasource.getMoviesByRating(minimum_rating, page, limit);
  }
  async getMoreTorrents(movie: Movie): Promise<MovieListResult> {
    return await this.datasource.getMoreTorrents(movie);
  }
}
