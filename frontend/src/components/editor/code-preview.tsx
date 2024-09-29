import { useEditor } from '@/providers/editor-provider';
import namedCodeBlocks from 'markdown-it-named-code-blocks';
import md from './remarkable';

const parser = md.use(namedCodeBlocks);

export default function CodePreview() {
  const { file } = useEditor();

  return (
    <div className='flex-1'>
      {file && (
        <div
          className='md-preview'
          dangerouslySetInnerHTML={{ __html: parser.render(file) }}
        />
      )}
    </div>
  );
}
