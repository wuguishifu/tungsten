import { useEditor } from '@/providers/editor-provider';
import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export default function CopyButton() {
  const { file } = useEditor();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!file) return;
    copyText(file)
      .then(() => {
        toast.success('copied to clipboard');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }, [file]);

  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-9 disabled:opacity-100'
      onClick={handleCopy}
      disabled={copied}
    >
      {copied
        ? <Check size={16} className='text-green-500' />
        : <Copy size={16} className='text-neutral-400' />
      }
    </Button>
  );
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
