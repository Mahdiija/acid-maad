import { tmdbService } from "@/services/tmdb";
import MovieDetails from "./MovieDetails";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await tmdbService.getMovieDetails(params.id);

  return (
    <div className="p-8">
      <MovieDetails movie={movie} />
    </div>
  );
}
