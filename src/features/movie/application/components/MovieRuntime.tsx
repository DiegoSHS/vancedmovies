import { lazy } from "react";

import { TimeIcon } from "@/components/icons";
const BaseMovieChip = lazy(() => import("@/components/BaseMovieChip"));

interface MovieRuntimeProps {
  runtime?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const MovieRuntime: React.FC<MovieRuntimeProps> = ({
  runtime,
  size = "md",
  showLabel = false,
}) => {
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }

    return `${mins} min`;
  };

  const finalDisplay = runtime ? formatRuntime(runtime) : "No especificada";
  const iconSize = size === "lg" ? 20 : size === "sm" ? 14 : 16;

  return (
    <BaseMovieChip
      content={finalDisplay}
      label="Duración"
      showLabel={showLabel}
    >
      <TimeIcon size={iconSize} />
    </BaseMovieChip>
  );
};
