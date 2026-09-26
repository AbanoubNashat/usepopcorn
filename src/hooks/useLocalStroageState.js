import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // we can give the useState a pure callback function to do some computations if needed in the initial render of the component.that is called lazy initial state.
  const [watched, setWatched] = useState(() => {
    const movies = localStorage.getItem(key);
    return movies ? JSON.parse(movies) : initialState;
  });

  // we can handle this sideEffect in the event handlers above but with this way we will keep the localStorage in sync with every change for the watched list automatically without handling the adding and removing the an item with it.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(watched));
  }, [watched,key]);

  return [watched,setWatched];
}
