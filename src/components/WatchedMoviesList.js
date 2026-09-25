import WatchedMovie from "./WatchedMovie";

export default function WatchedMoviesList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          onDelete={onDelete}
          movie={movie}
          key={movie.imdbID}
        ></WatchedMovie>
      ))}
    </ul>
  );
}
