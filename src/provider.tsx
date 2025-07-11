import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { MovieProvider } from "./features/movie";
import { WebTorrentProvider } from "./features/webtorrent/application/providers/webTorrentProvider";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <WebTorrentProvider>
        <MovieProvider>
          {children}
        </MovieProvider>
      </WebTorrentProvider>
    </HeroUIProvider>
  );
}
