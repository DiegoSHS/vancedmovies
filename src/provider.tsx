import { MovieProvider } from "./features/movie";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MovieProvider>
      {children}
    </MovieProvider>
  );
}
