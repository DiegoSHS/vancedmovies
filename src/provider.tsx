import { Toast } from "@heroui/react/toast";

import { MovieProvider } from "./features/movie/application/providers/MovieProvider";
import { HashProvider } from "./features/hash/application/providers/HashProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      <HashProvider>
        <Toast.Provider
          aria-label="Notificacion"
          maxVisibleToasts={1}
          placement="top end"
        />
        {children}
      </HashProvider>
    </MovieProvider>
  );
}
