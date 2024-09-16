import { DataLeaf } from '@/providers/data-provider';

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
