import { MovieProvider } from "./features/movie";
import { WebTorrentProvider } from "./features/webtorrent/application/providers/webTorrentProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WebTorrentProvider>
      <MovieProvider>
        {children}
      </MovieProvider>
    </WebTorrentProvider>
  );
}
