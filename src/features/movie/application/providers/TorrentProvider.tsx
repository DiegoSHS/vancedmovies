import { generateMagnetLinks, MagnetLinkResult } from "@/types";
import { BaseState, ProviderState, useBaseProviderState, useBaseReducer } from "@/utils";
import { MovieProviderProps } from "./MovieProvider";
import { createContext, useContext } from "react";
import { Torrent } from "../../domain/entities/Torrent";

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


interface TorrentContextType extends ProviderState {
    state: BaseState<MagnetLinkResult>
    autoSelectMagnetLink(): void
    selectMagnetLink(magnetLink: MagnetLinkResult): void
    addMagnetLinks: (torrents: Torrent[], movieTitle: string) => void
    cleanMagnetLinks(): void
}

const TorrentContext = createContext<TorrentContextType | undefined>(undefined)

export const TorrentProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const {
        error,
        loading,
        query,
        totalResults,
    } = useBaseProviderState()
    const { state, dispatch } = useBaseReducer<MagnetLinkResult>()
    const sortFunction = (prev: MagnetLinkResult, next: MagnetLinkResult) => {
        return next.torrent.seeds - prev.torrent.seeds
    }
    const addMagnetLinks = (torrents: Torrent[], movieTitle: string) => {
        try {
            const { data, error } = generateMagnetLinks(torrents, movieTitle)
            if (error) return
            const merged = [...data, ...state.items]
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
        } catch (error) {
            dispatch({ type: 'RESET' })
        }
    }
    const autoSelectMagnetLink = () => {
        const bestMagnets = getBestQualityMagnets(state.items)
        if (!bestMagnets.length) return
        dispatch({ type: 'SELECT', payload: bestMagnets[0] })
    }
    const selectMagnetLink = (item: MagnetLinkResult) => {
        dispatch({ type: 'SELECT', payload: item })
    }
    const cleanMagnetLinks = () => {
        dispatch({ type: 'RESET' })
    }
    return (
        <TorrentContext.Provider value={{
            error,
            loading,
            query,
            state,
            totalResults,
            addMagnetLinks,
            autoSelectMagnetLink,
            cleanMagnetLinks,
            selectMagnetLink
        }}>
            {children}
        </TorrentContext.Provider>
    )
}

export const useTorrentContext = (): TorrentContextType => {
    const context = useContext(TorrentContext);

    if (context === undefined) {
        throw new Error("useTorrentContext must be used within a MovieProvider");
    }

    return context;
};