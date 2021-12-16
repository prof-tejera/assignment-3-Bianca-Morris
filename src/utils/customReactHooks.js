import { useState, useEffect, useRef } from "react";
import createPersistedReducer from 'use-persisted-reducer';

/**
 * Borrowed from an example on Overreacted.io
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

/**
 * Borrowed from https://github.com/prof-tejera/react7/blob/main/src/hooks.js
 */
export const usePersistedState = (key, initialValue) => {

    // Loads the previously stored value from local storage, and if not present creates one
    // with initialValue
    const [storedValue, setStoredValue] = useState(() => {
      try {
        // Read initial value from local storage or fallback to the given initial value
        const item = window.localStorage.getItem(key);
        // console.log("item from localStorage", item);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    });
  
    // Updates app state and local storage with new value
    const setValue = value => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    };
  
    return [storedValue, setValue];
  };

  export const usePersistedReducer = createPersistedReducer('routineState');