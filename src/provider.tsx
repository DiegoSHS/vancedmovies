import { MovieProvider } from "./features/movie";
import { TorrentProvider } from "./features/movie/application/providers/TorrentProvider";
import { TPBMovieProvider } from "./features/movie/application/providers/TPBMovieProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      <TPBMovieProvider>
        <TorrentProvider>
          {children}
        </TorrentProvider>
      </TPBMovieProvider>
    </MovieProvider>
  );
}
