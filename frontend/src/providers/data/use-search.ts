import { useMemo } from 'react';
import { DataLeaf, useData } from './provider';

export default function useSearch(query: string) {
  const { files } = useData();

  return useMemo(() => {
    const searchQuery = query.toLowerCase();
    const results: DataLeaf[] = [];

    const searchFiles = (leaf: DataLeaf) => {
      if (leaf.type === 'file') {
        if (
          leaf.name.toLowerCase().includes(searchQuery) ||
          leaf.path.toLowerCase().includes(searchQuery)
        ) {
          results.push(leaf);
        }
      } else {
        leaf.children.forEach(searchFiles);
      }
    };

    if (files?.type === 'directory') {
      files?.children.forEach(searchFiles);
    }

    return results;
  }, [query, files]);
}
