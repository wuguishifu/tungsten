import { useEditor } from '@/providers/editor-provider';
import MarkdownRenderer from './markdown-renderer';

export default function PreviewPlane() {
  const { file } = useEditor();

  return (
    <div className='flex-1'>
      {file && (
        <MarkdownRenderer
          content={file}
        />
      )}
    </div>
  );
}
