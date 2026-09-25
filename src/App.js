import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import SearchBar from "./components/SearchBar";
import NumResults from "./components/NumResults";
import Box from "./components/Box";
import MoviesList from "./components/MoviesList";
import Summary from "./components/Summary";
import WatchedMoviesList from "./components/WatchedMoviesList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import MovieDetails from "./components/MovieDetails";

const APIKey = "890190d";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedId, setSelectedID] = useState(null);
  // const tempQuery = "interstellar";

  function handleSelectedId(id) {
    setSelectedID((selectedId) => (selectedId === id ? null : id));
  }
  function handleBackOnClick() {
    setSelectedID(null);
  }

  function handleOnAddWatchedMovie(newMovie) {
    setWatched((watched) => [...watched, newMovie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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

  return (
    <>
      <NavBar>
        <SearchBar query={query} setQuery={setQuery}></SearchBar>
        <NumResults movies={movies}></NumResults>
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? (
            <Loader></Loader>
          ) : (
            <MoviesList movies={movies}></MoviesList>
          )} */}
          {isLoading && <Loader></Loader>}
          {!isLoading && !errorMessage && (
            <MoviesList
              handleOnMovieClick={handleSelectedId}
              movies={movies}
            ></MoviesList>
          )}
          {errorMessage && <ErrorMessage message={errorMessage}></ErrorMessage>}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              handleOnBackClick={handleBackOnClick}
              selectedId={selectedId}
              onAddWatchedMovie={handleOnAddWatchedMovie}
              watched={watched}
            ></MovieDetails>
          ) : (
            <>
              <Summary watched={watched}></Summary>
              <WatchedMoviesList
                watched={watched}
                onDelete={handleDeleteWatchedMovie}
              ></WatchedMoviesList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
