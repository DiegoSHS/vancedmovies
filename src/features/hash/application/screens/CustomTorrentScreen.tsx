import { Button } from "@heroui/react/button";
import { lazy, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useHashActions } from "../providers/HashProvider";

import { PlusIcon } from "@/components/icons";
import { getMagnetLinkFromURL } from "@/utils/magnetGenerator";
const VideoPlayer = lazy(
  () => import("../../../movie/application/components/VideoPlayer"),
);
const MagnetInput = lazy(
  () => import("../../../movie/application/components/MagnetInput"),
);
const BackButton = lazy(() => import("@/components/BackButton"));

export const CustomTorrentScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [moviePlayerState, setMoviePlayerState] = useState({
    isInvalid: true,
    magnetLink: getMagnetLinkFromURL(searchParams) || "",
    movieTitle: "Disfruta de tu pelicula",
    hash: "",
  });
  const { addCommunityHash } = useHashActions();
  const setMagnetLink = async (magnet: string) => {
    const { extractMagnetInfo } = await import("@/utils/magnetGenerator");
    const result = await extractMagnetInfo(magnet);

    if (!result) {
      setMoviePlayerState((prev) => ({
        ...prev,
        magnetLink: magnet,
        isInvalid: true,
      }));
      return;
    }
    const { toast } = await import("@heroui/react");

    toast.success("Enlace magnet válido, cargando película...");
    setMoviePlayerState((prev) => ({
      ...prev,
      magnetLink: magnet,
      movieTitle: result.name,
      isInvalid: false,
      hash: result.hash,
    }));
  };
  const saveTorrentToCommunity = () => {
    const { movieTitle, hash } = moviePlayerState;

    addCommunityHash(movieTitle, hash);
  };

  return (
    <div className="container mx-auto flex flex-col gap-2">
      <div className="text-2xl text-center font-bold">
        Reproductor para magnets
      </div>
      <BackButton />
      <div className="flex flex-col w-full gap-2">
        <MagnetInput
          magnet={moviePlayerState.magnetLink}
          onChange={setMagnetLink}
        />
        <Button
          className="self-end"
          isDisabled={moviePlayerState.isInvalid}
          onPress={saveTorrentToCommunity}
        >
          <PlusIcon />
          Añadir a la comunidad
        </Button>
      </div>
      <VideoPlayer
        magnetLink={
          moviePlayerState.magnetLink
        }
        movieTitle={moviePlayerState.movieTitle.replace(/\./g, " ")}
      />
    </div>
  );
};
