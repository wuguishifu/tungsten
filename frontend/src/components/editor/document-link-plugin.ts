import markdownIt, { StateInline } from 'markdown-it/index.js';

function documentLinkPlugin(md: markdownIt) {
  function linkifyRule(state: StateInline, silent: boolean): boolean {
    const start = state.pos;
    const max = state.posMax;

    // check for open [[
    // 0x5B is [
    if (state.src.charCodeAt(start) !== 0x5B || start + 1 >= max) {
      return false;
    }
    if (state.src.charCodeAt(start + 1) !== 0x5B) {
      return false;
    }

    let end = start + 2;

    // check for close ]]
    // 0x5D is ]
    while (end < max) {
      if (
        state.src.charCodeAt(end) === 0x5D &&
        end + 1 < max &&
        state.src.charCodeAt(end + 1) === 0x5D
      ) {
        break;
      }
      end++;
    }

    if (end >= max) {
      return false;
    }

    const content = state.src.slice(start + 2, end);

    if (silent) {
      return true;
    }

    state.pos = end + 2;

    const tokenOpen = state.push('link_open', 'a', 1);
    tokenOpen.attrs = [['href', content + '.md'], ['target', '_self']];

    const tokenText = state.push('text', '', 0);
    const parts = content.split('/');
    const lastPart = parts[parts.length - 1];
    tokenText.content = lastPart;

    state.push('link_close', 'a', -1);

    return true;
  }

  md.inline.ruler.before('emphasis', 'linkify', linkifyRule);
}

export default documentLinkPlugin;
