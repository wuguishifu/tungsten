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

export function getAllDirectoryPaths(root: DataLeaf): Set<string> {
  const paths = new Set<string>();

  function getPaths(leaf: DataLeaf) {
    if (leaf.type === 'directory') {
      paths.add(leaf.path);
      leaf.children.forEach(getPaths);
    }
  }

  getPaths(root);

  return paths;
}

export function getAllPathsToFile(root: DataLeaf, targetPath: string): Set<string> {
  const path: string[] = [];

  function findPath(node: DataLeaf, targetPath: string, path: string[]): boolean {
    if (node.path === targetPath) return true;
    if (node.type === 'directory') {
      for (const child of node.children) {
        if (findPath(child, targetPath, path)) {
          path.push(node.path);
          return true;
        }
      }
    }
    return false;
  }

  if (findPath(root, targetPath, path)) {
    path.reverse();
    return new Set(path);
  } else {
    return new Set();
  }
}
