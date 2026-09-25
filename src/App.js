import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import SearchBar from "./components/SearchBar";
import NumResults from "./components/NumResults";
import Box from "./components/Box";
import MoviesList from "./components/MoviesList";
import Summary from "./components/Summary";
import WatchedMoviesList from "./components/WatchedMoviesList";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

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
    // useEffect can't return a promise so we defined our async function first then called it inside the effect.
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${APIKey}&s=${query}`,
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
        setErrorMessage(error.message);
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

function MovieDetails({
  selectedId,
  handleOnBackClick,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;

  const {
    Title: title,
    Poster: poster,
    imdbRating,
    Director: director,
    Released: released,
    Plot: plot,
    Genre: genre,
    Actors: actors,
    Year: year,
    Runtime: runtime,
  } = movie;

  function handleWatchedMovie() {
    const watchedMovie = {
      imdbID: selectedId,
      poster,
      title,
      imdbRating: Number(imdbRating),
      userRating: userRating,
      runtime: Number(runtime.split(" ").at(0)),
    };
    onAddWatchedMovie(watchedMovie);
    handleOnBackClick();
  }

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${APIKey}&i=${selectedId}`,
        );
        if (!response.ok) {
          throw new Error("There is a problem with fetching movie details");
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error("Wrong Search Value");
        }
        console.log(data);
        setMovie(data);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovieDetails();
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading && <Loader></Loader>}
      {!isLoading && !errorMessage && (
        <>
          <header>
            <button onClick={handleOnBackClick} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You Rated This Movie With {watchedUserRating}</p>
              ) : (
                <StarRating
                  defaultRating={0}
                  maxRating={10}
                  size={23}
                  onSetRating={setUserRating}
                ></StarRating>
              )}
            </div>
            {userRating > 0 && (
              <button
                className="btn-add"
                onClick={() => {
                  handleWatchedMovie();
                }}
              >
                + Add To List
              </button>
            )}

            <p>
              <em>{plot}</em>
            </p>
            <p>Actors: {actors}</p>
            <p>Director: {director}</p>
          </section>
        </>
      )}
      {errorMessage && <ErrorMessage message={errorMessage}></ErrorMessage>}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading ...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
