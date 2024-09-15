import { getExtension, getName } from '@/lib/file-utils';
import { useAuth } from '@/providers/auth-provider';
import { DataLeaf, useData } from '@/providers/data-provider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function useFile(path?: string) {
  const navigate = useNavigate();
  const { username } = useAuth();

  const { files, setFiles } = useData();
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const originalFilename = path?.split('/').pop() ?? 'Untitled.md';

  const filename = getName(originalFilename);
  const ext = getExtension(originalFilename);

  async function onSave() {
    if (!file) return;
    if (path) {
      try {
        const { updated, files } = await saveFile(path, file);
        if (!updated) throw new Error('The file could not be saved. Please try again.');
        if (files) setFiles(files);
        toast.success('Saved.');
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error has occurred.');
        }
      }
    } else {
      // save "Untitled x" file
      if (files?.type !== 'directory') return;
      const highest = files.children.reduce((acc, child) => {
        if (child.name.startsWith('Untitled')) {
          const lastPeriod = child.name.lastIndexOf('.');
          const fileName = child.name.slice(0, lastPeriod);
          const parts = fileName.split(' ');
          const number = parseInt(parts[parts.length - 1]);
          if (isNaN(number)) return acc === -1 ? 0 : acc;
          if (number >= acc) {
            return number;
          }
        }
        return acc;
      }, -1);
      const incremental = highest + 1;
      console.log({ highest, incremental });
      const newFileName = incremental ? `Untitled ${incremental}` : 'Untitled';

      try {
        const { updated, files: newFiles } = await saveFile(`${newFileName}.md`, file);
        if (!updated) throw new Error('The file could not be saved. Please try again.');
        console.log(newFiles);
        navigate(`/${username}/${newFileName}.md`);
        if (newFiles) setFiles(newFiles);
        toast.success('Saved.');
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error has occurred.');
        }
      }
    }
  }

  useEffect(() => {
    if (!path) return;
    setLoading(true);
    loadFile(path)
      .then(data => setFile(data))
      .catch(error => {
        toast.error(error.message);
        navigate(`/${username}`);
      })
      .finally(() => setLoading(false));
  }, [path, navigate, username]);

  return {
    originalFilename,
    filename,
    ext: ext ?? 'md',
    file,
    loading,
    setFile,
    onSave,
  } as const;
}

async function loadFile(filePath: string): Promise<string> {
  const response = await fetch(`/api/files?filePath=${filePath}`, {
    credentials: 'include',
  });
  const data = await response.text();
  if (!response.ok) throw new Error(data);
  return data;
}

async function saveFile(filePath: string, data: string): Promise<{ updated: boolean, files?: DataLeaf | null }> {
  const response = await fetch(`/api/files?filePath=${filePath}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}
