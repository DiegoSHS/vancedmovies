import { Button } from "@heroui/react/button";
import { lazy, useEffect, useState } from "react";

import { useMovieState, useMovieActions } from "../providers/MovieProvider";

import { PlusIcon } from "@/components/icons";
const MovieCommunityModal = lazy(
  () => import("../components/MovieCommunityAdd"),
);
const BackButton = lazy(() => import("@/components/BackButton"));
const CommunityTorrentsTable = lazy(
  () => import("../components/CommunityTorrentsTable"),
);

export const CommunityTorrentsScreen = () => {
  const { status } = useMovieState();
  const { getCommunityHashes } = useMovieActions();
  const [torrentHashes, setTorrentHashes] = useState<
    import("../../domain/entities/Hashes").HashResult[]
  >([]);
  const [open, setOpen] = useState(false);

  const effect = () => {
    const fetchHashes = async () => {
      const hashes = await getCommunityHashes();

      setTorrentHashes(hashes);
    };

    fetchHashes();
  };

  useEffect(effect, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl text-center font-bold">
        Torrents traidos por la comunidad
      </div>
      <div className="flex items-center justify-between">
        <BackButton />
        <MovieCommunityModal
          isOpen={open}
          setHashes={setTorrentHashes}
          onOpenChange={setOpen}
        />
        <Button variant="tertiary" onPress={() => setOpen(true)}>
          <PlusIcon />
          Añadir nuevo
        </Button>
      </div>
      <CommunityTorrentsTable
        items={torrentHashes}
        loading={status === "loading"}
      />
    </div>
  );
};
