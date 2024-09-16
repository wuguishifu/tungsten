import { useEditor } from '@/providers/editor-provider';
import { Remarkable } from 'remarkable';

export default function CodePreview() {
  const { file } = useEditor();

  const md = new Remarkable({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    typographer: false,
    quotes: '“”‘’',
  });

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
