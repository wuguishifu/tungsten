import useFile from '@/hooks/use-file';
import EditorTheme from '@/lib/codemirror-theme';
import { useSettings } from '@/providers/settings-provider';
import { Vim, vim } from '@replit/codemirror-vim';
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Switch } from '../ui/switch';

export default function Editor() {
  const { '*': filePath } = useParams();
  const { filename, file, setFile, onSave } = useFile(filePath);

  const { editorSettings, updateEditorSettings } = useSettings();

  const editor = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    editor.current?.view?.focus();
  }, []);

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
        <h1>{filename}</h1>
        <div className='flex flex-row items-center'>
          <div
            onClick={() => updateEditorSettings('vimEnabled', !editorSettings.vimEnabled)}
            className='flex flex-row items-center gap-2 cursor-pointer'
          >
            <h3>Vim</h3>
            <Switch checked={editorSettings.vimEnabled} id='vim-toggle' />
          </div>
        </div>
      </div>
      <div className='flex-1'>
        <ReactCodeMirror
          className='h-full'
          lang='md'
          theme='dark'
          ref={editor}
          placeholder='start typing...'
          value={file}
          extensions={[
            EditorTheme,
            ...(editorSettings.vimEnabled ? [vim()] : []),
          ]}
          onChange={value => setFile(value)}
        />
      </div>
    </div>
  );
}
