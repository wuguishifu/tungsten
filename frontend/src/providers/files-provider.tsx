import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-provider';

type FilesContextProps = {

};

const FilesContext = createContext({} as FilesContextProps);

export function useFiles() {
  return useContext(FilesContext);
}

export function FilesProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const { username } = useAuth();

  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    const response = await fetch('/api/files');
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    setData(data);
  }, []);

  useEffect(() => {
    if (!username) return;
    loadData();
  }, [username]);

  const value = {
    data,
  };

  return (
    <FilesContext.Provider value={value}>
      {children}
    </FilesContext.Provider>
  );
}
