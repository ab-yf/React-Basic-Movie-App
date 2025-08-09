// Import necessary hooks and components from React and other libraries.
import React, { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
// `useDebounce` is a custom hook from the 'react-use' library to delay function execution.
import { useDebounce } from "react-use";
// This function connects our app to the Appwrite backend to track search terms.
import { updateSearchCount } from "./appwrite.js";

// --- API Configuration ---
// The base URL for all The Movie Database (TMDb) API requests.
const API_BASE_URL = "https://api.themoviedb.org/3/";
// Your secret TMDb API key, securely loaded from environment variables.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// Standard options for our API requests. This includes the method (GET) and authorization headers.
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // --- State Management ---
  // `searchTerm` stores the user's input from the search bar in real-time.
  const [searchTerm, setSearchTerm] = useState("");
  // `errorMessage` stores any error message we want to display to the user.
  const [errorMessage, setErrorMessage] = useState("");
  // `movieList` stores the array of movie objects fetched from the API.
  const [movieList, setMovieList] = useState([]);
  // `isLoading` is a boolean flag to track when an API call is in progress.
  const [isLoading, setIsLoading] = useState(false);
  // `debouncedSearchTerm` stores the search term after a delay, preventing API calls on every keystroke.
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // This hook from `react-use` delays updating `debouncedSearchTerm`.
  // It waits 500ms after the user stops typing in the `searchTerm` input before updating.
  // This is crucial for performance, so we don't send an API request for every single letter typed.
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // --- Data Fetching ---
  // An asynchronous function to fetch movies from the TMDb API.
  // It takes a `query` string. If the query is empty, it fetches popular movies.
  const fetchMovies = async (query = "") => {
    // Set loading to true to show a spinner and clear any previous errors.
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Determine the API endpoint. If there's a search query, use the search endpoint.
      // Otherwise, use the discover endpoint to get popular movies.
      // `encodeURI` ensures the query is properly formatted for a URL.
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // Make the actual API call using the Fetch API.
      const response = await fetch(endpoint, API_OPTIONS);
      // If the response is not successful (e.g., 404 or 500 error), throw an error.
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      // Parse the JSON data from the response.
      const data = await response.json();

      // This check is more common for the OMDB API. For TMDb, an empty `results` array indicates no match.
      // However, it's kept here as a safeguard.
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      // Update the movieList state with the results from the API.
      // If `data.results` is undefined, default to an empty array to prevent errors.
      setMovieList(data.results || []);

      // If the search was successful (a query was made and results were found),
      // update the search count in our Appwrite database.
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      // If any error occurs in the `try` block, it's caught here.
      console.log(`Error Fetching Movies: ${error}`);
      setErrorMessage("Error fetching movies, please try again later.");
    } finally {
      // The `finally` block always runs, regardless of whether there was an error.
      // This is the perfect place to set loading back to false.
      setIsLoading(false);
    }
  };

  // --- Effects ---
  // The `useEffect` hook runs side effects in functional components.
  // This one runs the `fetchMovies` function whenever `debouncedSearchTerm` changes.
  // This connects our debounced input to the API fetching logic.
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // --- JSX Rendering ---
  // This is what the component will render to the DOM.
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without Any Hassle
          </h1>
          {/* The Search component is rendered here, passing down the current search term and the function to update it. */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {/* Conditional rendering logic for the movie list area. */}
          {isLoading ? (
            // If `isLoading` is true, show the Spinner component.
            <Spinner />
          ) : errorMessage ? (
            // If there's an error message, display it.
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            // Otherwise, if not loading and no errors, display the list of movies.
            <ul>
              {/* Map over the `movieList` array. For each movie, render a `MovieCard` component. */}
              {/* The `key` prop is essential for React to efficiently update the list. */}
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};
export default App;
