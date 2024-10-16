import { useEditor } from '@/providers/editor-provider';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';

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
      className={className}
      onClick={() => {
        if (!file || !originalFilename) return;
        downloadRaw(file, originalFilename);
      }}
    >
      <Download size={16} />
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
