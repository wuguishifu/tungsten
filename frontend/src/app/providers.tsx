'use client'

import { AuthProvider } from '@/providers/auth-provider';
import { FilesProvider } from '@/providers/files-provider';

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <FilesProvider>
        {children}
      </FilesProvider>
    </AuthProvider>
  );
}
