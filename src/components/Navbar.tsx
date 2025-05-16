"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tmdbService } from "@/services/tmdb";
import { TMDB_IMAGE_BASE_URL } from "@/config/tmdb";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await tmdbService.searchMovies(query);
        setSuggestions(data.results.slice(0, 5));
      } catch (error) {
        console.error("Error searching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchMovies, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setQuery("");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            The Acsid Maad
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors ${
                pathname === "/categories"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Categories
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search movies..."
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                </div>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {suggestions.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      onClick={handleSuggestionClick}
                      className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={`${TMDB_IMAGE_BASE_URL}/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-white">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "N/A"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-[500px] opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-4 space-y-4">
            <Link
              href="/"
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-red-500"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                pathname === "/categories"
                  ? "text-red-500"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <div className="px-4 relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Search movies..."
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                  </div>
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="fixed md:absolute left-4 right-4 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-[100]">
                    {suggestions.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        onClick={() => {
                          handleSuggestionClick();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={`${TMDB_IMAGE_BASE_URL}/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-white">
                            {movie.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {movie.release_date
                              ? new Date(movie.release_date).getFullYear()
                              : "N/A"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
