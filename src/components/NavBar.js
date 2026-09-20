import Logo from "./Logo";
import SearchBar from "./SearchBar";
import NumResults from "./NumResults";

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <Logo></Logo>
      <SearchBar></SearchBar>
      <NumResults></NumResults>
    </nav>
  );
}
