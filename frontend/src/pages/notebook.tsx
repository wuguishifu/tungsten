import Editor from '@/components/editor/main';
import Sidebar from '@/components/sidebar';

export default function Notebook() {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <Editor />
    </div>
  );
}
