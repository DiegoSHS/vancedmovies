import { BaseState, useBaseReducer } from "@/utils";
import { createContext, useContext, useEffect } from "react";
import { Instance, Torrent, TorrentFile } from "webtorrent";
import { WebTorrentDatasourceImp } from "../../infrastructure/datasources/webTorrentDatasourceImp";
import { WebTorrentRepositoryImp } from "../../infrastructure/repository/webTorrentRepositoryImp";
interface WebTorrentContextType {
    loading: boolean;
    state: BaseState<Instance>;
    addOrGetTorrent: (magnetLink: string) => Torrent | undefined;
    findVideoFile: (torrent: Torrent) => TorrentFile | undefined;
}

const WebTorrentContext = createContext<WebTorrentContextType | undefined>(undefined);

interface WebTorrentProviderProps {
    children: React.ReactNode;
}

export const WebTorrentProvider: React.FC<WebTorrentProviderProps> = ({ children }) => {
    const webTorrentDatasource = new WebTorrentDatasourceImp()
    const webTorrentRepository = new WebTorrentRepositoryImp(webTorrentDatasource);
    const { state, dispatch } = useBaseReducer<Instance>()

    const addOrGetTorrent = (magnetLink: string) => {
        const torrent = webTorrentRepository.getTorrent(magnetLink)
        if (torrent) return torrent
        return webTorrentRepository.addTorrent(magnetLink)
    }

    useEffect(() => {
        return () => {
            dispatch({ type: 'RESET' });
        };
    }, []);

    return (
        <WebTorrentContext.Provider value={{
            loading: false,
            state,
            addOrGetTorrent,
            findVideoFile: webTorrentRepository.findFile
        }}>
            {children}
        </WebTorrentContext.Provider>
    )
}

export const useWebTorrentContext = () => {
    const context = useContext(WebTorrentContext);
    if (!context) {
        throw new Error("useWebTorrentContext must be used within a WebTorrentProvider");
    }
    return context;
};