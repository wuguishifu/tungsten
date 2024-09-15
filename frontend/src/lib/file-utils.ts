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
