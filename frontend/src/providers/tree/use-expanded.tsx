import { getAllDirectoryPaths } from '@/lib/file-utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DataLeaf, useData } from '../data/provider';

export default function useExpanded() {
  const { files } = useData();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const expandedRef = useRef(expanded);
  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    setExpanded(getExpanded());
  }, []);

  const expand = useCallback((path: string) => {
    const newExpanded = new Set(expandedRef.current);
    newExpanded.add(path);
    setExpanded(newExpanded);
    saveExpanded(newExpanded);
  }, []);

  const collapse = useCallback((path: string) => {
    const newExpanded = new Set(expandedRef.current);
    newExpanded.delete(path);
    setExpanded(newExpanded);
    saveExpanded(newExpanded);
  }, []);

  const expandAll = useCallback((leaf?: DataLeaf) => {
    if (leaf) {
      const newExpanded = new Set(expandedRef.current);
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
  }, [files]);

  const collapseAll = useCallback((leaf?: DataLeaf) => {
    if (leaf) {
      const newExpanded = new Set(expandedRef.current);
      const paths = getAllDirectoryPaths(leaf);
      paths.forEach(path => newExpanded.delete(path));
      setExpanded(newExpanded);
      saveExpanded(newExpanded);
    } else {
      setExpanded(new Set());
      saveExpanded(new Set());
    }
  }, []);

  const expandSet = useCallback((paths: Set<string>) => {
    const newExpanded = new Set(expandedRef.current);
    paths.forEach(path => newExpanded.add(path));
    setExpanded(newExpanded);
    saveExpanded(newExpanded);
  }, []);

  const collapseSet = useCallback((paths: Set<string>) => {
    const newExpanded = new Set(expandedRef.current);
    paths.forEach(path => newExpanded.delete(path));
    setExpanded(newExpanded);
    saveExpanded(newExpanded);
  }, []);

  return {
    expanded,
    expand,
    expandAll,
    expandSet,
    collapse,
    collapseAll,
    collapseSet,
  };
}

function saveExpanded(expanded: Set<string>) {
  localStorage.setItem('expanded', JSON.stringify(Array.from(expanded)));
}

function getExpanded(): Set<string> {
  const stored = localStorage.getItem('expanded');
  return stored ? new Set(JSON.parse(stored)) : new Set();
}
