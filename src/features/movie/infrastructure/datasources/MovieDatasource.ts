import { MovieDatasource } from "../../domain/datasources/MovieDatasource";
export class MovieDatasourceImp extends MovieDatasource {
  async getMovies(
    page: number = 1,
    limit: number = 24,
  ) {
    const { GetMovies } = await import("./transactions")
    return GetMovies(page, limit)
  }
  async getMovieSuggestions(id: number) {
    const { GetMovieSuggestions } = await import("./transactions")
    return GetMovieSuggestions(id)
  }
  async getMovieById(id: number) {
    const { GetMovieById } = await import("./transactions")
    return GetMovieById(id)
  }
  async searchMovies(
    query: string,
    page: number = 1,
    limit: number = 24,
  ) {
    const { SearchMovies } = await import("./transactions")
    return SearchMovies(query, page, limit)
  }
  async getMoviesByGenre(
    genre: string,
    page: number = 1,
    limit: number = 24,
  ) {
    const { GetMoviesByGenre } = await import("./transactions")
    return GetMoviesByGenre(genre, page, limit)
  }

  async getMoviesByYear(
    year: number,
    page: number = 1,
    limit: number = 24,
  ) {
    const { GetMoviesByYear } = await import("./transactions")
    return GetMoviesByYear(year, page, limit)
  }

  async getMoviesByRating(
    minimum_rating: number,
    page: number = 1,
    limit: number = 24,
  ) {
    const { GetMoviesByRating } = await import("./transactions")
    return GetMoviesByRating(minimum_rating, page, limit)
  }
}
