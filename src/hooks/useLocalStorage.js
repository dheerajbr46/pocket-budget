import { useEffect, useState } from 'react';
import { getLocalStorageItem, saveLocalStorageItem } from '../utils/storage/index.js';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getLocalStorageItem(key, initialValue));

  useEffect(() => {
    saveLocalStorageItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
