import { DataType } from '@/providers/data-provider';
import { RootAddItemContext } from '@/providers/root-add-item-context';
import { FilePlus, FolderPlus } from 'lucide-react';
import { useState } from 'react';
import RecentlyDeleted from './files/recently-deleted';
import Tree from './files/tree';
import { Button } from './ui/button';

export default function Sidebar() {
  const [addingItem, setAddingItem] = useState<DataType | false>(false);

  return (
    <div className='w-72 bg-neutral-900 px-2 py-4 h-full rounded-lg flex flex-col'>
      <RootAddItemContext.Provider value={{ addingItem, setAddingItem }}>
        <Tree />
      </RootAddItemContext.Provider>
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
      <RecentlyDeleted />
    </div>
  );
}
