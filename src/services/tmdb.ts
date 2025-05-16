import {
  TMDB_API_KEY,
  TMDB_ACCESS_TOKEN,
  TMDB_API_BASE_URL,
  TMDB_IMAGE_BASE_URL,
  TMDB_ENDPOINTS,
} from "@/config/tmdb";
import { MovieDetails, SearchResult, Genre } from "@/types/tmdb";

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not defined");
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...Object.entries(params).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: String(value),
      }),
      {}
    ),
  });

  const response = await fetch(
    `${TMDB_API_BASE_URL}${endpoint}?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

export const tmdbService = {
  getTrendingMovies: (page: number = 1) =>
    fetchTMDB<SearchResult>(TMDB_ENDPOINTS.trending, { page }),

  getPopularMovies: (page: number = 1) =>
    fetchTMDB<SearchResult>(TMDB_ENDPOINTS.popular, { page }),

  getTopRatedMovies: (page: number = 1) =>
    fetchTMDB<SearchResult>(TMDB_ENDPOINTS.topRated, { page }),

  getUpcomingMovies: (page: number = 1) =>
    fetchTMDB<SearchResult>(TMDB_ENDPOINTS.upcoming, { page }),

  getMovieDetails: (id: string) =>
    fetchTMDB<MovieDetails>(TMDB_ENDPOINTS.movieDetails(id)),

  searchMovies: (query: string, page: number = 1) =>
    fetchTMDB<SearchResult>(TMDB_ENDPOINTS.search, { query, page }),

  getGenres: () => fetchTMDB<{ genres: Genre[] }>(TMDB_ENDPOINTS.genres),

  getMoviesByGenre: (genreId: string, page: number = 1) =>
    fetchTMDB<SearchResult>(TMDB_ENDPOINTS.moviesByGenre(genreId), { page }),

  getImageUrl: (path: string, size: string = "original") =>
    `${TMDB_IMAGE_BASE_URL}/${size}${path}`,
};
