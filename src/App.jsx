import { useState, useEffect, useCallback } from "react";
import Search from "./components/Search";
import Spiner from "./components/Spiner";
import MovieCard from "./components/Moviecard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = useCallback(async (query='') => {
    setIsLoading(true);
    setErrorMessages("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
        API_OPTIONS
      );
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessages("Failed to fetch movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTerm) fetchMovies();
  }, [searchTerm, fetchMovies]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero-Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassle
          </h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spiner />
          ) : errorMessages ? (
            <p className="text-red-500">{errorMessages}</p>
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          )}
        </section>
        <section>
          <h3 className="text-gradient">
            Selected Movie
          </h3>
        </section>
      </div>
    </main>
  );
};

export default App;