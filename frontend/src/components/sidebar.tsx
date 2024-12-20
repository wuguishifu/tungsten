import { ItemType, useData } from '@/providers/data/provider';
import { RootAddItemContext } from '@/providers/root-add-item-context';
import { FilePlus, FolderPlus, ImagePlus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import RecentlyDeleted from './files/recently-deleted';
import SearchResults from './files/search-results';
import Tree from './files/tree';
import VersionInfo from './files/version-info';
import { Button } from './ui/button';

export default function Sidebar() {
  const [addingItem, setAddingItem] = useState<ItemType | false>(false);
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
            onClick={() => setAddingItem('text')}
            variant='secondary'
            className='flex-1'
          >
            <FilePlus size={16} strokeWidth={2} />
          </Button>
          <Button
            onClick={() => setAddingItem('drawing')}
            variant='secondary'
            className='flex-1'
          >
            <ImagePlus size={16} strokeWidth={2} />
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
      <VersionInfo />
    </div>
  );
}
