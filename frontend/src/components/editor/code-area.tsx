import EditorTheme from '@/components/editor/codemirror-theme';
import { useEditor } from '@/providers/editor-provider';
import { useSettings } from '@/providers/settings-provider';
import { markdown } from '@codemirror/lang-markdown';
import { Vim, vim } from '@replit/codemirror-vim';
import ReactCodeMirror, { EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { forwardRef, useEffect } from 'react';

const CodeArea = forwardRef((_, ref: React.Ref<ReactCodeMirrorRef>) => {
  const { editorSettings } = useSettings();
  const { file, dirty, setFile, onSave } = useEditor();

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
    <div
      className='h-full pt-2'
      onBlur={e => {
        if (!e.target.contains(e.relatedTarget as Node) && dirty && editorSettings.saveOnBlur) {
          onSave();
        }
      }}
    >
      <ReactCodeMirror
        ref={ref}
        autoFocus
        className='h-full'
        lang='md'
        theme='dark'
        placeholder='start typing...'
        value={file ?? ''}
        extensions={[
          markdown(),
          EditorTheme,
          ...(editorSettings.vimEnabled ? [vim()] : []),
          EditorView.lineWrapping,
        ]}
        onChange={value => setFile(value)}
      />
    </div>
  );
});

export default CodeArea;
