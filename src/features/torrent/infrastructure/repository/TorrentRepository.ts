import { Torrent } from "../../domain/entities/Torrent";
import { TorrentRepository } from "../../domain/repository/TorrentRepository";
import { TorrentDatasource } from "../../domain/datasources/TorrentDatasource";

export class TorrentRepositoryImp extends TorrentRepository {
    constructor(private readonly datasource: TorrentDatasource) {
        super();
    }

    async getMoreTorrents(title: string): Promise<Torrent[]> {
        return this.datasource.getMoreTorrents(title);
    }
}
