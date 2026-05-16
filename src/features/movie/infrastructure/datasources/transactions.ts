import { ApiResult } from "@/utils/ApiResult";
import { MovieListResponse } from "../../domain/entities/YTSMovieListResponse";
import { Movie } from "../../domain/entities/Movie";

export const GetMovies = async (
    page: number,
    limit: number
) => {
    try {
        const { ApiClient } = await import("@/utils/ApiClient");
        const response = await ApiClient.get<ApiResult<MovieListResponse>>({
            path: `/list_movies.json?page=${page}&limit=${limit}&sort_by=year&order_by=desc`,
        });

        if (response.error !== null)
            return {
                status: "error",
                status_message: response.error || "Error fetching movies",
            };

        return response.data;
    } catch (error: any) {
        return {
            status: "error",
            status_message: error.message || "Error fetching movies",
        };
    }
}
export const GetMovieSuggestions = async (
    id: number
) => {
    try {
        const { ApiClient } = await import("@/utils/ApiClient");
        const result = await ApiClient.get<ApiResult<MovieListResponse>>({
            path: `/movie_suggestions.json?movie_id=${id}`,
        });

        if (result.error !== null)
            return {
                status: "error",
                status_message: result.error || "Error fetching movies",
            };

        return result.data;
    } catch (error: any) {
        return {
            status: "error",
            status_message: error.message || "Error fetching movies",
        };
    }
}
export const GetMovieById = async (id: number) => {
    try {
        const { ApiClient } = await import("@/utils/ApiClient");
        const result = await ApiClient.get<ApiResult<{ movie: Movie }>>({
            path: `/movie_details.json?movie_id=${id}`,
        });

        if (result.error !== null)
            return {
                status: "error",
                status_message: result.error || "Error fetching movie by ID",
            };

        return {
            ...result.data,
            data: result.data.data?.movie,
        };
    } catch (error: any) {
        return {
            status: "error",
            status_message: error.message || "Error fetching movie by ID",
        };
    }
}
export const SearchMovies = async (
    query: string,
    page: number,
    limit: number
) => {
    try {
        const { ApiClient } = await import("@/utils/ApiClient");
        const result = await ApiClient.get<ApiResult<MovieListResponse>>({
            path: `/list_movies.json?query_term=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        });

        if (result.error !== null)
            return {
                status: "error",
                status_message: result.error || "Error searching movies",
            };

        return result.data;
    } catch (error: any) {
        return {
            status: "error",
            status_message: error.message || "Error searching movies",
        };
    }
}
export const GetMoviesByGenre = async (
    genre: string,
    page: number,
    limit: number
) => {
    try {
        const { ApiClient } = await import("@/utils/ApiClient");
        const result = await ApiClient.get<ApiResult<MovieListResponse>>({
            path: `/list_movies.json?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}`,
        });

        if (result.error !== null)
            return {
                status: "error",
                status_message: result.error || "Error fetching movies by genre",
            };

        return result.data;
    } catch (error: any) {
        return {
            status: "error",
            status_message: error.message || "Error fetching movies by genre",
        };
    }
}
export const GetMoviesByYear = async (
    year: number,
    page: number,
    limit: number
) => {
    try {
        const { ApiClient } = await import("@/utils/ApiClient");
        const response = await ApiClient.get<ApiResult<MovieListResponse>>({
            path: `/list_movies.json?year=${year}&page=${page}&limit=${limit}`,
        });

        if (response.error !== null)
            return {
                status: "error",
                status_message: response.error || "Error fetching movies by year",
            };

        return response.data;
    } catch (error: any) {
        return {
            status: "error",
            status_message: error.message || "Error fetching movies by year",
        };
    }
}
export const GetMoviesByRating = async (
    minimum_rating: number,
    page: number,
    limit: number
) => {
    try {
        const { ApiClient } = await import("@/utils/ApiClient");
        const response = await ApiClient.get<ApiResult<MovieListResponse>>({
            path: `/list_movies.json?minimum_rating=${minimum_rating}&page=${page}&limit=${limit}`,
        });

        if (response.error !== null)
            return {
                status: "error",
                status_message: response.error || "Error fetching movies by rating",
            };

        return response.data;
    } catch (error: any) {
        return {
            status: "error",
            status_message: error.message || "Error fetching movies by rating",
        };
    }
}