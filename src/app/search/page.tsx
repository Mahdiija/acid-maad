"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { tmdbService } from "@/services/tmdb";
import { Movie } from "@/types/tmdb";
import Image from "@/components/Image";
import Link from "next/link";

function SearchContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) {
        setMovies([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await tmdbService.searchMovies(query);
        setMovies(data.results);
      } catch (err) {
        console.error("Error searching movies:", err);
        setError("Failed to search movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Search Movies</h1>
          <p className="text-gray-400">Enter a search term to find movies.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Searching...</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for &ldquo;{query}&rdquo;
        </h1>

        {movies.length === 0 ? (
          <p className="text-gray-400">No movies found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group relative aspect-[2/3] rounded-lg overflow-hidden"
              >
                <Image
                  src={movie.poster_path}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold line-clamp-2">
                      {movie.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
