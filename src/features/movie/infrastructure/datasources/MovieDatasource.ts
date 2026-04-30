import { Movie } from "../../domain/entities/Movie";
import { MovieListResponse } from "../../domain/entities/YTSMovieListResponse";
import { MovieDatasource } from "../../domain/datasources/MovieDatasource";
import { ApiResult } from "@/utils/apiResult";
import { Torrent } from "../../domain/entities/Torrent";
import { HashResult } from "../../domain/entities/Hashes";

export class MovieDatasourceImp extends MovieDatasource {
  async getMovies(
    page: number = 1,
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const response = await ApiClient.get<ApiResult<MovieListResponse>>({
        path: `/list_movies.json?page=${page}&limit=${limit}&sort_by=year&order_by=desc`,
      });
      if ('error' in response) return {
        status: "error",
        status_message: response.error || "Error fetching movies",
      }
      return response.data
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movies",
      };
    }
  }
  async getMovieSuggestions(id: number): Promise<ApiResult<MovieListResponse>> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const result = await ApiClient.get<ApiResult<MovieListResponse>>({
        path: `/movie_suggestions.json?movie_id=${id}`
      })
      if ('error' in result) return {
        status: "error",
        status_message: result.error || "Error fetching movies",
      }
      return result.data
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movies",
      };
    }
  }
  async getMovieById(id: number): Promise<ApiResult<Movie>> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const result = await ApiClient.get<ApiResult<{ movie: Movie }>>({
        path: `/movie_details.json?movie_id=${id}`,
      });
      if ('error' in result) return {
        status: "error",
        status_message: result.error || "Error fetching movie by ID",
      }
      return {
        ...result.data,
        data: result.data.data?.movie,
      }
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movie by ID",
      };
    }
  }

  async searchMovies(
    query: string,
    page: number = 1,
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const result = await ApiClient.get<ApiResult<MovieListResponse>>({
        path: `/list_movies.json?query_term=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      });
      if ('error' in result) return {
        status: "error",
        status_message: result.error || "Error searching movies",
      }
      return result.data;
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
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const result = await ApiClient.get<ApiResult<MovieListResponse>>({
        path: `/list_movies.json?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`,
      });
      if ('error' in result) return {
        status: "error",
        status_message: result.error || "Error fetching movies by genre",
      }
      return result.data;
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
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const response = await ApiClient.get<ApiResult<MovieListResponse>>({
        path: `/list_movies.json?year=${year}&page=${page}&limit=${limit}`,
      });
      if ('error' in response) return {
        status: "error",
        status_message: response.error || "Error fetching movies by year",
      }
      return response.data
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
    limit: number = 24,
  ): Promise<ApiResult<MovieListResponse>> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const response = await ApiClient.get<ApiResult<MovieListResponse>>({
        path: `/list_movies.json?minimum_rating=${minimum_rating}&page=${page}&limit=${limit}`,
      });
      if ('error' in response) return {
        status: "error",
        status_message: response.error || "Error fetching movies by rating",
      }
      return response.data
    } catch (error: any) {
      return {
        status: "error",
        status_message: error.message || "Error fetching movies by rating",
      };
    }
  }
  async getMoreTorrents(query: string): Promise<Torrent[]> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      if (!Boolean(query)) return []
      const url = `${import.meta.env.VITE_NEST_BACKEND_URL}/tpb_search?title=${encodeURIComponent(query)}`
      const result = await ApiClient.get<Torrent[]>({
        path: url,
        overrideBaseURL: true
      })
      if ('error' in result) return []
      return result.data
    } catch (error: any) {
      return []
    }
  }
  async addCommunityHash(id: string, hash: string): Promise<number> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const url = `${import.meta.env.VITE_NEST_BACKEND_URL}/save_hash`
      const result = await ApiClient.post<number>({
        path: url,
        body: {
          name: id,
          hash,
        },
        options: {
          headers: {
            'Content-Type': 'application/json',
          }
        },
        overrideBaseURL: true
      })
      if ('error' in result) return -1
      return result.data
    } catch (error) {
      return -1
    }
  }
  async getCommunityHashes(): Promise<HashResult[]> {
    try {
      const { ApiClient } = await import('@/utils/apiClient')
      const url = `${import.meta.env.VITE_NEST_BACKEND_URL}/get_hashes`
      const result = await ApiClient.get<HashResult[]>({
        path: url,
        overrideBaseURL: true
      })
      if ('error' in result) return []
      return result.data
    } catch (error) {
      return []
    }

  }
}