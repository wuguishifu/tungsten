import { DataLeaf } from '@/providers/data/provider';

export function getName(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return filename;
  }
  return filename.substring(0, lastDotIndex);
}

export function getExtension(filename: string): string | null {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return null;
  }
  return filename.substring(lastDotIndex + 1);
}

export function cleanPath(path: string): string {
  return path.replace(/\/+/g, '/');
}

// shitty o(n) implementation
export function fileExists(path: string, files: DataLeaf) {
  if (!files) return false;

  function exists(leaf: DataLeaf): boolean {
    if (leaf.path === path) {
      return true;
    }
    if (leaf.type === 'directory') {
      return leaf.children.some(exists);
    }
    return false
  }

  return exists(files);
};

// o(n)
export function getDataLeaf(path: string, root: DataLeaf): DataLeaf | null {
  if (!root) return null;

  function getLeaf(leaf: DataLeaf): DataLeaf | null {
    if (leaf.path === path) {
      return leaf;
    }
    if (leaf.type === 'directory') {
      for (const child of leaf.children) {
        const found = getLeaf(child);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  return getLeaf(root);
}
