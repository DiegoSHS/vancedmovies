import React from "react";
import { Button } from "@heroui/react";

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
    <div className="flex justify-center items-center gap-2 my-4">
      <Button
        isIconOnly
        className="bg-primary text-white"
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        isDisabled={currentPage <= 1 || isLoading}
      >
        ←
      </Button>

      <span className="text-sm font-medium">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        isIconOnly
        className="bg-primary text-white"
        onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        isDisabled={currentPage >= totalPages || isLoading}
      >
        →
      </Button>
    </div>
  );
};
