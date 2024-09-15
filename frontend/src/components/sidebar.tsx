import { useState } from 'react';
import AddItem from './files/add-item';
import Tree from './files/tree';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';

export default function Sidebar() {
  const [addingItem, setAddingItem] = useState<'directory' | 'file' | false>(false);

  return (
    <div className='w-72 bg-neutral-900 px-2 py-4 h-full rounded-lg flex flex-col'>
      <Tree />
      {addingItem && (
        <AddItem
          dirPath={'/'}
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
    </div >
  );
}
