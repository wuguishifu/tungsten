import { EditorView, Prec } from '@uiw/react-codemirror';

const EditorTheme = Prec.highest(
  EditorView.theme({
    '&': {
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      height: '100%',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-scroller': {
      overflow: 'visible',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      border: 'none',
    },
    '.cm-cursor': {
      borderLeft: '1px solid #5E33F6',
    },
    // bottom terminal (vim)
    '.cm-panels, .cm-panels-bottom': {
      borderTop: 'none !important',
      backgroundColor: '#202020',
      padding: '0.2em 0.4em',
      borderRadius: '0.4em',
    },
    // vim fatty cursor
    '.cm-fat-cursor': {
      position: 'absolute',
      background: '#5E33F6',
      border: 'none',
      whiteSpace: 'pre',
      color: '#FAFAFA !important',
    },
    '&:not(.cm-focused) .cm-fat-cursor': {
      background: 'none',
      outline: 'solid 1px #5E33F6',
      color: 'transparent !important',
    },
  }),
);

export default EditorTheme;
