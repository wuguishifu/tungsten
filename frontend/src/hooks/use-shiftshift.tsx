import { useEffect, useRef } from 'react';

export default function useShiftShift(callback: () => void) {
  const shiftPressed = useRef(false);
  const shiftPressedTime = useRef(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Shift') {
        const now = Date.now();
        if (!shiftPressed.current && now - shiftPressedTime.current < 200) {
          callback();
        }
        shiftPressed.current = true;
        shiftPressedTime.current = now;
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'Shift') {
        shiftPressed.current = false;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [callback]);
}
