import { Button } from "@heroui/react/button";

import { DownloadIcon } from "../icons";

import {
  useMovieState,
  useTorrentState,
} from "@/features/movie/application/providers/MovieProvider";

const OpenTorrentButton = ({
  torrent,
  title,
  isIconOnly = false,
}: import(".").TorrentActionButtonProps) => {
  const { state } = useMovieState();
  const { torrentState } = useTorrentState();
  const handleClick = async () => {
    const { generateMagnetLink } = await import("@/utils/magnetGenerator");
    const { data } = generateMagnetLink(
      torrent || torrentState.selectedItem,
      title || state.selectedItem?.title || "",
    );

    window.open(data, "_blank");
  };

  return (
    <Button isIconOnly={isIconOnly} variant="ghost" onPress={handleClick}>
      <DownloadIcon />
      {isIconOnly || "Abrir torrent"}
    </Button>
  );
};

export default OpenTorrentButton;
