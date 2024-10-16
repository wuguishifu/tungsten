import { getAllDirectoryPaths } from '@/lib/file-utils';
import { useEffect, useState } from 'react';
import { DataLeaf, useData } from '../data/provider';

export default function useExpanded() {
  const { files } = useData();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedCollapsed = localStorage.getItem('expanded');
    if (storedCollapsed) {
      setExpanded(new Set(JSON.parse(storedCollapsed)));
    }
  }, []);

  function expand(path: string) {
    const newExpanded = new Set(expanded);
    newExpanded.add(path);
    setExpanded(newExpanded);
    saveExpanded(newExpanded);
  }

  function collapse(path: string) {
    const newExpanded = new Set(expanded);
    newExpanded.delete(path);
    setExpanded(newExpanded);
    saveExpanded(newExpanded);
  }

  function collapseAll(leaf?: DataLeaf) {
    if (leaf) {
      const newExpanded = new Set(expanded);
      const paths = getAllDirectoryPaths(leaf);
      paths.forEach(path => newExpanded.delete(path));
      setExpanded(newExpanded);
      saveExpanded(newExpanded);
    } else {
      setExpanded(new Set());
      saveExpanded(new Set());
    }
  }

  function expandAll(leaf?: DataLeaf) {
    if (leaf) {
      const newExpanded = new Set(expanded);
      const paths = getAllDirectoryPaths(leaf);
      paths.forEach(path => newExpanded.add(path));
      setExpanded(newExpanded);
      saveExpanded(newExpanded);
    } else {
      if (files) {
        const newExpanded = getAllDirectoryPaths(files);
        setExpanded(newExpanded);
        saveExpanded(newExpanded);
      }
    }
  }

  useEffect(() => {
    console.log(expanded);
  }, [expanded]);

  return {
    expanded,
    collapse,
    collapseAll,
    expandAll,
    expand,
  };
}

function saveExpanded(expanded: Set<string>) {
  localStorage.setItem('expanded', JSON.stringify(Array.from(expanded)));
}
