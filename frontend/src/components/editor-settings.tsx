import { useSettings } from '@/providers/settings-provider';
import { Switch } from './ui/switch';

export default function EditorSettings() {
  const { editorSettings, updateEditorSettings } = useSettings();

  return (
    <div>
      <h1 className='text-white text-xl'>Editor Settings</h1>
      <div
        className='flex flex-row items-center gap-2 cursor-pointer mt-8'
        onClick={() => updateEditorSettings('vimEnabled', !editorSettings.vimEnabled)}
      >
        <Switch checked={editorSettings.vimEnabled} />
        <h6 className='text-white text-sm'>Vim Input</h6>
      </div>
    </div>
  );
}
