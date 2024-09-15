import EditorTheme from '@/lib/codemirror-theme';
import { useSettings } from '@/providers/settings-provider';
import { markdown } from '@codemirror/lang-markdown';
import { Vim, vim } from '@replit/codemirror-vim';
import ReactCodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { forwardRef, useEffect } from 'react';

type CodeAreaProps = {
  file: string;
  setFile: (file: string) => void;
  onSave: () => Promise<void>;
};

const CodeArea = forwardRef((props: CodeAreaProps, ref: React.Ref<ReactCodeMirrorRef>) => {
  const { editorSettings } = useSettings();
  const {
    file,
    setFile,
    onSave,
  } = props;

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
    <ReactCodeMirror
      ref={ref}
      autoFocus
      className='h-full mt-2'
      lang='md'
      theme='dark'
      placeholder='start typing...'
      value={file}
      extensions={[
        markdown(),
        EditorTheme,
        ...(editorSettings.vimEnabled ? [vim()] : []),
      ]}
      onChange={value => setFile(value)}
    />
  );
});

export default CodeArea;
