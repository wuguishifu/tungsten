import { EditorSettings, useSettings } from '@/providers/settings-provider';
import { Switch } from './ui/switch';

export default function EditorSettingsView() {
  return (
    <div>
      <h1 className='text-white text-xl'>Editor Settings</h1>
      <div className='space-y-4 mt-8'>
        <SettingRow accessorKey='vimEnabled'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-white text-sm'>Vim Input</h6>
            </>
          )}
        </SettingRow>
        <SettingRow accessorKey='saveOnBlur'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-white text-sm'>Save on Editor Unfocus</h6>
            </>
          )}
        </SettingRow>
        <SettingRow accessorKey='showPreview'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-white text-sm'>Show Preview</h6>
            </>
          )}
        </SettingRow>
      </div>
    </div>
  );
}

type SettingRowProps = {
  accessorKey: keyof EditorSettings;
  children: (props: SettingRowComponentProps) => React.ReactNode;
}

type SettingRowComponentProps = {
  enabled: boolean;
}

function SettingRow(props: SettingRowProps) {
  const { accessorKey, children } = props;
  const { editorSettings, updateEditorSettings } = useSettings();

  return (
    <div
      className='flex flex-row items-center gap-2 cursor-pointer'
      onClick={() => updateEditorSettings(accessorKey, !editorSettings[accessorKey])}
    >
      {children({ enabled: !!editorSettings[accessorKey] })}
    </div>
  );
}
