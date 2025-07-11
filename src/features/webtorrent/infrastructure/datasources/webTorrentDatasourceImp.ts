import { BrowserServer, Instance, NodeServer, Torrent, TorrentFile, WebTorrent } from "webtorrent";
import { WebTorrentDatasource } from "../../domain/datasources/webTorrentDatasource";

export class WebTorrentDatasourceImp extends WebTorrentDatasource {
    constructor() {
        super()
        this.loadSDK()
    }
    private client: Instance = null as any;
    loadSDK(src: string = "https://cdn.jsdelivr.net/npm/webtorrent/webtorrent.min.js"): Promise<WebTorrent> {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = src
            script.async = true
            script.onerror = () => {
                reject("[WebTorrent] Error al cargar el SDK. Verifica la URL del script.")
            };
            script.onload = () => {
                if (window.WebTorrent) {
                    console.log("[WebTorrent] SDK cargado y window.WebTorrent disponible (UMD oficial)")
                    const WebTorrent = window.WebTorrent as WebTorrent;
                    this.client = new WebTorrent()
                    this.client.on('error', (err) => {
                        console.error("[WebTorrent] Error en el cliente:", err);
                    });
                    resolve(WebTorrent)
                }
            };
            document.head.appendChild(script);
        })
    }
    addTorrent(magnet: string): Torrent {
        return this.client.add(magnet, (torrent) => {
            console.log("[WebTorrent] Torrent añadido:", torrent.infoHash);
        });
    }
    getTorrent(magnet: string): Torrent {
        const torrent = this.client.get(magnet);
        if (!torrent) {
            throw new Error(`[WebTorrent] No se encontró el torrent con magnet: ${magnet}`);
        }
        return torrent;
    }
    findFile(torrent: Torrent): TorrentFile {
        const file = torrent.files.find((file) => isVideoFile(file.name));
        if (!file) {
            throw new Error("[WebTorrent] No se encontró un archivo de video en el torrent");
        }
        return file;
    }
    findFiles(torrent: Torrent): TorrentFile[] {
        const files = torrent.files.filter((file) => isVideoFile(file.name));
        if (files.length === 0) {
            throw new Error("[WebTorrent] No se encontraron archivos de video en el torrent");
        }
        return files;
    }
    createServer(controller: ServiceWorkerRegistration): NodeServer | BrowserServer {
        return this.client.createServer({
            controller,
        })
    }
    getClient(): Instance {
        if (!this.client) {
            throw new Error("[WebTorrent] Cliente no inicializado. Asegúrate de llamar a loadSDK primero.");
        }
        return this.client;
    }
}