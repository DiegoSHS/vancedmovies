import DefaultLayout from "@/layouts/default";
import { MovieProvider } from "@/features/movie/application/providers/MovieProvider";
import { MoviesScreen } from "@/features/movie/application/screens/MoviesScreen";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <MovieProvider>
        <MoviesScreen />
      </MovieProvider>
    </DefaultLayout>
  );
}
