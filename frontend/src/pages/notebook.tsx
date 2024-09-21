import Editor from '@/components/editor/main';
import Sidebar from '@/components/sidebar';

export default function Notebook() {
  return (
    <div className='flex flex-1 p-4 pr-0 gap-4 bg-neutral-950 overflow-hidden'>
      <Sidebar />
      <Editor />
    </div>
  );
}
