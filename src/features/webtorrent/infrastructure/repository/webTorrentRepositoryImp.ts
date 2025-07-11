import { BrowserServer, Instance, NodeServer, Torrent, WebTorrent } from "webtorrent";
import { WebTorrentDatasource } from "../../domain/datasources/webTorrentDatasource";
import { WebTorrentRepository } from "../../domain/repository/webTorrentRepository";

export class WebTorrentRepositoryImp extends WebTorrentRepository {
    constructor(
        private readonly datasource: WebTorrentDatasource
    ) {
        super();
    }
    async loadSDK(src?: string): Promise<WebTorrent> {
        return await this.datasource.loadSDK(src);
    }
    addTorrent(magnet: string) {
        return this.datasource.addTorrent(magnet);
    }
    getTorrent(magnet: string) {
        return this.datasource.getTorrent(magnet);
    }
    findFile(torrent: Torrent) {
        return this.datasource.findFile(torrent);
    }
    findFiles(torrent: Torrent) {
        return this.datasource.findFiles(torrent);
    }
    createServer(controller: ServiceWorkerRegistration): NodeServer | BrowserServer {
        return this.datasource.createServer(controller);
    }
    getClient(): Instance {
        return this.datasource.getClient();
    }
}