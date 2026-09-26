import { useRef, useEffect } from "react";

export default function SearchBar({ query, setQuery }) {
  // Right way to select DOM Elements in React to make it declarative.
  // the .current property is the way we can access that element after referencing it DON'T FORGET IT.
  const inputElement = useRef(null);

  useEffect(() => {
    const callback = (e) => {
      if (document.activeElement === inputElement.current) {
        return;
      }

      if (e.code === "Enter") {
        inputElement.current.focus();
        setQuery("");
      }
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [setQuery]);

  // how to not select DOM Elements:
  // useEffect(() => {
  //   const searchBar = document.querySelector('.search');
  //   searchBar.focus();
  // }, [])

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}
