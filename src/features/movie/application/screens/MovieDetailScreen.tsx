import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";

import { Movie } from "../../domain/entities/Movie";
import { useMovies } from "../hooks/useMovies";
import { TorrentVideoPlayer } from "../components/TorrentVideoPlayer";
import {
    generateMagnetLinks,
    copyMagnetToClipboard,
} from "../../../../utils/magnetGenerator";
import { MovieGenres } from "../components/MovieGenres";
import { MovieRating } from "../components/MovieRating";
import { MovieLanguage } from "../components/MovieLanguage";
import { MovieRuntime } from "../components/MovieRuntime";

export const MovieDetailScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getMovieById, loading, error } = useMovies();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [copiedTorrent, setCopiedTorrent] = useState<string | null>(null);
    const [showPlayer, setShowPlayer] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            if (id) {
                try {
                    const movieData = await getMovieById(parseInt(id));

                    setMovie(movieData);
                } catch {
                    // Error handled by state
                }
            }
        };

        fetchMovie();
    }, [id]);

    const handleMagnetCopy = async (magnetLink: string, quality: string) => {
        try {
            await copyMagnetToClipboard(magnetLink);
            setCopiedTorrent(quality);
            setTimeout(() => setCopiedTorrent(null), 2000);
        } catch {
            setCopiedTorrent(`error-${quality}`);
            setTimeout(() => setCopiedTorrent(null), 2000);
        }
    };

    const handleOpenTorrentApp = (magnetLink: string) => {
        window.open(magnetLink, "_blank");
    };

    const getBestQualityTorrent = () => {
        if (!movie?.torrents || !Array.isArray(movie.torrents) || movie.torrents.length === 0) {
            return null;
        }

        try {
            // Ordenar torrents por calidad (asumiendo que mayor número = mejor calidad)
            const qualityOrder = ["2160p", "1080p", "720p", "480p", "360p"];
            const sortedTorrents = [...movie.torrents].sort((a, b) => {
                const aIndex = qualityOrder.findIndex((q) => a.quality.includes(q));
                const bIndex = qualityOrder.findIndex((q) => b.quality.includes(q));

                // Si no encuentra la calidad, usar el índice más alto
                const aQuality = aIndex === -1 ? qualityOrder.length : aIndex;
                const bQuality = bIndex === -1 ? qualityOrder.length : bIndex;

                return aQuality - bQuality;
            });

            return sortedTorrents[0];
        } catch (error) {
            console.warn("Error al obtener el mejor torrent:", error);
            return null;
        }
    };

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

    let hasTorrents = false;
    const { data: magnetLinks, error: magnetError } = generateMagnetLinks(movie.torrents, movie.title);
    if (!magnetError && magnetLinks.length > 0) {
        hasTorrents = true;
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <Button color="primary" variant="ghost" onPress={() => navigate(-1)}>
                ← Volver
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="w-full max-w-sm">
                    <Image
                        alt={movie.title}
                        className="w-full h-auto object-cover"
                        src={posterUrl}
                    />
                </Card>

                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {movie.title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        {movie.year}
                    </p>
                </div>

                <div className="space-y-4">
                    <MovieRating rating={movie.rating} size="lg" />
                    <MovieRuntime runtime={movie.runtime} size="lg" showLabel={true} />
                    <MovieLanguage language={movie.language} size="lg" showLabel={true} />

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Géneros</h3>
                        <MovieGenres genres={movie.genres} />
                    </div>
                </div>
            </div>

            {showPlayer && movie && getBestQualityTorrent() && (
                <TorrentVideoPlayer
                    torrent={getBestQualityTorrent()!}
                    movieTitle={movie.title}
                    onClose={() => setShowPlayer(false)}
                />
            )}

            {!showPlayer && hasTorrents && getBestQualityTorrent() && (
                <Button
                    color="primary"
                    size="lg"
                    variant="solid"
                    onPress={() => setShowPlayer(true)}
                    startContent={<>▶</>}
                >
                    Ver película en streaming
                </Button>
            )}
            {!hasTorrents && (
                <Card className="w-full max-w-md mx-auto">
                    <CardBody className="text-center p-8">
                        <div className="text-gray-500 mb-4">
                            <h3 className="text-lg font-semibold">Sin torrents disponibles</h3>
                            <p className="text-sm mt-2">
                                No hay enlaces de descarga disponibles para esta película.
                            </p>
                        </div>
                        <Button color="primary" variant="ghost" onClick={() => navigate("/")}>
                            Explorar otras películas
                        </Button>
                    </CardBody>
                </Card>
            )}

            {hasTorrents && magnetLinks.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Descargas disponibles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {magnetLinks.map(({ torrent, magnetLink }) => (
                            <Card
                                key={torrent.hash}
                                className="hover:shadow-lg transition-shadow"
                            >
                                <CardBody className="flex gap-1">
                                    <div className="flex justify-between items-center">
                                        <Chip color="primary" size="lg" variant="flat">
                                            {torrent.quality}
                                        </Chip>
                                        <Chip color="secondary" size="sm" variant="flat">
                                            {torrent.type}
                                        </Chip>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Tamaño:
                                        </span>
                                        <span className="font-medium">{torrent.size}</span>
                                    </div>
                                </CardBody>
                                <CardFooter className="flex gap-2">
                                    <Button
                                        color={
                                            copiedTorrent === torrent.quality
                                                ? "success"
                                                : copiedTorrent === `error-${torrent.quality}`
                                                    ? "danger"
                                                    : "primary"
                                        }
                                        disabled={copiedTorrent === torrent.quality}
                                        size="sm"
                                        variant="solid"
                                        onPress={() =>
                                            handleMagnetCopy(magnetLink, torrent.quality)
                                        }
                                    >
                                        {copiedTorrent === torrent.quality
                                            ? "✓ Copiado"
                                            : copiedTorrent === `error-${torrent.quality}`
                                                ? "Error"
                                                : "Copiar enlace"}
                                    </Button>
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        variant="bordered"
                                        onPress={() => handleOpenTorrentApp(magnetLink)}
                                    >
                                        Abrir torrent
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
