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
    linkify: true,
  });

  md.renderer.rules.link_open = (tokens, idx) => {
    const href = tokens[idx].href;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
  }

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
