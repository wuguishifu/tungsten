import { useAuth } from '@/providers/auth-provider';
import { DataLeaf, useData } from '@/providers/data/provider';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type SearchResultsProps = {
  search: string;
};

export default function SearchResults(props: SearchResultsProps) {
  const { search } = props;
  const { files } = useData();
  const { username } = useAuth();
  const navigate = useNavigate();


  const searchResults = useMemo(() => {
    const searchQuery = search.toLowerCase();
    const results: DataLeaf[] = [];

    const searchFiles = (leaf: DataLeaf) => {
      if (leaf.name.toLowerCase().includes(searchQuery) && leaf.type === 'file') {
        results.push(leaf);
      }

      if (leaf.type === 'directory') {
        leaf.children.forEach(searchFiles);
      }
    };

    if (files?.type === 'directory') {
      files?.children.forEach(searchFiles);
    }

    return results;
  }, [search, files]);

  const selectFile = useCallback((path: string) => {
    navigate(`/${username}/${path}`.replace(/\/\//g, '/'));
  }, [navigate, username]);

  return (
    <div className='flex-1 scrollable overflow-x-hidden w-64 max-w-72 pr-2'>
      {searchResults.map(result => (
        <SearchResult
          result={result}
          onClick={() => selectFile(result.path)}
        />
      ))}
    </div>
  );
}

type SearchResultProps = {
  result: DataLeaf;
  onClick: () => void;
};

function SearchResult(props: SearchResultProps) {
  const { result, onClick } = props;

  return (
    <div
      className='rounded-sm group hover:bg-neutral-800 px-2 py-1 cursor-pointer mt-0.5'
      onClick={onClick}
    >
      <p className='m-0 p-0 truncate text-sm text-neutral-400 group-hover:text-neutral-100'>
        {result.name}
      </p>
      <p className='m-0 p-0 truncate text-xs text-neutral-600 group-hover:text-neutral-500'>
        {result.path}
      </p>
    </div>
  );
}
