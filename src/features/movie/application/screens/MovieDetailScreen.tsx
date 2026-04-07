import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Link, Spinner } from "@heroui/react";
import { VideoPlayer } from "../components/VideoPlayer";
import { MovieDownloads, ViewModeSwitch } from "../components/MovieDownloads";
import { useMovieContext } from "../providers/MovieProvider";
import { MovieDetailsCard } from "../components/MovieDetailsCard";
import { useTPBMovieContext } from "../providers/TPBMovieProvider";
import { TPBtoTorrent } from "../../domain/entities/Torrent";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PlayIcon } from "@/components/icons";
import { useTorrentContext } from "../providers/TorrentProvider";

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
  const {
    addMagnetLinks,
    autoSelectMagnetLink,
    cleanMagnetLinks,
    state: { selectedItem: selectedMagnet, items: magnets }
  } = useTorrentContext()
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const fetchTorrents = async () => {
      if (!movie?.title) return
      addMagnetLinks(movie.torrents, movie.title)
      updateQuery(movie.title)
      const movies = await searchMovies()
      console.log('Fetched', movies)
      const torrents = movies.map(TPBtoTorrent)
      addMagnetLinks(torrents, movie.title)
      autoSelectMagnetLink()
    }
    fetchTorrents();
  }, [movie]);

  useEffect(() => {
    if (!id) return;
    getMovieById(parseInt(id))
    return () => {
      setShowPlayer(false)
      cleanMagnetLinks()
      cleanSelectedMovie()
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

      {(showPlayer && magnets.length > 0 && selectedMagnet) && (
        <VideoPlayer
          movieTitle={movie.title}
          magnetLink={selectedMagnet.magnetLink}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {!showPlayer && magnets.length > 0 && (
        <Button
          size="lg"
          className="px-4 py-2 flex items-center gap-2"
          onPress={() => setShowPlayer(false)}
        >
          <PlayIcon />
          Ver Película
        </Button>
      )}
      <div className="flex w-full items-center justify-end">
        <ViewModeSwitch mode={viewMode} swapViewMode={swapViewMode} />
      </div>
      <MovieDownloads items={magnets} mode={viewMode} />
      Descargas extra
      {
        loadingExtra && (
          <div className="flex items-center gap-2 mt-4">
            <Spinner className="w-4 h-4" />
            <span className="text-xs text-gray-500">Buscando torrents adicionales...</span>
          </div>
        )
      }
    </div>
  );
};
