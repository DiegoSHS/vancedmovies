import React from "react";
import { Pagination } from "@heroui/react";

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
    <Pagination>
      <Pagination.Summary>
        Página {currentPage} de {totalPages}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={currentPage <= 1 || isLoading}
            onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
          >
            <Pagination.PreviousIcon>
            </Pagination.PreviousIcon>
            Anterior
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next
            onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            isDisabled={currentPage >= totalPages || isLoading}
          >
            Siguiente
            <Pagination.NextIcon>
            </Pagination.NextIcon>
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>

  );
};
