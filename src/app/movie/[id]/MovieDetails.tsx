"use client";

import { MovieDetails as MovieDetailsType } from "@/types/tmdb";
import Image from "@/components/Image";
import Link from "next/link";

interface MovieDetailsProps {
  movie: MovieDetailsType;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
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
    <div className="max-w-7xl mx-auto">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={movie.backdrop_path}
          alt={movie.title}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-32 px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-64 h-96 flex-shrink-0">
            <Image
              src={movie.poster_path}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-full object-cover rounded-lg shadow-xl"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-gray-300 mb-4">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg mb-6">{movie.overview}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-gray-400">Release Date</h3>
                  <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-gray-400">Runtime</h3>
                  <p>{movie.runtime} minutes</p>
                </div>
                <div>
                  <h3 className="text-gray-400">Rating</h3>
                  <p>{movie.vote_average.toFixed(1)}/10</p>
                </div>
                <div>
                  <h3 className="text-gray-400">Status</h3>
                  <p>{movie.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
