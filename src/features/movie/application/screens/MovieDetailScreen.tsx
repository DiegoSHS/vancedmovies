import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Link, Spinner } from "@heroui/react";

import { VideoPlayer } from "../components/VideoPlayer";
import {
  generateMagnetLinks,
  MagnetLinkResult,
} from "../../../../utils/magnetGenerator";
import { MovieDownloads, ViewModeSwitch } from "../components/MovieDownloads";
import { useMovieContext } from "../providers/MovieProvider";
import { MovieDetailsCard } from "../components/MovieDetailsCard";
import { useTPBMovieContext } from "../providers/TPBMovieProvider";
import { TPBtoTorrent } from "../../domain/entities/Torrent";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  const { item: viewMode, setItem } = useLocalStorage('viewMode', 'card')
  const swapViewMode = () => {
    if (viewMode === 'table') {
      setItem('card')
    } else {
      setItem('table')
    }
  }
  const {
    getMovieById,
    cleanSelectedMovie,
    loading,
    error,
    state: { selectedItem: movie },
  } = useMovieContext();
  const {
    loading: loadingExtra,
    searchMovies,
    updateQuery,
  } = useTPBMovieContext()
  const [showPlayer, setShowPlayer] = useState(false);
  const [extraMagnets, setExtraMagnets] = useState<MagnetLinkResult[]>([]);

  useEffect(() => {
    const fetchTorrents = async () => {
      if (!movie?.title) return
      updateQuery(movie.title)
      const movies = await searchMovies()
      console.log('Fetched', movies)
      const torrents = movies.map(TPBtoTorrent)
      console.log('Added torrents', torrents)
      const { data } = generateMagnetLinks(torrents, movie.title)
      console.log('Generated magnets', data)
      setExtraMagnets(data);
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
        <Spinner className="w-12 h-12" />
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
          <Link href="/page/1" className='no-underline'>
            <Button className="bg-blue-600 text-white px-4 py-2 rounded">
              Volver al inicio
            </Button>
          </Link>
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
      <Link href="/page/1" className="no-underline">
        <Button size="sm" variant="ghost">
          ← Volver
        </Button>
      </Link>
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
          size="lg"
          className="px-4 py-2 flex items-center gap-2"
          onPress={() => setShowPlayer(true)}
        >
          <svg
            className="h-6 w-6"
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
          Ver Película
        </Button>
      )}
      <div className="flex w-full items-center justify-end">
        <ViewModeSwitch mode={viewMode} swapViewMode={swapViewMode} />
      </div>
      <MovieDownloads items={magnetLinks.sort((prev, next) => next.torrent.seeds - prev.torrent.seeds)} mode={viewMode} />
      Descargas extra
      {
        loadingExtra && (
          <div className="flex items-center gap-2 mt-4">
            <Spinner className="w-4 h-4" />
            <span className="text-xs text-gray-500">Buscando torrents adicionales...</span>
          </div>
        )
      }
      <MovieDownloads items={extraMagnets.sort((prev, next) => next.torrent.seeds - prev.torrent.seeds)} mode={viewMode} />
    </div>
  );
};
