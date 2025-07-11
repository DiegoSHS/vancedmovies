import { WebTorrent } from "webtorrent";

export abstract class WebTorrentDatasource {
    abstract loadSDK(src?: string): Promise<WebTorrent>;
}