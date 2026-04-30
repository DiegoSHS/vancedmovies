import { Torrent } from "@/features/movie/domain/entities/Torrent";

export function getBestQualityMagnets(torrents: Torrent[]): Torrent[] {
    if (!Array.isArray(torrents) || torrents.length === 0) return [];

    const torrents1080 = torrents.filter(t => t.quality.includes("1080p"));
    if (torrents1080.length > 0) {
        const sorted = torrents1080.sort((a, b) => b.seeds - a.seeds);
        return [sorted[0]];
    }

    const qualityOrder = ["2160p", "1080p", "720p", "480p", "360p"];
    const sorted = [...torrents].sort((a, b) => {
        const aIndex = qualityOrder.findIndex(q => a.quality.includes(q));
        const bIndex = qualityOrder.findIndex(q => b.quality.includes(q));
        const aQuality = aIndex === -1 ? qualityOrder.length : aIndex;
        const bQuality = bIndex === -1 ? qualityOrder.length : bIndex;
        if (aQuality !== bQuality) return aQuality - bQuality;
        return b.seeds - a.seeds;
    });
    return sorted.length > 0 ? [sorted[0]] : [];
}

export default getBestQualityMagnets