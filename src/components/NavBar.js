import Logo from "./Logo";
import SearchBar from "./SearchBar";
import NumResults from "./NumResults";

export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo></Logo>
      {children}
    </nav>
  );
}
