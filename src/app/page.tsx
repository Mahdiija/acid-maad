"use client";

import { useEffect, useState } from "react";
import { tmdbService } from "@/services/tmdb";
import { Movie } from "@/types/tmdb";
import Image from "@/components/Image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const swiperStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    color: #ef4444 !important;
    background: rgba(0, 0, 0, 0.5);
    width: 40px !important;
    height: 40px !important;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 20px !important;
  }

  .swiper-button-disabled {
    opacity: 0.35 !important;
    cursor: auto;
    pointer-events: none;
  }

  .swiper-pagination-bullet {
    background: #ef4444 !important;
    opacity: 0.5;
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
    width: 20px !important;
    border-radius: 10px !important;
  }
`;

interface MovieSection {
  title: string;
  movies: Movie[];
}

export default function Home() {
  const [sections, setSections] = useState<MovieSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular, topRated] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getPopularMovies(),
          tmdbService.getTopRatedMovies(),
        ]);

        setSections([
          {
            title: "Trending Now",
            movies: trending.results,
          },
          {
            title: "Popular Movies",
            movies: popular.results,
          },
          {
            title: "Top Rated",
            movies: topRated.results,
          },
        ]);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <style jsx global>
        {swiperStyles}
      </style>
      <div className="container mx-auto px-4 py-8">
        {sections.map((section) => (
          <div key={section.title} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
                1280: {
                  slidesPerView: 5,
                },
              }}
              className="!pb-12"
            >
              {section.movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <Link
                    href={`/movie/${movie.id}`}
                    className="group relative aspect-[2/3] rounded-lg overflow-hidden block"
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
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </div>
  );
}
