import { HashResult } from "../entities/Hashes";
import { Movie } from "../entities/Movie";
import { Torrent } from "../entities/Torrent";
import { MovieListResponse } from "../entities/YTSMovieListResponse";
import { ApiResult } from "@/utils/ApiResult";

export abstract class MovieDatasource {
  abstract getMovies(
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>>;
  abstract getMovieById(id: number): Promise<ApiResult<Movie>>;
  abstract searchMovies(
    query: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResult<MovieListResponse>>;
  abstract getMovieSuggestions(id: number): Promise<ApiResult<MovieListResponse>>
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
  abstract getMoreTorrents(
    title: string,
  ): Promise<Torrent[]>;
  abstract addCommunityHash(id: string, hash: string): Promise<number>;
  abstract getCommunityHashes(): Promise<HashResult[]>;
}