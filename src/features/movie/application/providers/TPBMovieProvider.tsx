import { createContext, useContext } from "react";
import { TPBMovie } from "../../domain/entities/ThePirateBayMovie";
import { TPBMovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { TPBMovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieProviderProps } from "./MovieProvider";
import { BaseState, defaultProviderState, ProviderState, useBaseProviderState, useBaseReducer } from "@/utils";
import { generateMagnetLinks, MagnetLinkResult } from "@/types";
import { Torrent, TPBtoTorrent } from "../../domain/entities/Torrent";

// Devuelve una lista de MagnetLinkResult con el mejor torrent 1080p (más seeds) o el de mayor calidad disponible (más seeds)
export function getBestQualityMagnets(torrents: MagnetLinkResult[]): MagnetLinkResult[] {
    if (!Array.isArray(torrents) || torrents.length === 0) return [];

    // Filtrar solo 1080p
    const torrents1080 = torrents.filter(t => t.torrent.quality.includes("1080p"));
    if (torrents1080.length > 0) {
        // Ordenar por seeds descendente y devolver el primero
        const sorted = [...torrents1080].sort((a, b) => b.torrent.seeds - a.torrent.seeds);
        return [sorted[0]];
    }

    // Si no hay 1080p, buscar el de mayor calidad (según orden) y más seeds
    const qualityOrder = ["2160p", "1080p", "720p", "480p", "360p"];
    // Ordenar por calidad y seeds
    const sorted = [...torrents].sort((a, b) => {
        const aIndex = qualityOrder.findIndex(q => a.torrent.quality.includes(q));
        const bIndex = qualityOrder.findIndex(q => b.torrent.quality.includes(q));
        const aQuality = aIndex === -1 ? qualityOrder.length : aIndex;
        const bQuality = bIndex === -1 ? qualityOrder.length : bIndex;
        if (aQuality !== bQuality) return aQuality - bQuality;
        return b.torrent.seeds - a.torrent.seeds;
    });
    return sorted.length > 0 ? [sorted[0]] : [];
}
interface TPBMovieContextType extends ProviderState {
    searchMovies(title?: string): Promise<TPBMovie[]>
    updateQuery(query: string): void
    resetQuery(): void
    cleanMovies(): void
    autoSelectMagnetLink(): void
    selectMagnetLink(magnet: MagnetLinkResult): void
    cleanMagnetLinks(): void
    addMagnetLinks(torrents: Torrent[], movieTitle: string, initial?: MagnetLinkResult[]): MagnetLinkResult[]
    state: BaseState<TPBMovie>
    magnetState: BaseState<MagnetLinkResult>
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
    const { state: magnetState, dispatch: magnetDispatch } = useBaseReducer<MagnetLinkResult>()
    const movieDatasource = new TPBMovieDatasourceImp()
    const movieRepository = new TPBMovieRepositoryImp(movieDatasource)
    const addMagnetLinks = (torrents: Torrent[], movieTitle: string, initial: MagnetLinkResult[] = []) => {
        try {
            const { data, error } = generateMagnetLinks(torrents, movieTitle)
            if (error) return []
            const merged = [...data, ...initial]
            const hashes = new Set<string>()
            const filtered = merged.filter((item) => {
                if (!hashes.has(item.torrent.hash)) {
                    hashes.add(item.torrent.hash)
                    return true
                }
                return false
            })
            const sorted = filtered.sort(sortFunction)
            magnetDispatch({ type: "SET", payload: sorted })
            return sorted
        } catch (error) {
            magnetDispatch({ type: 'RESET' })
            return []
        }
    }
    const searchMovies = async (title?: string) => {
        try {
            if (!title) return []
            modifyProviderState({ loading: true, error: null })
            const movies = await movieRepository.searchMovies(title || query)
            dispatch({ type: 'SET', payload: movies })
            const torrents = movies.map(TPBtoTorrent)
            addMagnetLinks(torrents, title, magnetState.items)
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
    const sortFunction = (prev: MagnetLinkResult, next: MagnetLinkResult) => {
        return next.torrent.seeds - prev.torrent.seeds
    }
    const cleanMovies = () => {
        dispatch({ type: 'RESET' })
        modifyProviderState(defaultProviderState)
    }
    const updateQuery = (query: string) => {
        modifyProviderState({ query })
    }
    const resetQuery = () => {
        modifyProviderState({ query: '' })
    }
    const autoSelectMagnetLink = () => {
        const bestMagnets = getBestQualityMagnets(magnetState.items)
        if (!bestMagnets.length) return
        magnetDispatch({ type: 'SELECT', payload: bestMagnets[0] })
    }
    const selectMagnetLink = (magnet: MagnetLinkResult) => {
        magnetDispatch({ type: 'SELECT', payload: magnet })
    }
    const cleanMagnetLinks = () => {
        magnetDispatch({ type: 'RESET' })
    }
    const value: TPBMovieContextType = {
        state,
        magnetState,
        searchMovies,
        resetQuery,
        updateQuery,
        cleanMovies,
        autoSelectMagnetLink,
        selectMagnetLink,
        cleanMagnetLinks,
        addMagnetLinks,
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