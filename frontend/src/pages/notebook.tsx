import Editor from '@/components/editor/main';
import Sidebar from '@/components/sidebar';
import { useSettings } from '@/providers/settings-provider';

export default function Notebook() {
  const { editorSettings } = useSettings();

  console.log(editorSettings.showSidebar);

  return (
    <div className='flex flex-1 p-4 pr-0 gap-4 bg-neutral-950 overflow-hidden'>
      {editorSettings.showSidebar && <Sidebar />}
      <Editor />
    </div>
  );
}
