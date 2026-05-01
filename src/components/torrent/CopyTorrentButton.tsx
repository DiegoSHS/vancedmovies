import { Button } from "@heroui/react/button";

import { CheckIcon, CopyIcon } from "../icons";

import { useMovieState } from "@/features/movie/application/providers/MovieProvider";
import { useMagnetCopy } from "@/hooks/useMagnetCopy";

export default function CopyTorrentButton({
  torrent,
  title,
  isIconOnly = false,
}: import(".").TorrentActionButtonProps) {
  const { copied, CopyToClipboard } = useMagnetCopy();
  const { state } = useMovieState();
  const handleClick = async () => {
    const { generateMagnetLink } = await import("@/utils/magnetGenerator");
    const { toast } = await import("@heroui/react/toast");
    const { data, error } = generateMagnetLink(
      torrent,
      title || state.selectedItem?.title || "Movie name",
    );

    if (error) {
      toast.warning(error);

      return;
    }
    CopyToClipboard(data);
    toast.success("Copiado al portapapeles");
  };

  return (
    <Button
      className={`${copied ? "text-success" : ""}`}
      isDisabled={copied}
      isIconOnly={isIconOnly}
      size="sm"
      variant="ghost"
      onClick={handleClick}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {isIconOnly || "Copiar"}
    </Button>
  );
}
