import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useFile(path?: string | null) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) return;
    setLoading(true);
    loadFile(path)
      .then(data => setData(data))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [path]);

  return [data, loading] as const;
}

async function loadFile(filePath: string): Promise<string> {
  const response = await fetch(`/api/files?filePath=${filePath}`, {
    credentials: 'include',
  });
  const data = await response.text();
  if (!response.ok) throw new Error(data);
  return data;
}
