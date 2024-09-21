import { DataType } from '@/providers/data-provider';
import { useState } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import AddItem from './add-item';

export default function RootAddItem() {
  const [addingItem, setAddingItem] = useState<DataType | false>(false);

  return (
    <>
      {addingItem && (
        <AddItem
          dirPath='/'
          itemType={addingItem}
          indentation={0}
          stopEditing={() => setAddingItem(false)}
        />
      )}
      <ContextMenu>
        <ContextMenuTrigger className='flex-1' />
        <ContextMenuContent onCloseAutoFocus={e => e.preventDefault()}>
          <ContextMenuItem
            autoFocus={false}
            className='select-none'
            onClick={e => {
              e.stopPropagation();
              setAddingItem('file');
            }}
          >
            new file
          </ContextMenuItem>
          <ContextMenuItem
            autoFocus={false}
            className='select-none'
            onClick={e => {
              e.stopPropagation();
              setAddingItem('directory');
            }}
          >
            new directory
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
