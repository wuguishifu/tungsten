import { File, Folder } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type AddItemProps = {
  itemType: 'file' | 'directory';
  indentation: number;
  stopEditing: () => void;
}

export default function AddItem(props: AddItemProps) {
  const {
    itemType,
    indentation,
    stopEditing,
  } = props;

  const [value, setValue] = useState('');

  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        stopEditing();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        stopEditing();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [stopEditing]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={divRef}
      className='flex flex-row items-center gap-1 py-1 mt-0.5'
      style={{ paddingLeft: indentation * 16 + 8 }}
    >
      {itemType === 'file'
        ? <File size={16} className='min-w-4' />
        : <Folder size={16} className='min-w-4' />
      }
      <input
        ref={inputRef}
        className='outline-none w-full rounded-sm bg-neutral-800 px-1 text-sm py-0.5'
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}
