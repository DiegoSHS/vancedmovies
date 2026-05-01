import { lazy } from "react";

import { StarIcon } from "@/components/icons";
const BaseMovieChip = lazy(() => import("@/components/BaseMovieChip"));

export const MovieRating = ({
  rating,
  size = "md",
  showLabel = false,
}: {
  rating: number;
  size?: "md" | "lg" | "sm";
  showLabel?: boolean;
}) => {
  const ratingContent = rating ? rating.toFixed(1) : "N/A";
  const iconSize = size === "lg" ? 24 : size === "sm" ? 16 : 20;
  const color = rating >= 7 ? "green" : rating >= 5 ? "amber" : "red";

  return (
    <BaseMovieChip
      content={ratingContent}
      label="Calificación"
      showLabel={showLabel}
    >
      <StarIcon className={`text-${color}-500`} size={iconSize} />
    </BaseMovieChip>
  );
};
