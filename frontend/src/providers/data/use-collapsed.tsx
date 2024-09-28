import { useEffect, useState } from 'react';

export default function useCollapsed() {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedCollapsed = localStorage.getItem('collapsed');
    if (storedCollapsed) {
      setCollapsed(new Set(JSON.parse(storedCollapsed)));
    }
  }, []);

  function collapse(path: string) {
    const newCollapsed = new Set(collapsed);
    newCollapsed.add(path);
    setCollapsed(newCollapsed);
    localStorage.setItem('collapsed', JSON.stringify(Array.from(newCollapsed)));
  }

  function expand(path: string) {
    const newCollapsed = new Set(collapsed);
    newCollapsed.delete(path);
    setCollapsed(newCollapsed);
    localStorage.setItem('collapsed', JSON.stringify(Array.from(newCollapsed)));
  }

  return {
    collapsed,
    collapse,
    expand,
  };
}
