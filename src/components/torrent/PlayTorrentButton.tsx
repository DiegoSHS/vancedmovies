import { Button } from "@heroui/react/button";

import { PlayIcon } from "../icons";

import { useTorrentActions } from "@/features/movie/application/providers/MovieProvider";

const PlayTorrentButton = ({
  torrent,
  isIconOnly,
}: import(".").TorrentActionButtonProps) => {
  const { selectTorrent } = useTorrentActions();
  const handleClick = () => {
    if (!torrent) return;
    selectTorrent(torrent);
  };

  return (
    <Button
      isIconOnly={isIconOnly}
      size="sm"
      variant="ghost"
      onPress={handleClick}
    >
      <PlayIcon />
      {isIconOnly || "Ver"}
    </Button>
  );
};

export default PlayTorrentButton;
