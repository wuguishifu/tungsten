import { LibraryItems } from '@excalidraw/excalidraw/types/types';
import { useMemo } from 'react';

const LIBRARY_KEY = 'excalidraw-library';

export default function useLibrary() {
  const libraryItems: LibraryItems = useMemo(() => {
    try {
      const library = localStorage.getItem(LIBRARY_KEY);
      return library ? JSON.parse(library) : [];
    } catch (error) {
      console.error('Error loading library items', error);
      return [];
    }
  }, []);

  return {
    libraryItems,
    onLibraryChange,
  };
}

function onLibraryChange(libraryItems: LibraryItems) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(libraryItems));
  } catch (error) {
    console.error('Error saving library items:', error);
  }
}
