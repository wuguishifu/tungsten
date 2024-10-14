import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import useShiftShift from '@/hooks/use-shiftshift';
import { getName } from '@/lib/file-utils';
import { DataLeaf } from '@/providers/data/provider';
import useSearch from '@/providers/data/use-search';
import { useEditor } from '@/providers/editor-provider';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useCallback, useState } from 'react';
import { DialogTitle } from '../ui/dialog';

export default function ShiftShift() {
  const { selectFile } = useEditor();

  const [open, setOpen] = useState(false);
  useShiftShift(() => setOpen(o => !o));

  const [query, setQuery] = useState('');
  const results = useSearch(query);

  const onSelect = useCallback((result: DataLeaf) => {
    setOpen(false);
    selectFile(result.path);
  }, [selectFile]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <DialogTitle>
          File Search
        </DialogTitle>
      </VisuallyHidden>
      <Command loop shouldFilter={false}>
        <CommandInput
          placeholder='Search for a file...'
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No files found.</CommandEmpty>
          <CommandGroup>
            {results.slice(0, 10).map(result => (
              <SearchResult
                onSelect={onSelect}
                query={query}
                result={result}
                key={result.path}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

type SearchResultProps = {
  result: DataLeaf;
  query: string;
  onSelect: (result: DataLeaf) => void;
}

function SearchResult(props: SearchResultProps) {
  const { result, query, onSelect } = props;

  const queryRegex = new RegExp(`(${query})`, 'gi');

  const name = getName(result.name);
  const parts = name.split(queryRegex);
  const dirParts = result.path
    ? result.path.split(queryRegex)
    : ['./'];

  return (
    <CommandItem
      className='cursor-pointer'
      onSelect={() => onSelect(result)}
    >
      <div>
        <p className='m-0 p-0 truncate text-sm text-neutral-400 group-hover:text-neutral-100'>
          {parts
            .filter(part => part.length)
            .map((part, index) => (
              <span
                data-match={part.toLowerCase() === query.toLowerCase()}
                key={index}
                className='data-[match=true]:underline underline-offset-2'
              >
                {part}
              </span>
            ))
          }
        </p>
        <p className='m-0 p-0 truncate text-xs text-neutral-600 group-hover:text-neutral-500'>
          {dirParts
            .filter(part => part.length)
            .map((part, index) => (
              <span
                data-match={part.toLowerCase() === query.toLowerCase()}
                key={index}
                className='data-[match=true]:underline underline-offset-2'
              >
                {part}
              </span>
            ))
          }
        </p>
      </div>
    </CommandItem>
  );
}
