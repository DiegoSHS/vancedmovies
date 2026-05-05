import { TorrentDatasource } from "../../domain/datasources/TorrentDatasource";
import { Torrent } from "../../domain/entities/Torrent";

export class TorrentDatasourceImp extends TorrentDatasource {
    async getMoreTorrents(query: string): Promise<Torrent[]> {
        try {
            const { ApiClient } = await import("@/utils/ApiClient");

            if (!Boolean(query)) return [];
            const url = `${import.meta.env.VITE_NEST_BACKEND_URL}/tpb_search?title=${encodeURIComponent(query)}`;
            const result = await ApiClient.get<Torrent[]>({
                path: url,
                overrideBaseURL: true,
            });

            if (result.error !== null) return [];

            return result.data;
        } catch (_) {
            return [];
        }
    }
}
