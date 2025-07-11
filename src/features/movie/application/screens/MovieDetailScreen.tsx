import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { VideoPlayer } from "../components/VideoPlayer";
import {
  generateMagnetLinks,
  MagnetLinkResult,
} from "../../../../utils/magnetGenerator";
import { MovieDownloads } from "../components/MovieDownloads";
import { useMovieContext } from "../providers/MovieProvider";
import { MovieDetailsCard } from "../components/MovieDetailsCard";

// Devuelve una lista de MagnetLinkResult con el mejor torrent 1080p (más seeds) o el de mayor calidad disponible (más seeds)
function getBestQualityMagnets(torrents: MagnetLinkResult[]): MagnetLinkResult[] {
  if (!Array.isArray(torrents) || torrents.length === 0) return [];

  // Filtrar solo 1080p
  const torrents1080 = torrents.filter(t => t.torrent.quality.includes("1080p"));
  if (torrents1080.length > 0) {
    // Ordenar por seeds descendente y devolver el primero
    const sorted = [...torrents1080].sort((a, b) => b.torrent.seeds - a.torrent.seeds);
    return [sorted[0]];
  }

  // Si no hay 1080p, buscar el de mayor calidad (según orden) y más seeds
  const qualityOrder = ["2160p", "1080p", "720p", "480p", "360p"];
  // Ordenar por calidad y seeds
  const sorted = [...torrents].sort((a, b) => {
    const aIndex = qualityOrder.findIndex(q => a.torrent.quality.includes(q));
    const bIndex = qualityOrder.findIndex(q => b.torrent.quality.includes(q));
    const aQuality = aIndex === -1 ? qualityOrder.length : aIndex;
    const bQuality = bIndex === -1 ? qualityOrder.length : bIndex;
    if (aQuality !== bQuality) return aQuality - bQuality;
    return b.torrent.seeds - a.torrent.seeds;
  });
  return sorted.length > 0 ? [sorted[0]] : [];
}

export const MovieDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getMovieById,
    getMoreTorrents,
    cleanSelectedMovie,
    loading,
    error,
    state: { selectedItem: movie },
  } = useMovieContext();
  const [showPlayer, setShowPlayer] = useState(false);
  const [extraMagnets, setExtraMagnets] = useState<MagnetLinkResult[]>([]);

  useEffect(() => {
    const fetchTorrents = async () => {
      if (!movie) return
      const torrents = await getMoreTorrents(movie);
      setExtraMagnets(torrents);
    }
    fetchTorrents();
  }, [movie]);

  useEffect(() => {
    if (!id) return;
    getMovieById(parseInt(id));
    return () => {
      setExtraMagnets([]);
      setShowPlayer(false);
      cleanSelectedMovie();
    }
  }, [id]);

  if (loading || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error al cargar la película
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "No se encontró la película"}
          </p>
          <Button color="primary" onPress={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const posterUrl =
    movie.large_cover_image ||
    movie.medium_cover_image ||
    movie.small_cover_image ||
    "/placeholder-movie.jpg";

  const { data: magnetLinks, error: magnetError } = generateMagnetLinks(
    movie.torrents,
    movie.title,
  );

  const bestMagnets = getBestQualityMagnets([...magnetLinks, ...extraMagnets])

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-2 items-center">
      <Button color="primary" variant="ghost" onPress={() => navigate(-1)}>
        ← Volver
      </Button>
      <MovieDetailsCard
        posterUrl={posterUrl}
        {...movie}
      />

      {showPlayer && bestMagnets.length > 0 && (
        <VideoPlayer
          movieTitle={movie.title}
          magnetLink={bestMagnets[0].magnetLink}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {!showPlayer && !magnetError && bestMagnets.length > 0 && (
        <Button
          color="primary"
          radius="full"
          size="lg"
          startContent={
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          variant="solid"
          onPress={() => setShowPlayer(true)}
        >
          Ver Película
        </Button>
      )}
      <MovieDownloads items={[...magnetLinks, ...extraMagnets]} />
      {loading && <span className="text-xs text-gray-500">Buscando torrents adicionales...</span>}
    </div>
  );
};
