import Movie from "./Movie";

export default function MoviesList({ movies, handleOnMovieClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          handleOnMovieClick={handleOnMovieClick}
          movie={movie}
          key={movie.imdbID}
        ></Movie>
      ))}
    </ul>
  );
}
