import endpoints, { withQueryParams } from '@/lib/endpoints';
import { cleanPath, getExtension, getName } from '@/lib/file-utils';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './auth-provider';
import { DataLeaf, useData } from './data/provider';

type EditorContextProps = {
  originalFilename: string;
  filename: string;
  ext: string | null;
  file: string | null;
  activeFile: string | null;
  filePath: string | null;
  dirty: boolean;
  loading: boolean;
  setFile: (data: string, options?: { ignoreDirtyCheck: boolean }) => void;
  onSave: (newFileContent?: string | null) => Promise<void>;
  selectFile: (filePath: string | null) => void;
}

const EditorContext = createContext({} as EditorContextProps);

export function useEditor() {
  return useContext(EditorContext);
}

export function EditorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const navigate = useNavigate();
  const { username } = useAuth();
  const { '*': filePath = null } = useParams();
  const { files, setFiles } = useData();

  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  const originalFilename = filePath?.split('/').pop() ?? 'Untitled.md';
  const filename = getName(originalFilename);
  const ext = getExtension(originalFilename);

  function selectFile(filePath: string | null) {
    if (filePath) {
      navigate(cleanPath(`/${username}/${filePath}`));
    } else {
      setActiveFile(null);
      navigate(cleanPath(`/${username}`));
    }
  }

  async function onSave(newFileContent: string | null = null) {
    const content = newFileContent ?? file;
    if (content === null) return;
    if (content !== null && content !== file) setFile(content)
    if (activeFile) {
      try {
        const { updated, files } = await saveFile(activeFile, content);
        if (!updated) throw new Error('The file could not be saved. Please try again.');
        if (files) setFiles(files);
        setDirty(false);
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
      const newFileName = incremental ? `Untitled ${incremental}` : 'Untitled';

      try {
        const { updated, files: newFiles } = await saveFile(`${newFileName}.md`, content);
        if (!updated) throw new Error('The file could not be saved. Please try again.');
        navigate(`/${username}/${newFileName}.md`);
        if (newFiles) setFiles(newFiles);
        setDirty(false);
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
    if (!filePath) {
      setFile(null);
      return;
    };

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setDirty(false);
    loadFile(filePath, signal)
      .then(data => {
        setFile(data);
        setActiveFile(filePath);
      })
      .catch(error => {
        if (!error.message.includes('abort')) {
          toast.error(error.message);
        }
        setFile(null);
        navigate(`/${username}`);
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    }
  }, [filePath, navigate, username]);

  const value = {
    originalFilename,
    filename,
    ext,
    file,
    activeFile,
    filePath,
    dirty,
    loading,
    setFile: (data: string, options = defaultSetFileOptions) => {
      setFile(data);
      if (!options.ignoreDirtyCheck) {
        setDirty(true);
      }
    },
    onSave,
    selectFile,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

async function loadFile(filePath: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(withQueryParams(endpoints.files.index, { filePath }), {
    credentials: 'include',
    signal,
  });
  const data = await response.text();
  if (!response.ok) throw new Error(data);
  return data;
}

async function saveFile(filePath: string, data: string): Promise<{ updated: boolean, files?: DataLeaf | null }> {
  const response = await fetch(withQueryParams(endpoints.files.index, { filePath }), {
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

const defaultSetFileOptions = {
  ignoreDirtyCheck: false,
};
