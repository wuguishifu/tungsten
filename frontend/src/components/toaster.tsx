import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

export default function Toaster() {
  const { theme = 'system' } = useTheme();
  return <Sonner theme={theme as 'light' | 'dark' | 'system'} richColors />;
}
