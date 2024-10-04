import { useEditor } from '@/providers/editor-provider';
import { useSettings } from '@/providers/settings-provider';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Menu, Settings } from 'lucide-react';
import { useRef } from 'react';
import Loading from '../suspense/loading';
import { buttonVariants } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Toggle } from '../ui/toggle';
import EditPlane from './code/edit-plane';
import EditorSettingsView from './editor-settings';
import PreviewPlane from './preview/preview-plane';

export default function Editor() {
  const { filename, filePath, loading, dirty } = useEditor();

  const { editorSettings, updateEditorSettings } = useSettings();

  const editor = useRef<ReactCodeMirrorRef>(null);

  return (
    <div className='h-full w-full flex flex-col pr-4 gap-4'>
      <div className='flex flex-row items-center justify-between px-4 py-2 bg-neutral-900 rounded-md'>
        <div className='flex flex-row items-center relative gap-2'>
          <Menu
            className='cursor-pointer text-neutral-400'
            onClick={() => updateEditorSettings('showSidebar', !editorSettings.showSidebar)}
          />
          <div className='space-y-1'>
            <h1 className='text-lg font-bold text-neutral-200 leading-4'>
              {filename}
            </h1>
            <p className='text-xs text-neutral-600'>
              /{filePath}
            </p>
          </div>
          {dirty && <div className='text-xs text-neutral-600 ml-2'>unsaved changes</div>}
        </div>
        <div className='flex flex-row items-center gap-2'>
          <Toggle
            pressed={editorSettings.showEditor}
            onPressedChange={(pressed) => updateEditorSettings('showEditor', pressed)}
            className='text-neutral-400 data-[state=on]:text-neutral-200'
          >
            Editor
          </Toggle>
          <Toggle
            pressed={editorSettings.showPreview}
            onPressedChange={(pressed) => updateEditorSettings('showPreview', pressed)}
            className='text-neutral-400 data-[state=on]:text-neutral-200'
          >
            Preview
          </Toggle>
          <Dialog
            onOpenChange={(focused) => {
              if (!focused) editor.current?.view?.contentDOM.focus();
            }}
          >
            <DialogTrigger className={buttonVariants({ variant: 'ghost' })}>
              <Settings className='size-4 cursor-pointer text-primary' />
            </DialogTrigger>
            <DialogContent
              onCloseAutoFocus={e => e.preventDefault()}
              aria-description='Editor Settings'
              aria-describedby={undefined}
            >
              <EditorSettingsView />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className='flex-1 flex gap-4 overflow-hidden'>
          {editorSettings.showEditor && (
            <div className='flex-1 bg-neutral-900 px-4 rounded-md w-1/2 scrollable'>
              <EditPlane ref={editor} />
            </div>
          )}
          {editorSettings.showPreview && (
            <div className='flex-1 bg-neutral-900 px-4 rounded-md w-1/2 scrollable'>
              <PreviewPlane />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
