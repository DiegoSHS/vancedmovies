import { BaseState, useBaseReducer } from "@/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { Instance, Torrent, TorrentFile } from "webtorrent";
import { WebTorrentDatasourceImp } from "../../infrastructure/datasources/webTorrentDatasourceImp";
import { WebTorrentRepositoryImp } from "../../infrastructure/repository/webTorrentRepositoryImp";

const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return
    try {
        const registration = await navigator.serviceWorker.register('/sw.min.js', { scope: './' });
        console.log("[WebTorrent] Service Worker registrado:", registration);
        return registration;
    } catch (error) {
        console.error("[WebTorrent] Error al registrar el Service Worker:", error);
    }
}

const removeServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return
    try {
        const registration = await navigator.serviceWorker.getRegistration('./sw.min.js');
        if (registration) {
            await registration.unregister();
            console.log("[WebTorrent] Service Worker eliminado");
        } else {
            console.warn("[WebTorrent] No se encontró el Service Worker para eliminar");
        }
    } catch (error) {
        console.error("[WebTorrent] Error al eliminar el Service Worker:", error);
    }
}

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

interface WebTorrentState {
    loading: boolean;
    serviceWorker: ServiceWorker | null;
}

export const WebTorrentProvider: React.FC<WebTorrentProviderProps> = ({ children }) => {
    const webTorrentDatasource = new WebTorrentDatasourceImp()
    const webTorrentRepository = new WebTorrentRepositoryImp(webTorrentDatasource);
    const { state, dispatch } = useBaseReducer<Instance>()

    const [webTorrentState, setWebTorrentState] = useState<WebTorrentState>({
        loading: false,
        serviceWorker: null,
    });
    const updateWebTorrentState = (newState: Partial<WebTorrentState>) => {
        setWebTorrentState((prev) => ({
            ...prev,
            ...newState,
        }));
    }
    // Cambiar setupClient a async y esperar a que el SDK esté listo
    const setupClient = async () => {
        try {
            // Esperar a que el SDK esté cargado y el cliente inicializado
            await webTorrentDatasource.loadSDK();
            const client = webTorrentRepository.getClient();
            console.log("[WebTorrent] Cliente WebTorrent configurado:", client);
            dispatch({ type: 'SELECT', payload: client });
        } catch (error) {
            console.error("[WebTorrent] Error al inicializar el cliente:", error);
        }
    }
    const loadServiceWorker = async () => {
        try {
            updateWebTorrentState({ loading: true });
            const registration = await registerServiceWorker();
            if (registration) {
                updateWebTorrentState({ serviceWorker: registration.installing });
                console.log("[WebTorrent] Service Worker registrado correctamente");
                webTorrentRepository.createServer(registration);
                console.log("[WebTorrent] Servidor WebTorrent creado con el Service Worker");
            } else {
                console.warn("[WebTorrent] No se pudo registrar el Service Worker");
            }
        } catch (error) {
            updateWebTorrentState({ serviceWorker: null });
        } finally {
            updateWebTorrentState({ loading: false });
        }
    }

    const addOrGetTorrent = (magnetLink: string) => {
        const torrent = webTorrentRepository.getTorrent(magnetLink)
        if (torrent) return torrent
        return webTorrentRepository.addTorrent(magnetLink)
    }

    useEffect(() => {
        loadServiceWorker();
        setupClient();
        return () => {
            dispatch({ type: 'RESET' });
            removeServiceWorker();
        };
    }, []);

    return (
        <WebTorrentContext.Provider value={{
            loading: webTorrentState.loading,
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