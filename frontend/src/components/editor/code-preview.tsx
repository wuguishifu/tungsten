import { useEditor } from '@/providers/editor-provider';
import md from './remarkable';

export default function CodePreview() {
  const { file } = useEditor();

  return (
    <div className='flex-1'>
      {file && (
        <div
          className='md-preview'
          dangerouslySetInnerHTML={{ __html: md.render(file) }}
        />
      )}
    </div>
  );
}
