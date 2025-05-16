import {
  TMDB_API_KEY,
  TMDB_ACCESS_TOKEN,
  TMDB_API_BASE_URL,
} from "@/config/tmdb";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
    }>;
  };
}

interface Genre {
  id: number;
  name: string;
}

const fetchTMDB = async (
  endpoint: string,
  params: Record<string, string | number> = {}
) => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY || "",
    ...params,
  });

  const url = `${TMDB_API_BASE_URL}${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("TMDB API request failed:", error);
    throw error;
  }
};

export const tmdbService = {
  getTrendingMovies: (page: number = 1) =>
    fetchTMDB("/trending/movie/week", { page }),

  getPopularMovies: (page: number = 1) => fetchTMDB("/movie/popular", { page }),

  getTopRatedMovies: async () => {
    console.log("⭐ Fetching top rated movies...");
    return fetchTMDB("/movie/top_rated", {
      include_adult: "false",
      include_video: "false",
    });
  },

  getUpcomingMovies: (page: number = 1) =>
    fetchTMDB("/movie/upcoming", { page }),

  getMovieDetails: (id: string) =>
    fetchTMDB(`/movie/${id}`, { append_to_response: "credits" }),

  searchMovies: (query: string, page: number = 1) =>
    fetchTMDB("/search/movie", { query, page }),

  getGenres: () => fetchTMDB("/genre/movie/list"),

  getMoviesByGenre: (genreId: string, page: number = 1) =>
    fetchTMDB("/discover/movie", { with_genres: genreId, page }),
};
