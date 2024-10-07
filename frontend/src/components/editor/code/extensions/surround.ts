import { EditorView } from '@uiw/react-codemirror';

type Options = {
  remove: RegExp;
} & (
    | { startMark: string; endMark: string }
    | { mark: string }
  );

export default function surround(view: EditorView, options: Options) {
  const remove = options.remove;
  const startMark = ('startMark' in options) ? options.startMark : options.mark;
  const endMark = ('endMark' in options) ? options.endMark : options.mark;

  const { from, to, empty } = view.state.selection.main;
  const selectedText = view.state.doc.sliceString(from, to);

  if (remove.test(selectedText)) {
    const insert = selectedText.slice(startMark.length, selectedText.length - endMark.length);
    view.dispatch({
      changes: {
        from,
        to,
        insert
      },
      selection: {
        anchor: from,
        head: to - startMark.length - endMark.length
      },
    });
    return true;
  }

  const insert = empty ? `${startMark}${endMark}` : `${startMark}${selectedText}${endMark}`;

  view.dispatch({
    changes: {
      from,
      to,
      insert
    },
    selection: {
      anchor: from,
      head: from + insert.length,
    },
  });

  return true;
}
