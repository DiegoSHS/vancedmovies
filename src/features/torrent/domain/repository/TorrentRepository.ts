import { Torrent } from "../entities/Torrent";

export abstract class TorrentRepository {
    abstract getMoreTorrents(title: string): Promise<Torrent[]>;
}
