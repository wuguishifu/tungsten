import { useEditor } from '@/providers/editor-provider';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type DownloadButtonProps = {
  className?: string;
}

export default function DownloadButton(props: DownloadButtonProps) {
  const {
    className,
  } = props;

  const { file, originalFilename } = useEditor();

  return (
    <Button
      variant='ghost'
      size='sm'
      className={cn('h-9', className)}
      onClick={() => {
        if (!file || !originalFilename) return;
        downloadRaw(file, originalFilename);
      }}
    >
      <Download
        size={16}
        className='text-neutral-400'
      />
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
