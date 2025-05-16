"use client";

import { useEffect, useState, Suspense } from "react";
import { tmdbService } from "@/services/tmdb";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "@/components/Image";
import { Movie } from "@/types/tmdb";

interface Genre {
  id: number;
  name: string;
}

function CategoriesContent() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedGenre = searchParams.get("genre");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbService.getGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = selectedGenre
          ? await tmdbService.getMoviesByGenre(selectedGenre, currentPage)
          : await tmdbService.getPopularMovies(currentPage);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB API limits to 500 pages
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, currentPage]);

  const handleGenreClick = (genreId: number) => {
    setCurrentPage(1);
    router.push(`/categories?genre=${genreId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>

        {/* Genre Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => {
              setCurrentPage(1);
              router.push("/categories");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedGenre
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === genre.id.toString()
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
              {movies.map((movie) => (
                <div
                  key={movie.id}
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
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-red-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}
