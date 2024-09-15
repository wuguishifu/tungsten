import Editor from '@/components/editor/main';
import Sidebar from '@/components/sidebar';

export default function Notebook() {
  return (
    <div className='flex h-screen p-4 gap-4'>
      <Sidebar />
      <Editor />
    </div>
  );
}
