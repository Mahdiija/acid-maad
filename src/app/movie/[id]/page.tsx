import { tmdbService } from "@/services/tmdb";
import MovieDetails from "./MovieDetails";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const movie = await tmdbService.getMovieDetails(params.id);
  return {
    title: movie.title,
    description: movie.overview,
  };
}

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
