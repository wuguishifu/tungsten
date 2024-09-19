import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './auth-provider';

type DataContextProps = {
  files: DataLeaf | null;
  deleted: string[] | null;
  setFiles: Dispatch<SetStateAction<DataLeaf | null>>;
  createFile: (path: string) => Promise<void>;
  createDirectory: (path: string) => Promise<void>;
  deleteFile: (path: string) => Promise<DataLeaf>;
  deleteDirectory: (path: string) => Promise<DataLeaf>;
  renameFile: (path: string, newPath: string) => Promise<DataLeaf>;
  renameDirectory: (path: string, newPath: string) => Promise<DataLeaf>;
  restoreFile: (name: string) => Promise<string | null>;
  permanentlyDeleteFile: (name: string) => Promise<void>;
  permanentlyDeleteAll: () => Promise<void>;
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

export type DataType = 'file' | 'directory';

const DataContext = createContext({} as DataContextProps);

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const { username } = useAuth();

  const [files, setFiles] = useState<DataLeaf | null>(null);
  const [deleted, setDeleted] = useState<string[] | null>(null);

  const updateFiles = useCallback((files: DataLeaf | null) => {
    if (files) {
      if (files.type !== 'directory') throw new Error('Invalid data.');
      const deletedLeaf = files.children.find((child) => child.name === '.trash');
      if (deletedLeaf?.type === 'directory') {
        setDeleted(deletedLeaf.children.map((child) => child.name));
      }
      files.children = files.children.filter(child => child.name !== '.trash');
      setFiles(files);
    } else {
      setFiles(null);
      setDeleted(null);
    }
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/files', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      updateFiles(data.files);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error('Unknown error.');
      }
    }
  }, [updateFiles]);

  const createDirectory = useCallback(async (path: string) => {
    const response = await fetch('/api/folders', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderPath: path,
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.created) {
      updateFiles(data.files);
    }
  }, [updateFiles]);

  const createFile = useCallback(async (path: string) => {
    const response = await fetch('/api/files', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filePath: path,
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.created) {
      updateFiles(data.files);
    }
  }, [updateFiles]);

  const deleteFile = useCallback(async (path: string) => {
    const response = await fetch(`/api/files?filePath=${path}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.deleted) {
      updateFiles(data.files);
    }
    return data.files ?? null;
  }, [updateFiles]);

  const deleteDirectory = useCallback(async (path: string) => {
    const response = await fetch(`/api/folders?folderPath=${path}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.deleted) {
      updateFiles(data.files);
    }
    return data.files ?? null;
  }, [updateFiles]);

  const renameFile = useCallback(async (path: string, newPath: string) => {
    const response = await fetch(`/api/files/name?oldPath=${path}&newPath=${newPath}`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.renamed) {
      updateFiles(data.files);
    }
    return data.files ?? null;
  }, [updateFiles]);

  const renameDirectory = useCallback(async (path: string, newPath: string) => {
    const response = await fetch(`/api/folders/name?oldPath=${path}&newPath=${newPath}`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.renamed) {
      updateFiles(data.files);
    }
    return data.files ?? null;
  }, [updateFiles]);

  const restoreFile = useCallback(async (name: string) => {
    const response = await fetch(`/api/deleted/restore?filePath=${name}`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.restored) {
      updateFiles(data.files);
    }
    return data.restored ? (name.split('/').pop() ?? null) : null;
  }, [updateFiles]);

  const permanentlyDeleteFile = useCallback(async (name: string) => {
    const response = await fetch(`/api/deleted?filePath=${name}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.deleted) {
      updateFiles(data.files);
    }
  }, [updateFiles]);

  const permanentlyDeleteAll = useCallback(async () => {
    const response = await fetch('/api/deleted/all', {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    if (data.deleted) {
      updateFiles(data.files);
    }
  }, [updateFiles]);

  useEffect(() => {
    if (!username) return;
    loadFiles();
  }, [username, loadFiles]);

  const value = {
    files,
    deleted,
    setFiles,
    createFile,
    createDirectory,
    deleteFile,
    deleteDirectory,
    renameFile,
    renameDirectory,
    restoreFile,
    permanentlyDeleteFile,
    permanentlyDeleteAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
