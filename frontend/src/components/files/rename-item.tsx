import { fileExists } from '@/lib/file-utils';
import { DataLeaf, useData } from '@/providers/data-provider';
import { File, Folder } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

type RenameItemProps = {
  formattedName: string;
  leaf: DataLeaf;
  indentation: number;
  stopEditing: () => void;
};

export default function RenameItem(props: RenameItemProps) {
  const {
    formattedName,
    leaf,
    indentation,
    stopEditing,
  } = props;

  const { '*': filePath, username } = useParams();
  const { renameFile, renameDirectory } = useData();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(formattedName);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (value === formattedName) {
      stopEditing();
      return;
    }

    try {
      let newFiles: DataLeaf | null = null;
      let newPath = value;
      if (leaf.type === 'file') {
        const oldPath = leaf.path;
        newPath = `${leaf.dirPath}/${value}.md`;
        newFiles = await renameFile(oldPath, newPath);
      } else {
        const oldPath = leaf.path;
        const parts = leaf.dirPath.split('/');
        parts.pop();
        newPath = `${parts.join('/')}/${value}`;
        newFiles = await renameDirectory(oldPath, newPath);
      }

      if (!newFiles || !filePath) return;
      if (!fileExists(filePath, newFiles)) {
        if (leaf.type === 'file') {
          navigate(`/${username}${newPath}`);
        } else {
          navigate(`/${username}`);
        }
      }

      stopEditing();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error has occurred.');
      }
    }
  }

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
    }
  }, [stopEditing]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={divRef}
      className='flex flex-row items-center gap-1 py-1 mt-0.5 bg-neutral-700 pr-2 rounded-sm'
      style={{ paddingLeft: indentation * 16 + 8 }}
    >
      {leaf.type === 'file'
        ? <File size={16} className='min-w-4' />
        : <Folder size={16} className='min-w-4' />
      }
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className='outline-none w-full rounded-sm bg-neutral-800 text-sm px-1 py-0.5'
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={e => e.target.select()}
        />
      </form>
    </div>
  );
}
