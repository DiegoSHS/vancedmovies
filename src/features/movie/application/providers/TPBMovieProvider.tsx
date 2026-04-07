import { createContext, useContext, useState } from "react";
import { TPBMovie } from "../../domain/entities/ThePirateBayMovie";
import { TPBMovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { TPBMovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieProviderProps, ProviderState } from "./MovieProvider";
import { BaseState, useBaseReducer } from "@/utils";

interface TPBMovieContextType {
    searchMovies(): Promise<TPBMovie[]>
    updateQuery(query: string): void
    resetQuery(): void
    state: BaseState<TPBMovie>
    query: string
    loading: boolean
    totalResults: number
    error: string | null
}

const TPBMovieContext = createContext<TPBMovieContextType | undefined>(undefined)

export const TPBMovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const [{ error, loading, query, totalResults }, setProviderState] = useState<ProviderState>({
        error: null,
        loading: false,
        query: '',
        totalResults: 0
    });
    const modifyProviderState = (newState: Partial<ProviderState>) => {
        setProviderState((prev) => ({
            ...prev,
            ...newState
        }))
    }
    const movieDatasource = new TPBMovieDatasourceImp()
    const movieRepository = new TPBMovieRepositoryImp(movieDatasource)
    const { state, dispatch } = useBaseReducer<TPBMovie>()
    const searchMovies = async () => {
        try {
            modifyProviderState({ loading: true, error: null })
            const movies = await movieRepository.searchMovies(query)
            console.log('Fetched movies', movies)
            dispatch({ type: 'SET', payload: movies })
            modifyProviderState({
                totalResults: movies.length,
                loading: false,
            })
            return movies
        } catch (error) {
            modifyProviderState({
                error: 'Error al buscar peliculas'
            })
            dispatch({ type: 'RESET' })
            return []
        } finally {
            modifyProviderState({ loading: false })
        }
    }
    const updateQuery = (query: string) => {
        modifyProviderState({ query })
    }
    const resetQuery = () => {
        modifyProviderState({ query: '' })
    }
    const value: TPBMovieContextType = {
        state,
        searchMovies,
        resetQuery,
        updateQuery,
        query,
        error,
        loading,
        totalResults
    }
    return (
        <TPBMovieContext.Provider value={value}>
            {children}
        </TPBMovieContext.Provider>
    )
}

export const useTPBMovieContext = (): TPBMovieContextType => {
    const context = useContext(TPBMovieContext)
    if (context === undefined) {
        throw new Error("useTPBMovieContext must be used within a TPBMovieProvider")
    }
    return context
}