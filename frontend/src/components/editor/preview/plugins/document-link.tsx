import { visit } from 'unist-util-visit';

export function remarkLinkBrackets() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const linkRegex = /\[\[([^\]]+)\]\]/g;
      let match;
      const nodes = [];
      let lastIndex = 0;

      while ((match = linkRegex.exec(value)) !== null) {
        if (match.index > lastIndex) {
          nodes.push({
            type: 'text',
            value: value.slice(lastIndex, match.index),
          });
        }

        const matchParts = match[1].split('|');
        let url = matchParts[0];
        if (url.startsWith('/')) {
          url = url.slice(1);
        }

        let label;
        if (matchParts[1]) {
          label = matchParts[1];
        } else {
          const parts = matchParts[0].split('/');
          label = parts[parts.length - 1];
        }

        nodes.push({
          type: 'link',
          url,
          children: [{
            type: 'text',
            value: label,
          }],
          data: {
            hProperties: {
              className: 'internal-document-link',
            },
          },
        });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < value.length) {
        nodes.push({
          type: 'text',
          value: value.slice(lastIndex),
        });
      }

      if (nodes.length > 0) {
        parent.children.splice(index, 1, ...nodes);
        return (index ?? 0) + nodes.length;
      }
    });
  };
}
