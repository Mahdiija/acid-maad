"use client";

import { useState, useEffect } from "react";
import { tmdbService } from "@/services/tmdb";
import { TMDB_IMAGE_BASE_URL } from "@/config/tmdb";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await tmdbService.searchMovies(query);

      if (!response || !response.results) {
        throw new Error("Invalid response from server");
      }

      setMovies(response.results);
    } catch (err) {
      console.error(" Search error:", err);
      setError(err instanceof Error ? err.message : "Failed to search movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Movies</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {loading && hasSearched && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center my-8">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            {!hasSearched
              ? "Enter a search term to find movies"
              : movies.length > 0
              ? `Found ${movies.length} results for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Link
                href={`/movie/${movie.id}`}
                key={movie.id}
                className="group relative bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-movie.jpg";
                      target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                    <span>
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
