import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";

import { Movie } from "../../domain/entities/Movie";
import { VideoPlayer } from "../components/VideoPlayer";
import {
    generateMagnetLinks,
} from "../../../../utils/magnetGenerator";
import { MovieGenres } from "../components/MovieGenres";
import { MovieRating } from "../components/MovieRating";
import { MovieLanguage } from "../components/MovieLanguage";
import { MovieRuntime } from "../components/MovieRuntime";
import { MovieDownloads } from "../components/MovieDownloads";
import { MovieYear } from "../components/MovieYear";
import { Torrent } from "../../domain/entities/Torrent";
import { useMovieContext } from "../providers/MovieProvider";

const getBestQualityTorrent = (movie: Movie): {
    data: Torrent | null;
    error: string | null;
} => {
    if (!movie?.torrents || !Array.isArray(movie.torrents) || movie.torrents.length === 0) return {
        data: null,
        error: "No se encontraron torrents disponibles"
    }
    try {
        const qualityOrder = ["2160p", "1080p", "720p", "480p", "360p"];
        const sortedTorrents = movie.torrents.sort((a, b) => {
            const aIndex = qualityOrder.findIndex((q) => a.quality.includes(q));
            const bIndex = qualityOrder.findIndex((q) => b.quality.includes(q));

            const aQuality = aIndex === -1 ? qualityOrder.length : aIndex;
            const bQuality = bIndex === -1 ? qualityOrder.length : bIndex;

            return aQuality - bQuality;
        });

        return {
            data: sortedTorrents[0],
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: "Error al obtener el torrent de mejor calidad"
        }
    }
}

export const MovieDetailScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getMovieById, loading, error, state: { selectedItem: movie } } = useMovieContext()
    const [showPlayer, setShowPlayer] = useState(false);

    useEffect(() => {
        getMovieById(parseInt(id!));
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

    const { data: magnetLinks, error: magnetError } = generateMagnetLinks(movie.torrents, movie.title);
    const { data: bestQuality, error: _ } = getBestQualityTorrent(movie)
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

            {showPlayer && bestQuality !== null && (
                <div className="w-full max-w-5xl">
                    <div className="mb-4 text-center">
                        <h2 className="text-2xl font-bold mb-2">🎬 Reproductor de Video</h2>
                    </div>
                    <VideoPlayer
                        torrent={bestQuality}
                        movieTitle={movie.title}
                        onClose={() => setShowPlayer(false)}
                    />
                </div>
            )}

            {!showPlayer && !magnetError && bestQuality && (
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
                    Ver Película
                </Button>
            )}
            <MovieDownloads items={magnetLinks} />
        </div >
    );
};
