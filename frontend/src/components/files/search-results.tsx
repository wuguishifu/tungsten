import { getName } from '@/lib/file-utils';
import { DataLeaf } from '@/providers/data/provider';
import useSearch from '@/providers/data/use-search';
import { useEditor } from '@/providers/editor-provider';

type SearchResultsProps = {
  search: string;
};

export default function SearchResults(props: SearchResultsProps) {
  const { search } = props;
  const searchResults = useSearch(search)
  const { selectFile } = useEditor();

  return (
    <div className='flex-1 scrollable overflow-x-hidden w-64 max-w-72 pr-2'>
      {searchResults.map(result => (
        <SearchResult
          key={result.path}
          result={result}
          query={search}
          onClick={() => selectFile(result.path)}
        />
      ))}
    </div>
  );
}

type SearchResultProps = {
  result: DataLeaf;
  query: string;
  onClick: () => void;
};

function SearchResult(props: SearchResultProps) {
  const { result, onClick, query } = props;

  const queryRegex = new RegExp(`(${query})`, 'gi');

  const name = getName(result.name);
  const parts = name.split(queryRegex);
  const dirParts = result.path
    ? result.path.split(queryRegex)
    : ['./'];

  return (
    <div
      className='rounded-sm group hover:bg-neutral-800 px-2 py-1 cursor-pointer mt-0.5'
      onClick={onClick}
    >
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
          ))}
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
  );
}
