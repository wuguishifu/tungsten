import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useFile(path?: string | null) {
  const [file, setFile] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function onSave() {
    if (!path || !file) return;
    setLoading(true);
    try {
      const { updated } = await saveFile(path, file);
      if (!updated) {
        throw new Error('The file could not be saved. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error has occurred. Please see the console for more information.');
        console.log(error);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!path) return;
    setLoading(true);
    loadFile(path)
      .then(data => setFile(data))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [path]);

  const filename = path?.split('/').pop();

  return {
    filename,
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

async function saveFile(filePath: string, data: string): Promise<{ updated: boolean }> {
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
  const json = await response.json();
  return { updated: json.updated };
}
