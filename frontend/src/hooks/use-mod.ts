import { useCallback, useEffect, useState } from 'react';

export default function useMod() {
  const [modPressed, setModPressed] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.key === 'Alt' || event.key === 'Option') && !event.repeat) {
      setModPressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if ((event.key === 'Alt' || event.key === 'Option') && !event.repeat) {
      setModPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    console.log('mod pressed:', modPressed);
  }, [modPressed]);

  return modPressed;
}
