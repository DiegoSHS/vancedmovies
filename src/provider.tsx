import { Toast } from "@heroui/react/toast";

import { MovieProvider } from "./features/movie/application/providers/MovieProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      <Toast.Provider
        aria-label="Notificacion"
        maxVisibleToasts={1}
        placement="top end"
      />
      {children}
    </MovieProvider>
  );
}
