export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_ENDPOINTS = {
  trending: "/trending/movie/week",
  popular: "/movie/popular",
  topRated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
  movieDetails: (id: string) => `/movie/${id}`,
  search: "/search/movie",
  genres: "/genre/movie/list",
  moviesByGenre: (genreId: string) => `/discover/movie?with_genres=${genreId}`,
};
