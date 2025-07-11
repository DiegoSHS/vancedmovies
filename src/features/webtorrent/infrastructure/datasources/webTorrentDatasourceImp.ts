import { WebTorrent } from "webtorrent";
import { WebTorrentDatasource } from "../../domain/datasources/webTorrentDatasource";

export class WebTorrentDatasourceImp extends WebTorrentDatasource {
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
                    resolve(window.WebTorrent as WebTorrent)
                }
            };
            document.head.appendChild(script);
        })
    }
}