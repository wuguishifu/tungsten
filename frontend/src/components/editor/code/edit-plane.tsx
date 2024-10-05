import EditorTheme from '@/components/editor/code/codemirror-theme';
import useCompletions from '@/hooks/use-completions';
import { useEditor } from '@/providers/editor-provider';
import { useSettings } from '@/providers/settings-provider';
import { autocompletion } from '@codemirror/autocomplete';
import { markdown } from '@codemirror/lang-markdown';
import { Vim, vim } from '@replit/codemirror-vim';
import ReactCodeMirror, { EditorView, Prec, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { forwardRef, useEffect, useMemo } from 'react';

const EditPlane = forwardRef((_, ref: React.Ref<ReactCodeMirrorRef>) => {
  const { editorSettings } = useSettings();
  const { file, dirty, setFile, onSave } = useEditor();

  const fileCompletions = useCompletions();

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

  const extensions = useMemo(() => {
    const extensions = [
      markdown(),
      EditorTheme,
      autocompletion({
        override: [fileCompletions],
        closeOnBlur: false,
        icons: false,
      }),
      EditorView.lineWrapping,
    ];

    if (editorSettings.vimEnabled) {
      extensions.push(Prec.high(vim()));
    }

    return extensions;
  }, [editorSettings, fileCompletions]);

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
        extensions={extensions}
        onChange={value => setFile(value)}
      />
    </div>
  );
});

export default EditPlane;
