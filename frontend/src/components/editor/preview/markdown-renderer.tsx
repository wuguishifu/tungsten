import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import Anchor from './blocks/anchor';
import { remarkLinkBrackets } from './plugins/document-link';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      className='md-preview'
      children={content}
      remarkPlugins={[
        remarkMath,
        remarkLinkBrackets,
      ]}
      rehypePlugins={[
        rehypeRaw,
        rehypeKatex,
        rehypeHighlight,
      ]}
      components={{
        a: props => <Anchor {...props} />,
      }}
    />
  );
}
