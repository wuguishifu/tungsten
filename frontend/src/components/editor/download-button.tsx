import { useEditor } from '@/providers/editor-provider';
import { Check, Download } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export default function DownloadButton() {
  const { file, originalFilename } = useEditor();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = useCallback(() => {
    if (!file) return;
    downloadRaw(file, originalFilename);
    toast.success('downloaded');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }, [file, originalFilename]);

  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-9 disabled:opacity-100'
      onClick={handleDownload}
      disabled={downloaded}
    >
      {downloaded
        ? <Check size={16} className='text-green-500' />
        : <Download size={16} className='text-neutral-400' />
      }
    </Button>
  );
}

export function downloadRaw(data: string, name: string) {
  const blob = new Blob([data], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
