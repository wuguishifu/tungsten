import { RootAddItemContext } from '@/providers/root-add-item-context';
import { FilePlus, FolderPlus } from 'lucide-react';
import { useContext } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import AddItem from './add-item';

export default function RootAddItem() {
  const { addingItem, setAddingItem } = useContext(RootAddItemContext)

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
            <FilePlus size={16} strokeWidth={2} />
            <span className='ml-2'>
              new file
            </span>
          </ContextMenuItem>
          <ContextMenuItem
            autoFocus={false}
            className='select-none'
            onClick={e => {
              e.stopPropagation();
              setAddingItem('directory');
            }}
          >
            <FolderPlus size={16} strokeWidth={2} />
            <span className='ml-2'>
              new directory
            </span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
