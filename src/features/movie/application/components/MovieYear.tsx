import { lazy } from "react";

import { CalendarIcon } from "@/components/icons";
const BaseMovieChip = lazy(() => import("@/components/BaseMovieChip"));

export const MovieYear = ({
  year,
  size,
  showLabel = false,
}: {
  year: number;
  size: "lg" | "md" | "sm";
  showLabel?: boolean;
}) => {
  const iconSize = size === "lg" ? 24 : size === "sm" ? 16 : 20;

  return (
    <BaseMovieChip content={year} label="Año" showLabel={showLabel}>
      <CalendarIcon size={iconSize} />
    </BaseMovieChip>
  );
};
