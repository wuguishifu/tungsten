import { ItemTypes } from '@/lib/drag';
import { getName } from '@/lib/file-utils';
import { useAuth } from '@/providers/auth-provider';
import { DataLeaf, DataType, useData } from '@/providers/data-provider';
import { File, Folder } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import AddItem from './add-item';
import DeleteDialog from './delete-dialog';
import RenameItem from './rename-item';

type TreeContextProps = {
  selectedFile: string | null;
  selectFile: (path: string) => void;
  showDeleteDialog: (props: { path: string, type: DataType, name: string }) => void;
  moveItem: (props: { originalItem: DataLeaf, toDir: DataLeaf }) => void;
}

const TreeContext = createContext({} as TreeContextProps);

export default function Tree() {
  const { files, moveFile, moveDirectory } = useData();
  const { username } = useAuth();

  const navigate = useNavigate();

  const {
    '*': selectedFile = null,
  } = useParams();

  const selectFile = useCallback((path: string) => {
    navigate(`/${username}/${path}`);
  }, [navigate, username]);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ path: string, type: DataType, name: string } | null>(null);
  const showDeleteDialog = useCallback((props: { path: string, type: DataType, name: string; }) => {
    setDeleteItem(props);
    setDeleteDialogVisible(true);
  }, []);

  const moveItem = (props: { originalItem: DataLeaf, toDir: DataLeaf }) => {
    const { originalItem, toDir: _toDir } = props;
    const toDir = { ..._toDir };
    if (toDir.type === 'file') return;
    toDir.children = toDir.children.map(child => {
      const newChild = { ...child };
      if (newChild.type === 'directory') {
        newChild.children = [];
      }
      return newChild;
    });
    const newPath = `${toDir.dirPath}/${originalItem.name}`;
    if (toDir.children.some(child => child.path === newPath)) {
      return toast.error('An item with the same name already exists in the destination directory.');
    }
    try {
      if (originalItem.type === 'file') {
        moveFile(originalItem.path, newPath);
      } else {
        moveDirectory(originalItem.path, newPath);
      }
      // TODO: fix this
      console.log({ selectedFile, originalPath: originalItem.path });
      if (selectedFile === originalItem.path) {
        navigate(`/${username}`)
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  const value = {
    selectedFile,
    selectFile,
    showDeleteDialog,
    moveItem,
  };

  return (
    <>
      <DeleteDialog
        open={deleteDialogVisible}
        onOpenChange={setDeleteDialogVisible}
        {...deleteItem}
      />
      <TreeContext.Provider value={value}>
        {files
          ? <TreeLeaf
            leaf={files}
            root
          />
          : null
        }
      </TreeContext.Provider>
    </>
  );
}

type TreeLeafProps = {
  leaf: DataLeaf;
  root?: boolean;
  indentation?: number;
}

function TreeLeaf(props: TreeLeafProps) {
  const {
    leaf,
    root,
    indentation = 0,
  } = props;

  const {
    selectedFile,
    selectFile,
    showDeleteDialog,
    moveItem,
  } = useContext(TreeContext);

  const [addingItem, setAddingItem] = useState<false | 'file' | 'directory'>(false);
  const [renaming, setRenaming] = useState(false);

  const formattedName = leaf.type === 'file' ? getName(leaf.name) : leaf.name;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: leaf.type === 'file'
      ? ItemTypes.FILE
      : ItemTypes.DIRECTORY,
    item: leaf,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [
      ItemTypes.FILE,
      ItemTypes.DIRECTORY,
    ],
    drop: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return
      moveItem({
        originalItem: item,
        toDir: leaf,
      });
    },
    canDrop: (item: DataLeaf) => {
      if (item.dirPath === leaf.dirPath) return false;
      return true;
    },
    collect: monitor => ({
      isOver: (!!monitor.isOver({ shallow: true }) && !isDragging),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  function attachDropRef(element: HTMLDivElement | null) {
    if (element && leaf.type === 'directory') {
      drop(element);
    }
  }

  return (
    <div
      data-highlighted={isOver && canDrop}
      className='data-[highlighted=true]:bg-blue-400/15 rounded-lg'
      ref={attachDropRef}
      onContextMenu={e => e.preventDefault()}
      onClick={e => e.stopPropagation()}
    >
      {!root && (
        renaming ? (
          <RenameItem
            formattedName={formattedName}
            leaf={leaf}
            indentation={indentation}
            stopEditing={() => setRenaming(false)}
          />
        ) : (
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                ref={drag}
                data-selected={selectedFile === leaf.path}
                className='flex flex-row items-center cursor-pointer hover:bg-neutral-800 pr-2 py-1 gap-1 rounded-sm data-[selected=true]:bg-neutral-700 mt-0.5 hover:text-neutral-100 text-sm data-[selected=true]:text-neutral-100 text-neutral-400'
                style={{ paddingLeft: indentation * 16 + 8 }}
                onClick={leaf.type === 'file'
                  ? () => selectFile(leaf.path)
                  : undefined
                }
              >
                {leaf.type === 'file'
                  ? <File size={16} />
                  : <Folder size={16} />
                }
                <span>
                  {formattedName}
                </span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent onCloseAutoFocus={e => e.preventDefault()}>
              <ContextMenuItem
                autoFocus={false}
                className='select-none'
                onClick={e => {
                  e.stopPropagation();
                  setAddingItem('file');
                }}>
                new file
              </ContextMenuItem>
              <ContextMenuItem
                autoFocus={false}
                className='select-none'
                onClick={e => {
                  e.stopPropagation();
                  setAddingItem('directory');
                }}>
                new directory
              </ContextMenuItem>
              <ContextMenuItem
                autoFocus={false}
                className='select-none'
                onClick={e => {
                  e.stopPropagation();
                  setRenaming(true);
                }}
              >
                rename
              </ContextMenuItem>
              <ContextMenuItem
                autoFocus={false}
                className='select-none text-destructive data-[highlighted]:text-destructive'
                onClick={e => {
                  e.stopPropagation();
                  showDeleteDialog({
                    path: leaf.path,
                    type: leaf.type,
                    name: leaf.name,
                  });
                }}
              >
                delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      )}
      {addingItem && (
        <AddItem
          dirPath={leaf.dirPath}
          itemType={addingItem}
          indentation={leaf.type === 'directory' ? indentation + 1 : indentation}
          stopEditing={() => setAddingItem(false)}
        />
      )}
      {(leaf.type === 'directory') && (
        leaf.children
          .sort((a, b) => {
            if (a.type === 'directory' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'directory') return 1;
            return a.name.localeCompare(b.name)
          })
          .map((child) => (
            <TreeLeaf
              key={child.path}
              leaf={child}
              indentation={root ? 0 : indentation + 1}
            />
          ))
      )}
    </div>
  );
}
