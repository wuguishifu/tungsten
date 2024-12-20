import { createContext, useContext } from 'react';
import { DataLeaf } from '../data/provider';
import useExpanded from './use-expanded';

type TreeContextProps = {
  expanded: Set<string>;
  expand: (path: string) => void;
  collapse: (path: string) => void;
  expandAll: (leaf: DataLeaf) => void;
  collapseAll: (leaf: DataLeaf) => void;
  expandSet: (paths: Set<string>) => void;
  collapseSet: (paths: Set<string>) => void;
}

const TreeContext = createContext({} as TreeContextProps);

export function useTree() {
  return useContext(TreeContext);
}

export function TreeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const expanded = useExpanded();

  const value = {
    ...expanded,
  };

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
}
