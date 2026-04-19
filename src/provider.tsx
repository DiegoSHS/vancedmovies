import { Toast } from "@heroui/react";
import { TPBMovieProvider } from "./features/movie/application/providers/TPBMovieProvider";
import { MovieProvider } from "./features/movie/application/providers/MovieProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      <Toast.Provider
        placement="top end"
        aria-label="Notificacion"
        maxVisibleToasts={1}
      />
      <TPBMovieProvider>
        {children}
      </TPBMovieProvider>
    </MovieProvider>
  );
}
