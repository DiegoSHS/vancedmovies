import { createContext, useContext } from "react";
import { MovieProviderProps } from "./MovieProvider";
import { BaseState, defaultProviderState, ProviderState, useBaseProviderState, useBaseReducer } from "@/utils";
import { Torrent } from "../../domain/entities/Torrent";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";

// Devuelve una lista de Torrent con el mejor torrent 1080p (más seeds) o el de mayor calidad disponible (más seeds)
export function getBestQualityMagnets(torrents: Torrent[]): Torrent[] {
    if (!Array.isArray(torrents) || torrents.length === 0) return [];

    // Filtrar solo 1080p
    const torrents1080 = torrents.filter(t => t.quality.includes("1080p"));
    if (torrents1080.length > 0) {
        // Ordenar por seeds descendente y devolver el primero
        const sorted = torrents1080.sort((a, b) => b.seeds - a.seeds);
        return [sorted[0]];
    }

    // Si no hay 1080p, buscar el de mayor calidad (según orden) y más seeds
    const qualityOrder = ["2160p", "1080p", "720p", "480p", "360p"];
    // Ordenar por calidad y seeds
    const sorted = [...torrents].sort((a, b) => {
        const aIndex = qualityOrder.findIndex(q => a.quality.includes(q));
        const bIndex = qualityOrder.findIndex(q => b.quality.includes(q));
        const aQuality = aIndex === -1 ? qualityOrder.length : aIndex;
        const bQuality = bIndex === -1 ? qualityOrder.length : bIndex;
        if (aQuality !== bQuality) return aQuality - bQuality;
        return b.seeds - a.seeds;
    });
    return sorted.length > 0 ? [sorted[0]] : [];
}
interface TPBMovieContextType extends ProviderState {
    getMoreTorrents(title?: string): Promise<Torrent[]>
    cleanupState(): void
    autoSelectTorrent(magnets?: Torrent[]): Promise<Torrent | undefined>
    selectTorrent(magnet: Torrent): Promise<void>
    addTorrents(torrents: Torrent[], initial?: Torrent[]): Promise<Torrent[]>
    state: BaseState<Torrent>
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
    const { state, dispatch } = useBaseReducer<Torrent>()
    const movieDatasource = new MovieDatasourceImp()
    const movieRepository = new MovieRepositoryImp(movieDatasource)
    const addTorrents = async (torrents: Torrent[], initial: Torrent[] = []) => {
        try {
            if (!torrents.length) return []
            if (error) return []
            const merged = [...torrents, ...initial]
            const hashes = new Set<string>()
            const filtered = merged
                .filter((item) => {
                    if (!hashes.has(item.hash)) {
                        hashes.add(item.hash)
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
            const { toast } = await import('@heroui/react')
            toast.info('Buscando más torrents')
            if (!title) return []
            modifyProviderState({ loading: true, error: null })
            const torrents = await movieRepository.getMoreTorrents(title || query)
            if (!torrents.length) {
                autoSelectTorrent(state.items)
                return []
            }
            const magnets = await addTorrents(torrents, state.items)
            modifyProviderState({
                totalResults: torrents.length,
            })
            const dualMagnet = magnets.find(item => item.type.toUpperCase().includes('DUAL'))
            if (dualMagnet) {
                selectTorrent(dualMagnet)
            } else {
                autoSelectTorrent(magnets)
            }
            return torrents
        } catch (error) {
            autoSelectTorrent(state.items)
            modifyProviderState({ error: 'Error al buscar torrents' })
            return []
        } finally {
            modifyProviderState({ loading: false })
        }
    }
    const sortFunction = (prev: Torrent, next: Torrent) => {
        return next.seeds - prev.seeds
    }
    const cleanupState = () => {
        dispatch({ type: 'RESET' })
        modifyProviderState(defaultProviderState)
    }
    const autoSelectTorrent = async (magnets?: Torrent[]) => {
        const bestMagnets = getBestQualityMagnets(magnets || state.items)
        if (!bestMagnets.length) return
        dispatch({ type: 'SELECT', payload: bestMagnets[0] })
        const { toast } = await import('@heroui/react')
        toast.info('Torrent óptimo seleccionado')
        return bestMagnets[0]
    }
    const selectTorrent = async (magnet: Torrent) => {
        dispatch({ type: 'SELECT', payload: magnet })
        const { toast } = await import('@heroui/react')
        toast.info('Torrent seleccionado')
    }
    const value: TPBMovieContextType = {
        state,
        getMoreTorrents,
        cleanupState,
        autoSelectTorrent,
        selectTorrent,
        addTorrents,
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