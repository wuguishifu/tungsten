import useFile from '@/hooks/use-file';
import EditorTheme from '@/lib/codemirror-theme';
import { useSettings } from '@/providers/settings-provider';
import { markdown } from '@codemirror/lang-markdown';
import { Vim, vim } from '@replit/codemirror-vim';
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Settings } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EditorSettings from '../editor-settings';
import Loading from '../suspense/loading';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

export default function Editor() {
  const { editorSettings } = useSettings();
  const { '*': filePath } = useParams();
  const {
    loading,
    filename,
    ext,
    file,
    setFile,
    onSave,
  } = useFile(filePath);

  const editor = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    Vim.defineEx('write', 'w', onSave);

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave]);

  return (
    <div className='bg-neutral-800 h-full rounded-lg w-full p-4 flex flex-col'>
      <div className='flex flex-row items-center justify-between mt-2'>
        <div className='flex flex-row items-center'>
          <h1 className='text-xl'>{filename}.{ext}</h1>
        </div>
        <Dialog
          onOpenChange={(focused) => {
            if (!focused) editor.current?.view?.contentDOM.focus();
          }}
        >
          <DialogTrigger>
            <Settings className='size-4 cursor-pointer' />
          </DialogTrigger>
          <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
            <EditorSettings />
          </DialogContent>
        </Dialog>
      </div>
      <div className='flex-1'>
        {!loading ? (
          <ReactCodeMirror
            autoFocus
            className='h-full mt-2'
            lang='md'
            theme='dark'
            ref={editor}
            placeholder='start typing...'
            value={file}
            extensions={[
              markdown(),
              EditorTheme,
              ...(editorSettings.vimEnabled ? [vim()] : []),
            ]}
            onChange={value => setFile(value)}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
