import { DataType, useData } from '@/providers/data/provider';
import { RootAddItemContext } from '@/providers/root-add-item-context';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { FilePlus, FolderPlus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import RecentlyDeleted from './files/recently-deleted';
import SearchResults from './files/search-results';
import Tree from './files/tree';
import { Button } from './ui/button';

export default function Sidebar() {
  const [addingItem, setAddingItem] = useState<DataType | false>(false);
  const [search, setSearch] = useState('');
  const { deleted } = useData();

  const input = useRef<HTMLInputElement>(null);

  return (
    <div className='w-72 max-w-72 bg-neutral-900 px-2 py-4 h-full rounded-lg flex flex-col'>
      <div className='flex flex-row items-center pb-1 gap-2 max-w-64'>
        <p className='text-neutral-400 cursor-pointer' onClick={() => input.current?.focus()}>
          Search:
        </p>
        <input
          ref={input}
          className='outline-none bg-transparent placeholder:text-neutral-700 flex-1 flex-shrink w-0'
          value={search}
          placeholder='query'
          onChange={e => setSearch(e.target.value)}
        />
        {!!search.length && (
          <X
            onClick={() => {
              setSearch('');
              input.current?.focus();
            }}
            className='size-4 min-w-4 min-h-4 cursor-pointer'
          />
        )}
      </div>
      <div className='h-0.5 w-full bg-secondary rounded-full' />
      {search.length ? (
        <SearchResults search={search} />
      ) : (
        <RootAddItemContext.Provider value={{ addingItem, setAddingItem }}>
          <div className='flex-1 scrollable overflow-x-hidden w-64 max-w-72 pr-2'>
            <Tree />
          </div>
        </RootAddItemContext.Provider>
      )
      }
      <div
        className='space-y-2 pt-2'
        onContextMenu={e => e.preventDefault()}
      >
        <div className='flex flex-row items-center gap-2'>
          <Button
            onClick={() => setAddingItem('file')}
            variant='secondary'
            className='flex-1'
          >
            <FilePlus size={16} strokeWidth={2} />
          </Button>
          <Button
            onClick={() => setAddingItem('directory')}
            variant='secondary'
            className='flex-1'
          >
            <FolderPlus size={16} strokeWidth={2} />
          </Button>
        </div>
        <div className='h-0.5 w-full bg-secondary rounded-full' />
      </div>
      {!!deleted?.length && <RecentlyDeleted />}
      <div className='flex flex-row items-centered justify-between pt-4'>
        <a
          href='https://github.com/wuguishifu/tungsten'
          className='text-xs text-neutral-700 flex flex-row items-center'
          target='_blank'
        >
          <span>
            View on GitHub
          </span>
          <GitHubLogoIcon className='ml-2' />
        </a>
        <a
          href='https://github.com/wuguishifu/tungsten/blob/master/CHANGELOG.md#version-130-2024-10-01'
          className='text-xs text-neutral-700 flex flex-row items-center'
          target='_blank'
        >
          <span>
            Version 1.3.0
          </span>
        </a>
      </div>
    </div>
  );
}
