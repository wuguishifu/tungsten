import { useEditor } from '@/providers/editor-provider';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Settings } from 'lucide-react';
import { useRef } from 'react';
import EditorSettings from '../editor-settings';
import Loading from '../suspense/loading';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import CodeArea from './code-area';

export default function Editor() {
  const { filename, loading, dirty } = useEditor();

  const editor = useRef<ReactCodeMirrorRef>(null);

  return (
    <div className='bg-neutral-900 h-full rounded-lg w-full p-4 flex flex-col'>
      <div className='flex flex-row items-center justify-between mt-2'>
        <div className='flex flex-row items-center relative'>
          {dirty && <div className='size-1 bg-neutral-500 rounded-full absolute -left-2' />}
          <h1 className='text-xl'>{filename}</h1>
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
          <CodeArea
            ref={editor}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
