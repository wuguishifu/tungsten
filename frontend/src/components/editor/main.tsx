import { useEditor } from '@/providers/editor-provider';
import { useSettings } from '@/providers/settings-provider';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Settings } from 'lucide-react';
import { useRef } from 'react';
import Loading from '../suspense/loading';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import CodeArea from './code-area';
import CodePreview from './code-preview';
import EditorSettingsView from './editor-settings';

export default function Editor() {
  const { filename, loading, dirty } = useEditor();

  const { editorSettings, updateEditorSettings } = useSettings();

  const editor = useRef<ReactCodeMirrorRef>(null);

  return (
    <div className='h-full w-full flex flex-col pr-4 gap-4'>
      <div className='flex flex-row items-center justify-between p-4 bg-neutral-900 rounded-md'>
        <div className='flex flex-row items-center relative'>
          <h1 className='text-xl font-bold text-primary'>{filename}</h1>
          {dirty && <div className='text-xs text-neutral-600 ml-2'>unsaved changes</div>}
        </div>
        <div className='flex flex-row items-center gap-4'>
          <div
            className='flex flex-row items-center gap-2 cursor-pointer'
            onClick={() => updateEditorSettings('showPreview', !editorSettings.showPreview)}
          >
            <h6 className='text-primary text-sm'>
              Preview
            </h6>
            <Switch checked={editorSettings.showPreview} />
          </div>
          <Dialog
            onOpenChange={(focused) => {
              if (!focused) editor.current?.view?.contentDOM.focus();
            }}
          >
            <DialogTrigger>
              <Settings className='size-4 cursor-pointer text-primary' />
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
              <EditorSettingsView />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className='flex-1 flex gap-4 overflow-hidden'>
          <div className='flex-1 bg-neutral-900 px-4 rounded-md w-1/2 scrollable'>
            <CodeArea ref={editor} />
          </div>
          {editorSettings.showPreview && (
            <div className='flex-1 bg-neutral-900 px-4 rounded-md w-1/2 scrollable'>
              <CodePreview />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
