import { Torrent } from "../entities/Torrent";

export abstract class TorrentDatasource {
  abstract getMoreTorrents(title: string): Promise<Torrent[]>;
}
