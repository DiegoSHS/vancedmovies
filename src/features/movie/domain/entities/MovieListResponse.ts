import { Movie } from "./Movie";

export interface MovieListResponse {
  movie_count: number;
  limit: number;
  page_number: number;
  movies: Movie[];
}
