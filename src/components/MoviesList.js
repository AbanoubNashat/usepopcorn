import  Movie  from "./Movie";

export default function MoviesList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID}></Movie>
      ))}
    </ul>
  );
}
