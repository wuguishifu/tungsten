import Editor from '@/components/editor/main';
import Sidebar from '@/components/sidebar';

export default function Notebook() {
  return (
    <div className='flex h-full p-4 pr-0 gap-4'>
      <Sidebar />
      <Editor />
    </div>
  );
}
