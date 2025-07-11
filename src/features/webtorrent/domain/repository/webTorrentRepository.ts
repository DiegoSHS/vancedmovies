import { BrowserServer, Instance, NodeServer, Torrent, TorrentFile, WebTorrent } from "webtorrent";

export abstract class WebTorrentRepository {
    abstract loadSDK(src?: string): Promise<WebTorrent>
    abstract getClient(): Instance
    abstract addTorrent(magnet: string): Torrent
    abstract getTorrent(magnet: string): Torrent
    abstract findFile(torrent: Torrent): TorrentFile
    abstract findFiles(torrent: Torrent): TorrentFile[]
    abstract createServer(controller: ServiceWorkerRegistration): NodeServer | BrowserServer
}