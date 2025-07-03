import React from "react";
import { Pagination } from "@heroui/pagination";

interface MoviePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const MoviePagination: React.FC<MoviePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Pagination
        isCompact
        showControls
        color="primary"
        isDisabled={isLoading}
        page={currentPage || 1}
        total={totalPages || 1}
        onChange={onPageChange}
      />
    </div>
  );
};
