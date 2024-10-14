import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';

export default function Loading() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [spinnerDisplayed, setSpinnerDisplayed] = useState(false);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setSpinnerDisplayed(true);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, []);

  return (
    <div className='w-full h-full flex justify-center items-center' >
      {spinnerDisplayed && <ClipLoader color='#ABB2BF' />}
    </div>
  );
};
