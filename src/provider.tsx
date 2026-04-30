import { Toast } from "@heroui/react/toast";
import { MovieProvider } from "./features/movie/application/providers/MovieProvider";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      <Toast.Provider
        placement="top end"
        aria-label="Notificacion"
        maxVisibleToasts={1}
      />
      {children}
    </MovieProvider>
  );
}
