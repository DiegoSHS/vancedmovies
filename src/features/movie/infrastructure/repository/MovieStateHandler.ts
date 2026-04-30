import { ApiResult } from "@/utils/ApiResult";
import { MovieListResponse } from "../../domain/entities/YTSMovieListResponse";
import { Action, ProviderState } from "@/utils/baseProvider";
import { Movie } from "../../domain/entities/Movie";

export class MovieStateHandler {
    constructor(
        private readonly update: (prev: Partial<ProviderState>) => void,
        private readonly dispatch: React.Dispatch<Action<Movie>>
    ) { }
    private async updateLoadState<T = ApiResult<MovieListResponse | Movie>>(promise: Promise<T>) {
        this.update({ status: "loading" })
        const data = await promise
        this.update({ status: "idle" })
        return data
    }
    private checkError(status: string) {
        if (status === "error") {
            this.update({ status })
            return true
        }
        return false
    }
    async base<T>(promise: Promise<T>) {
        return this.updateLoadState(promise)
    }
    async unique(promise: Promise<ApiResult<Movie>>) {
        const { status, data } = await this.updateLoadState(promise)
        const err = this.checkError(status)
        if (err) return
        this.dispatch({ type: "SELECT", payload: data })
        return data
    }
    async many(promise: Promise<ApiResult<MovieListResponse>>) {
        const { status, data } = await this.updateLoadState(promise)
        const err = this.checkError(status)
        if (err || !data) return []
        const totalResults = data.movies ? data.movie_count : 0
        this.dispatch({ type: "SET", payload: data.movies })
        this.update({ totalResults })
        return data.movies
    }
}