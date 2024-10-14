import { ItemType, useData } from '@/providers/data/provider';
import { useEditor } from '@/providers/editor-provider';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import ItemIcon from './item-icon';

type AddItemProps = {
  dirPath: string;
  itemType: ItemType;
  indentation: number;
  stopEditing: () => void;
}

export default function AddItem(props: AddItemProps) {
  const {
    dirPath,
    itemType,
    indentation,
    stopEditing,
  } = props;

  const { createFile, createDirectory } = useData();
  const { selectFile } = useEditor();

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

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (value.trim() === '') {
      stopEditing();
      return;
    }

    try {
      if (itemType === 'text') {
        const newFile = `${dirPath}/${value}.excalidraw`;
        await createFile(newFile);
        selectFile(newFile);
      } else if (itemType === 'drawing') {
        const newFile = `${dirPath}/${value}.excalidraw`;
        await createFile(newFile);
        selectFile(newFile);
      } else {
        await createDirectory(`${dirPath}/${value}`);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    }

    stopEditing();
  }

  return (
    <div
      ref={divRef}
      className='flex flex-row items-center gap-1 py-1 mt-0.5'
      style={{ paddingLeft: indentation * 16 + 8 }}
    >
      <ItemIcon type={itemType} />
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className='outline-none w-full rounded-sm bg-neutral-800 px-1 text-sm py-0.5'
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </form>
    </div>
  );
}
