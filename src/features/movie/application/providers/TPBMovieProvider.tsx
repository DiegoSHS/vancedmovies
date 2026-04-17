import { createContext, useContext } from "react";
import { MovieProviderProps } from "./MovieProvider";
import { BaseState, defaultProviderState, ProviderState, useBaseProviderState, useBaseReducer } from "@/utils";
import { generateMagnetLinks, MagnetLinkResult } from "@/types";
import { Torrent } from "../../domain/entities/Torrent";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { toast } from "@heroui/react";

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
    getMoreTorrents(title?: string): Promise<Torrent[]>
    updateQuery(query: string): void
    resetQuery(): void
    cleanMovies(): void
    autoSelectMagnetLink(): void
    selectMagnetLink(magnet: MagnetLinkResult): void
    cleanMagnetLinks(): void
    addMagnetLinks(torrents: Torrent[], movieTitle: string, initial?: MagnetLinkResult[]): MagnetLinkResult[]
    state: BaseState<MagnetLinkResult>
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
    const { state, dispatch } = useBaseReducer<MagnetLinkResult>()
    const movieDatasource = new MovieDatasourceImp()
    const movieRepository = new MovieRepositoryImp(movieDatasource)
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
            dispatch({ type: "SET", payload: sorted })
            return sorted
        } catch (error) {
            dispatch({ type: 'RESET' })
            return []
        }
    }
    const getMoreTorrents = async (title?: string) => {
        try {
            if (!title) return []
            modifyProviderState({ loading: true, error: null })
            const torrents = await movieRepository.getMoreTorrents(title || query)
            const magnets = addMagnetLinks(torrents, title, state.items)
            modifyProviderState({
                totalResults: torrents.length,
                loading: false,
            })
            const dualMagnet = magnets.find(item => item.torrent.type.toUpperCase().includes('DUAL'))
            if (dualMagnet) {
                selectMagnetLink(dualMagnet)
                toast.success('Opción en español encontrada')
            } else {
                autoSelectMagnetLink()
                toast.success('Opcion seleccionada de forma automatica')
            }
            return torrents
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
        const bestMagnets = getBestQualityMagnets(state.items)
        if (!bestMagnets.length) return
        dispatch({ type: 'SELECT', payload: bestMagnets[0] })
    }
    const selectMagnetLink = (magnet: MagnetLinkResult) => {
        dispatch({ type: 'SELECT', payload: magnet })
    }
    const cleanMagnetLinks = () => {
        dispatch({ type: 'RESET' })
    }
    const value: TPBMovieContextType = {
        state,
        getMoreTorrents,
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