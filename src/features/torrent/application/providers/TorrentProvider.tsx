import { createContext, useContext, useMemo, useCallback } from "react";

import { TorrentRepositoryImp } from "../../infrastructure/repository/TorrentRepository";
import { TorrentDatasourceImp } from "../../infrastructure/datasources/TorrentDatasource";
import { Torrent } from "../../domain/entities/Torrent";

import {
    BaseState,
    useBaseReducer,
} from "@/utils/baseProvider";

interface TorrentStateContextType {
    torrentState: BaseState<Torrent>;
}

interface TorrentActionsContextType {
    getMoreTorrents: (title: string, initial?: Torrent[]) => Promise<Torrent[]>;
    addTorrents: (torrents: Torrent[], initial?: Torrent[]) => Promise<Torrent[]>;
    selectTorrent: (magnet: Torrent) => Promise<void>;
    autoSelectTorrent: (magnets?: Torrent[]) => Promise<void>;
    cleanTorrent: () => void;
}

// Contextos separados
const TorrentStateContext = createContext<TorrentStateContextType | undefined>(
    undefined,
);
const TorrentActionsContext = createContext<
    TorrentActionsContextType | undefined
>(undefined);

// Providers para los contextos
export const TorrentStateProvider: React.FC<{
    children: React.ReactNode;
    value: TorrentStateContextType;
}> = ({ children, value }) => (
    <TorrentStateContext.Provider value={value}>
        {children}
    </TorrentStateContext.Provider>
);

export const TorrentActionsProvider: React.FC<{
    children: React.ReactNode;
    value: TorrentActionsContextType;
}> = ({ children, value }) => (
    <TorrentActionsContext.Provider value={value}>
        {children}
    </TorrentActionsContext.Provider>
);

// Hooks para consumir los contextos
export const useTorrentState = (): TorrentStateContextType => {
    const context = useContext(TorrentStateContext);

    if (!context)
        throw new Error("useTorrentState must be used within TorrentStateProvider");

    return context;
};

export const useTorrentActions = (): TorrentActionsContextType => {
    const context = useContext(TorrentActionsContext);

    if (!context)
        throw new Error(
            "useTorrentActions must be used within TorrentActionsProvider",
        );

    return context;
};

export const TorrentProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { state: torrentState, dispatch: torrentDispatch } =
        useBaseReducer<Torrent>();
    const torrentDatasource = new TorrentDatasourceImp();
    const torrentRepository = new TorrentRepositoryImp(torrentDatasource);

    const selectTorrent = useCallback(
        async (magnet: Torrent) => {
            torrentDispatch({ type: "SELECT", payload: magnet });
            const { toast } = await import("@heroui/react");

            toast.info("Torrent seleccionado");
        },
        [torrentDispatch],
    );

    const cleanTorrent = useCallback(() => {
        torrentDispatch({ type: "SELECT", payload: undefined });
    }, [torrentDispatch]);

    const autoSelectTorrent = useCallback(
        async (magnets: Torrent[] = torrentState.items) => {
            const { getBestQualityMagnets } = await import("@/utils/magnet/filter");
            const bestMagnets = getBestQualityMagnets(magnets);

            if (!bestMagnets.length) return;
            selectTorrent(bestMagnets[0]);
        },
        [torrentState.items, selectTorrent],
    );

    const addTorrents = useCallback(
        async (torrents: Torrent[], initial: Torrent[] = []) => {
            const merged = [...torrents, ...initial];

            if (!merged.length) return [];
            const { filterUniqueTorrents } = await import("@/utils/torrent");
            const filtered = filterUniqueTorrents(merged);
            const sorted = filtered.sort((p, n) => n.seeds - p.seeds);

            torrentDispatch({ type: "SET", payload: sorted });

            return sorted;
        },
        [torrentDispatch],
    );

    const getMoreTorrents = useCallback(
        async (title: string, initial?: Torrent[]) => {
            try {
                const data = await torrentRepository.getMoreTorrents(title);
                const magnets = await addTorrents(data, initial);
                const dualMagnet = magnets.find((item) =>
                    item.type ? item.type.toUpperCase().includes("DUAL") : false,
                );

                if (dualMagnet) {
                    await selectTorrent(dualMagnet);
                } else {
                    await autoSelectTorrent(magnets);
                }

                return magnets;
            } catch (error) {
                console.error("Error getting more torrents:", error);
                return [];
            }
        },
        [torrentRepository, addTorrents, selectTorrent, autoSelectTorrent],
    );

    const torrentStateValue = useMemo(
        () => ({
            torrentState,
        }),
        [torrentState],
    );

    const torrentActionsValue = useMemo(
        () => ({
            getMoreTorrents,
            addTorrents,
            selectTorrent,
            autoSelectTorrent,
            cleanTorrent,
        }),
        [
            getMoreTorrents,
            addTorrents,
            selectTorrent,
            autoSelectTorrent,
            cleanTorrent,
        ],
    );

    return (
        <TorrentStateProvider value={torrentStateValue}>
            <TorrentActionsProvider value={torrentActionsValue}>
                {children}
            </TorrentActionsProvider>
        </TorrentStateProvider>
    );
};
