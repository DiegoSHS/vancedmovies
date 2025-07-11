import { WebTorrent } from "webtorrent";
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
}