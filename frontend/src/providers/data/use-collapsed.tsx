import { useEffect, useState } from 'react';

export default function useExpanded() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedCollapsed = localStorage.getItem('expanded');
    if (storedCollapsed) {
      setExpanded(new Set(JSON.parse(storedCollapsed)));
    }
  }, []);

  function expand(path: string) {
    const newCollapsed = new Set(expanded);
    newCollapsed.add(path);
    setExpanded(newCollapsed);
    localStorage.setItem('expanded', JSON.stringify(Array.from(newCollapsed)));
  }

  function collapse(path: string) {
    const newCollapsed = new Set(expanded);
    newCollapsed.delete(path);
    setExpanded(newCollapsed);
    localStorage.setItem('expanded', JSON.stringify(Array.from(newCollapsed)));
  }

  return {
    expanded,
    collapse,
    expand,
  };
}
