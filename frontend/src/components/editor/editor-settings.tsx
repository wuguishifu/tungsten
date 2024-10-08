import { EditorSettings, useSettings } from '@/providers/settings-provider';
import { Switch } from '../ui/switch';
import { DialogTitle } from '../ui/dialog';

export default function EditorSettingsView() {
  return (
    <div>
      <DialogTitle>
        <span className='text-primary text-xl'>Editor Settings</span>
      </DialogTitle>
      <div className='space-y-4 mt-8'>
        <SettingRow accessorKey='vimEnabled'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-primary text-sm'>Vim Input</h6>
            </>
          )}
        </SettingRow>
        <SettingRow accessorKey='saveOnBlur'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-primary text-sm'>Save on Editor Unfocus</h6>
            </>
          )}
        </SettingRow>
        <SettingRow accessorKey='showEditor'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-primary text-sm'>Show Editor</h6>
            </>
          )}
        </SettingRow>
        <SettingRow accessorKey='showPreview'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-primary text-sm'>Show Preview</h6>
            </>
          )}
        </SettingRow>
        <SettingRow accessorKey='showSidebar'>
          {({ enabled }) => (
            <>
              <Switch checked={enabled} />
              <h6 className='text-primary text-sm'>Show Sidebar</h6>
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
