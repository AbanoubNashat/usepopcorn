import MoviesList from "./MoviesList";
import WatchedMoviesBox from "./WatchedMoviesBox";

export default function Main() {
  return (
    <main className="main">
      <MoviesList></MoviesList>
      <WatchedMoviesBox></WatchedMoviesBox>
    </main>
  );
}
