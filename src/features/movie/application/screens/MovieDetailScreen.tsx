import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";

import { Movie } from "../../domain/entities/Movie";
import { useMovies } from "../hooks/useMovies";
import { TorrentVideoPlayer } from "../components/TorrentVideoPlayer";
import { HybridVideoPlayer } from "../components/HybridVideoPlayer";
import {
    generateMagnetLinks,
} from "../../../../utils/magnetGenerator";
import { MovieGenres } from "../components/MovieGenres";
import { MovieRating } from "../components/MovieRating";
import { MovieLanguage } from "../components/MovieLanguage";
import { MovieRuntime } from "../components/MovieRuntime";
import { MovieDownloads } from "../components/MovieDownloads";
import { MovieYear } from "../components/MovieYear";

export const MovieDetailScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getMovieById, loading, error } = useMovies();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showPlayer, setShowPlayer] = useState(false);
    const [showAdvancedPlayer, setShowAdvancedPlayer] = useState(false);

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

    const { data: magnetLinks, error: magnetError } = generateMagnetLinks(movie.torrents, movie.title);

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col gap-2 items-center">
            <Button color="primary" variant="ghost" onPress={() => navigate(-1)}>
                ← Volver
            </Button>

            <div className="flex flex-col sm:flex-row gap-8 justify-evenly items-start gap-2">
                <Card className="w-full max-w-sm">
                    <Image
                        alt={movie.title}
                        className="w-full h-auto object-cover"
                        src={posterUrl}
                    />
                </Card>

                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold mb-2">
                        {movie.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        <MovieYear year={movie.year} size="lg" showLabel={true} />
                        <MovieRating rating={movie.rating} size="lg" showLabel={true} />
                        <MovieRuntime runtime={movie.runtime} size="lg" showLabel={true} />
                        <MovieLanguage language={movie.language} size="lg" showLabel={true} />
                    </div>
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

            {/* Nuevo Reproductor Híbrido Avanzado */}
            {showAdvancedPlayer && movie && getBestQualityTorrent() && (
                <div className="w-full max-w-5xl">
                    <div className="mb-4 text-center">
                        <h2 className="text-2xl font-bold mb-2">🚀 Reproductor Avanzado</h2>
                        <p className="text-gray-600">
                            Múltiples opciones de streaming: WebTorrent, WebRTC, HLS y MSE
                        </p>
                    </div>
                    <HybridVideoPlayer
                        torrent={getBestQualityTorrent()!}
                        movieTitle={movie.title}
                        onClose={() => setShowAdvancedPlayer(false)}
                    />
                </div>
            )}

            {!showPlayer && !showAdvancedPlayer && !magnetError && getBestQualityTorrent() && (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Button
                        color="primary"
                        size="lg"
                        radius="full"
                        variant="solid"
                        onPress={() => setShowPlayer(true)}
                        startContent={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                            </svg>
                        }
                    >
                        Reproductor WebTorrent
                    </Button>

                    <div className="text-gray-400 text-sm">o</div>

                    <Button
                        color="secondary"
                        size="lg"
                        radius="full"
                        variant="solid"
                        onPress={() => setShowAdvancedPlayer(true)}
                        startContent={
                            <span className="text-lg">🚀</span>
                        }
                    >
                        Reproductor Avanzado
                    </Button>
                </div>
            )}

            {/* Información sobre los reproductores */}
            {!showPlayer && !showAdvancedPlayer && !magnetError && getBestQualityTorrent() && (
                <div className="w-full max-w-4xl mt-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold mb-4 text-center">🎬 Opciones de Reproducción</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                            <h4 className="font-medium text-blue-800 mb-2">🌊 WebTorrent Clásico</h4>
                            <ul className="text-sm text-blue-600 space-y-1">
                                <li>✅ Streaming P2P directo</li>
                                <li>✅ Fácil de usar</li>
                                <li>✅ Compatible con todos los navegadores</li>
                                <li>✅ Sin configuración adicional</li>
                            </ul>
                        </div>

                        <div className="text-center">
                            <h4 className="font-medium text-purple-800 mb-2">🚀 Reproductor Avanzado</h4>
                            <ul className="text-sm text-purple-600 space-y-1">
                                <li>⚡ Múltiples tecnologías de streaming</li>
                                <li>📺 HLS para calidad adaptativa</li>
                                <li>🔗 WebRTC P2P directo</li>
                                <li>🎯 MSE para control granular</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-600">
                            💡 <strong>Recomendación:</strong> Usa el reproductor clásico para una experiencia simple y rápida,
                            o el avanzado para más opciones y tecnologías modernas.
                        </p>
                    </div>
                </div>
            )}
            <MovieDownloads items={magnetLinks} />
        </div>
    );
};
