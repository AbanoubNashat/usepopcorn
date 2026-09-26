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
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStroageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedID] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const { movies, isLoading, errorMessage } = useMovies(query);

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
