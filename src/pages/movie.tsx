import DefaultLayout from "@/layouts/default";
import { MovieProvider } from "@/features/movie/application/providers/MovieProvider";
import { MovieDetailScreen } from "@/features/movie/application/screens/MovieDetailScreen";

export default function MovieDetailPage() {
  return (
    <DefaultLayout>
      <MovieProvider>
        <MovieDetailScreen />
      </MovieProvider>
    </DefaultLayout>
  );
}
