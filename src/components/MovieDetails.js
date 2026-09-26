import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import StarRating from "./StarRating";

const APIKey = "890190d";

export default function MovieDetails({
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

  const countRef = useRef(0);
  // we always manipulate refs with effects or event handlers don't forget it.
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

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
      ratingDecisions: countRef.current,
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

  useEffect(() => {
    // this condition to prevent undefined to be shown
    if (!title) return;
    document.title = title;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(() => {
    // plain dom manipulation should be in effects like this and we need to clean up the event that attached to the component or it will make a lot of duplicate events that will affect memory and performance and the callback function should be the same for adding and removing the event listener so we make the function out of them.
    function onPressEscape(e) {
      if (e.code === "Escape") {
        handleOnBackClick();
      }
    }
    document.addEventListener("keydown", onPressEscape);

    return () => {
      document.removeEventListener("keydown", onPressEscape);
    };
  }, [handleOnBackClick]);

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
