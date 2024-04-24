import {useEffect} from 'react';

export const useDocumentTitle = (title: string, skip = false) => {
  useEffect(() => {
    if (!skip) {
      document.title = String(title);
    }
  }, [title]);
};
