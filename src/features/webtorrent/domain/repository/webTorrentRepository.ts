import { WebTorrent } from "webtorrent";

export abstract class WebTorrentRepository {
    abstract loadSDK(src?: string): Promise<WebTorrent>;
}