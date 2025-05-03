import { Dispatch, SetStateAction, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const fromLocal = () => {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  };

  const [storedValue, setStoredValue] = useState(fromLocal());

  return [
    storedValue,
    value => {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    },
  ];
}
