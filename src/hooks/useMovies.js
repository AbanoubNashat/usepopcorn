import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
const APIKey = "890190d";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    // it's more like an event now when typing in the search box so we can attach it like with direct DOM manipulation.
    // useEffect can't return a promise so we defined our async function first then called it inside the effect.
    // we make the controller here to stop every new request till the one we actually want we provide it with the header object in fetch then return it with the cleanup function in the
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${APIKey}&s=${query}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Something went wrong with fetching movies");
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error("Wrong Search Value");
        }
        setMovies(data.Search);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 2) {
      setMovies([]);
      setErrorMessage("");
      return;
    }
    // we called the function to actually work as we just defined the async function then we called it to actually do the work
    fetchMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, errorMessage };
}
