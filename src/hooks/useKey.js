import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(() => {
    // plain dom manipulation should be in effects like this and we need to clean up the event that attached to the component or it will make a lot of duplicate events that will affect memory and performance and the callback function should be the same for adding and removing the event listener so we make the function out of them.
    function onPress(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", onPress);

    return () => {
      document.removeEventListener("keydown", onPress);
    };
  }, [key,action]);
}
