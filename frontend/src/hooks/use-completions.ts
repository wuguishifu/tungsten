import { getName } from '@/lib/file-utils';
import { DataLeaf, useData } from '@/providers/data/provider';
import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { useCallback, useMemo } from 'react';

export default function useCompletions() {
  const { files } = useData();

  const tagOptions = useMemo(() => {
    const tagOptions: Completion[] = [];

    function addTagOption(leaf: DataLeaf | null) {
      if (!leaf) return;
      if (leaf.type === 'directory') {
        leaf.children.forEach(addTagOption);
      } else {
        tagOptions.push({
          label: `[[${leaf.path}]]`,
          type: 'keyword',
          apply: '[[' + getName(leaf.path),
          detail: leaf.dirPath,
          displayLabel: getName(leaf.name),
        });
      }
    }

    addTagOption(files);

    return tagOptions;
  }, [files]);

  const fileCompletions = useCallback((context: CompletionContext): CompletionResult | null => {
    const nodeBefore = syntaxTree(context.state).resolve(context.pos, -1);
    const textBefore = context.state.sliceDoc(nodeBefore.from, context.pos);
    const tagBefore = /\[\[\w*$/.exec(textBefore);
    if (!tagBefore && !context.explicit) return null;
    return {
      from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
      options: tagOptions,
      validFor: /(\[\[.*)/,
    } satisfies CompletionResult;
  }, [tagOptions]);

  return fileCompletions;
}
