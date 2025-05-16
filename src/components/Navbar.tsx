"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tmdbService } from "@/services/tmdb";
import Image from "@/components/Image";

interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const data = await tmdbService.searchMovies(searchQuery);
        setSearchResults(data.results.slice(0, 5));
      } catch (error) {
        console.error("Error searching movies:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(searchMovies, 300);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  const isActive = (path: string) => pathname === path;

  const formatYear = (dateString: string) => {
    if (!dateString) return "N/A";
    const year = new Date(dateString).getFullYear();
    return isNaN(year) ? "N/A" : year;
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            The Acsid Maad
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`hover:text-red-500 transition-colors ${
                isActive("/") ? "text-red-500" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`hover:text-red-500 transition-colors ${
                isActive("/categories") ? "text-red-500" : ""
              }`}
            >
              Categories
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block relative" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search movies..."
              className="w-64 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {/* Search Results */}
            {showResults && (searchQuery || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-12 h-18 flex-shrink-0">
                          {movie.poster_path ? (
                            <Image
                              src={movie.poster_path}
                              alt={movie.title}
                              width={48}
                              height={72}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium line-clamp-1">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {formatYear(movie.release_date)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-4 space-y-4">
            <Link
              href="/"
              className={`block hover:text-red-500 transition-colors ${
                isActive("/") ? "text-red-500" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`block hover:text-red-500 transition-colors ${
                isActive("/categories") ? "text-red-500" : ""
              }`}
            >
              Categories
            </Link>

            {/* Mobile Search */}
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search movies..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* Mobile Search Results */}
              {showResults && (searchQuery || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movie/${movie.id}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
                        >
                          <div className="w-12 h-18 flex-shrink-0">
                            {movie.poster_path ? (
                              <Image
                                src={movie.poster_path}
                                alt={movie.title}
                                width={48}
                                height={72}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium line-clamp-1">
                              {movie.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {formatYear(movie.release_date)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
