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
      position: 'fixed',
      bottom: '2em !important',
      left: '10em',
      right: '10em',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    },
    '.cm-editor': {
      position: 'absolute',
      top: 0,
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
    // autocomplete tooltip
    '.cm-tooltip-autocomplete': {
      backgroundColor: 'rgb(23 23 23)',
      boxShadow: '0 0 16px rgba(0, 0, 0, 0.8)',
      padding: '8px',
      borderRadius: '8px'
    },
    '.cm-tooltip-autocomplete ul li': {
      padding: '8px 8px !important',
      borderRadius: '4px',
      color: 'rgb(163 163 163)',
      display: 'flex',
      flexDirection: 'column',
    },
    '.cm-tooltip-autocomplete ul li[aria-selected]': {
      backgroundColor: '#404040',
      color: 'rgb(245 245 245)'
      // backgroundColor: 'rgb(23 23 23)',
      // color: 'rgb(163 163 163)',
    },
    '.cm-tooltip-autocomplete ul li:hover': {
      backgroundColor: '#404040',
      color: 'rgb(245 245 245)'
    },
    '.cm-completionLabel': {
      fontSize: '1.1em',
    },
    '.cm-completionDetail': {
      marginLeft: 0,
      fontSize: '0.9em',
      color: 'rgb(123 123 123)',
      fontStyle: 'normal',
    },
    // scrollbar for tooltips
    '.cm-tooltip-autocomplete>ul': {
      paddingRight: '8px !important',
      maxWidth: 'min(900px, 95vw) !important',
      maxHeight: '20em !important',
    },
    '.cm-tooltip-autocomplete ul::-webkit-scrollbar': {
      backgroundColor: 'transparent',
      width: '8px',
    },
    '.cm-tooltip-autocomplete ul::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '.cm-tooltip-autocomplete ul::-webkit-scrollbar-thumb': {
      borderRadius: '4px',
      backgroundColor: '#404040',
    },
    '.cm-tooltip-autocomplete ul::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#545454',
      cursor: 'pointer',
    },
  }),
);

export default EditorTheme;
