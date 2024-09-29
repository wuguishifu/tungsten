import markdownIt from 'markdown-it';
import MarkdownItLabel from 'markdown-it-label';
import NamedCodeBlocks from 'markdown-it-named-code-blocks';

// @ts-expect-error i have no type declaration file for this package :C
import mk from '@iktakahiro/markdown-it-katex';

const md = new markdownIt({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  typographer: false,
  quotes: '“”‘’',
  linkify: true,
});

md.use(mk);
md.use(NamedCodeBlocks)
md.use(MarkdownItLabel);

md.renderer.rules.link_open = (tokens, idx) => {
  const hrefIndex = tokens[idx].attrIndex('href');
  const href = tokens[idx].attrs?.[hrefIndex][1] ?? '#';
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">
      <span class="md-preview-link-text">`;
}

md.renderer.rules.link_close = () => {
  return (
    `</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-external-link"
          style="margin-left: 1px; display: inline; margin-bottom: 2px;"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>`
  );
}

export default md;
