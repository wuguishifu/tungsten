import Editor from '@/components/editor/main';
import ShiftShift from '@/components/files/shiftshift';
import Sidebar from '@/components/sidebar';
import { useSettings } from '@/providers/settings-provider';

export default function Notebook() {
  const { editorSettings } = useSettings();

  return (
    <>
      <ShiftShift />
      <div className='flex flex-1 p-4 pr-0 gap-4 bg-neutral-950 overflow-hidden'>
        {editorSettings.showSidebar && <Sidebar />}
        <Editor />
      </div>
    </>
  );
}
