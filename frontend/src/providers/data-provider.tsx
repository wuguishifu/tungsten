import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './auth-provider';

type DataContextProps = {
  files: DataLeaf | null;
  loadFile: (path: string) => Promise<string>;
}

export type DataLeaf = {
  name: string;
  path: string;
  dirPath: string;
} & ({
  type: 'directory';
  children: DataLeaf[];
} | {
  type: 'file';
});

const DataContext = createContext({} as DataContextProps);

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const { username } = useAuth();

  const [files, setFiles] = useState<DataLeaf | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/files', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error('Unknown error.');
      }
    }
  }, []);

  const loadFile = useCallback(async (path: string): Promise<string> => {
    console.log(path);
    const response = await fetch(`/api/files?filePath=${path}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.text();
    return data;
  }, []);

  useEffect(() => {
    if (!username) return;
    loadFiles();
  }, [username, loadFiles]);

  const value = {
    files,
    loadFile,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
