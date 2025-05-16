"use client";

import { TMDB_IMAGE_BASE_URL } from "@/config/tmdb";
import Link from "next/link";
import { useState } from "react";

export default function MovieDetails({ movie }: { movie: any }) {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (imageKey: string) => {
    setImageError((prev) => ({ ...prev, [imageKey]: true }));
  };

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
          <Link
            href="/"
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="relative h-[60vh] min-h-[500px]">
        {!imageError.backdrop && (
          <img
            src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => handleImageError("backdrop")}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
              <span>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A"}
              </span>
              <span>{movie.runtime} min</span>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-2 py-1 bg-gray-800 rounded-full text-xs"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {!imageError.poster && (
                <img
                  src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                  onError={() => handleImageError("poster")}
                />
              )}
              {imageError.poster && (
                <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No poster available</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cast & Crew</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movie.credits.cast.slice(0, 8).map((person: any) => (
                  <div key={person.id} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden">
                      {!imageError[`cast-${person.id}`] &&
                      person.profile_path ? (
                        <img
                          src={`${TMDB_IMAGE_BASE_URL}/w185${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(`cast-${person.id}`)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{person.name}</h3>
                    <p className="text-xs text-gray-400">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Download Not Available
                  </h2>
                  <p className="text-gray-300">
                    Movie downloads are not available at this time. This website
                    is for informational purposes only.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
