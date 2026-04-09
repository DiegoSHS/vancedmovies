import { MovieProvider } from "./features/movie";
import { TPBMovieProvider } from "./features/movie/application/providers/TPBMovieProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      <TPBMovieProvider>
        {children}
      </TPBMovieProvider>
    </MovieProvider>
  );
}
