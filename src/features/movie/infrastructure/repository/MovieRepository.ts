import { Movie } from "../../domain/entities/Movie";
import { MovieListResponse } from "../../domain/entities/YTSMovieListResponse";
import { MovieRepository } from "../../domain/repository/MovieRepository";
import { MovieDatasource } from "../../domain/datasources/MovieDatasource";

import { ApiResult } from "@/utils/apiResult";
import { Torrent } from "../../domain/entities/Torrent";
import { HashResult } from "../../domain/entities/Hashes";

export class MovieRepositoryImp extends MovieRepository {
  constructor(private readonly datasource: MovieDatasource) {
    super();
  }

  async getMovies(
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return this.datasource.getMovies(page, limit);
  }

  async getMovieById(id: number): Promise<ApiResult<Movie>> {
    return this.datasource.getMovieById(id);
  }

  async searchMovies(
    query: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return this.datasource.searchMovies(query, page, limit);
  }
  getMovieSuggestions(id: number): Promise<ApiResult<MovieListResponse>> {
    return this.datasource.getMovieSuggestions(id)
  }
  async getMoviesByGenre(
    genre: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return this.datasource.getMoviesByGenre(genre, page, limit);
  }

  async getMoviesByYear(
    year: number,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return this.datasource.getMoviesByYear(year, page, limit);
  }

  async getMoviesByRating(
    minimum_rating: number,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>> {
    return this.datasource.getMoviesByRating(minimum_rating, page, limit);
  }
  async getMoreTorrents(title: string): Promise<Torrent[]> {
    return this.datasource.getMoreTorrents(title);
  }
  addCommunityHash(id: string, hash: string): Promise<number> {
    return this.datasource.addCommunityHash(id, hash);
  }
  getCommunityHashes(): Promise<HashResult[]> {
    return this.datasource.getCommunityHashes();
  }
}