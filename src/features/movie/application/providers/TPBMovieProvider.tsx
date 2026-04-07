import { createContext, useContext } from "react";
import { TPBMovie } from "../../domain/entities/ThePirateBayMovie";
import { TPBMovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { TPBMovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieProviderProps } from "./MovieProvider";
import { BaseState, ProviderState, useBaseProviderState, useBaseReducer } from "@/utils";

interface TPBMovieContextType extends ProviderState {
    searchMovies(): Promise<TPBMovie[]>
    updateQuery(query: string): void
    resetQuery(): void
    state: BaseState<TPBMovie>
}

const TPBMovieContext = createContext<TPBMovieContextType | undefined>(undefined)

export const TPBMovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const {
        error,
        loading,
        query,
        totalResults,
        modifyProviderState
    } = useBaseProviderState()
    const { state, dispatch } = useBaseReducer<TPBMovie>()
    const movieDatasource = new TPBMovieDatasourceImp()
    const movieRepository = new TPBMovieRepositoryImp(movieDatasource)
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
            dispatch({ type: 'RESET' })
            modifyProviderState({ error: 'Error al buscar peliculas' })
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