import { ItemTypes } from '@/lib/drag';
import { cleanPath, fileExists, getName } from '@/lib/file-utils';
import { useAuth } from '@/providers/auth-provider';
import { DataLeaf, DataType, useData } from '@/providers/data/provider';
import { ChevronDown, ChevronRight, FilePlus, FolderInput, FolderMinus, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '../ui/context-menu';
import AddItem from './add-item';
import DeleteDialog from './delete-dialog';
import MoveItemDialog from './move-item';
import RenameItem from './rename-item';
import RootAddItem from './root-add-item';

type TreeContextProps = {
  selectedFile: string | null;
  selectFile: (path: string) => void;
  showDeleteDialog: (props: { path: string, type: DataType, name: string }) => void;
  moveItem: (props: { originalItem: DataLeaf, toDir: DataLeaf }) => Promise<boolean>;
  showMoveDialog: (item: DataLeaf) => void;
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
    navigate(cleanPath(`/${username}/${path}`));
  }, [navigate, username]);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ path: string, type: DataType, name: string } | null>(null);
  const showDeleteDialog = useCallback((props: { path: string, type: DataType, name: string; }) => {
    setDeleteItem(props);
    setDeleteDialogVisible(true);
  }, []);

  const [moveDialogVisible, setMoveDialogVisible] = useState(false);
  const [selectedMoveItem, setSelectedMoveItem] = useState<DataLeaf | null>(null);
  const showMoveDialog = useCallback((item: DataLeaf) => {
    setSelectedMoveItem(item);
    setMoveDialogVisible(true);
  }, []);

  const moveItem = useCallback(async (props: { originalItem: DataLeaf, toDir: DataLeaf }): Promise<boolean> => {
    const { originalItem, toDir: _toDir } = props;
    const toDir = { ..._toDir };
    if (toDir.type === 'file') return false;
    toDir.children = toDir.children.map(child => {
      const newChild = { ...child };
      if (newChild.type === 'directory') {
        newChild.children = [];
      }
      return newChild;
    });
    const newPath = `${toDir.dirPath}/${originalItem.name}`;
    if (toDir.children.some(child => child.path === newPath)) {
      toast.error('An item with the same name already exists in the destination directory.');
      return false;
    }
    try {
      if (originalItem.type === 'file') {
        await moveFile(originalItem.path, newPath);
        if (selectedFile === originalItem.path) {
          navigate(cleanPath(`/${username}/${newPath}`));
        }
      } else {
        await moveDirectory(originalItem.path, newPath);
        if (!selectedFile) return true;
        if (fileExists(selectedFile, originalItem)) {
          navigate(`/${username}`);
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
      return false;
    }
  }, [username, selectedFile, moveFile, moveDirectory, navigate]);

  const value = {
    selectedFile,
    selectFile,
    showDeleteDialog,
    moveItem,
    showMoveDialog,
  };

  return (
    <>
      <DeleteDialog
        open={deleteDialogVisible}
        onOpenChange={setDeleteDialogVisible}
        {...deleteItem}
      />
      <MoveItemDialog
        open={moveDialogVisible}
        onOpenChange={setMoveDialogVisible}
        item={selectedMoveItem}
        moveItem={moveItem}
      />
      <TreeContext.Provider value={value}>
        {files
          ? <TreeLeaf leaf={files} root />
          : <div className='flex-1' />
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
    showMoveDialog,
  } = useContext(TreeContext);

  const {
    expanded,
    collapse,
    expand,
  } = useData();

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
  }), [leaf]);

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
  }), [moveItem, leaf, isDragging]);

  function attachDropRef(element: HTMLDivElement | null) {
    if (element && leaf.type === 'directory') {
      drop(element);
    }
  }

  const isExpanded = expanded.has(leaf.path);

  return (
    <div
      data-highlighted={isOver && canDrop}
      data-root={root}
      className='data-[highlighted=true]:bg-blue-400/15 rounded-lg data-[root=true]:h-full data-[root=true]:flex data-[root=true]:flex-col'
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
                  : () => {
                    if (isExpanded) {
                      collapse(leaf.path);
                    } else {
                      expand(leaf.path);
                    }
                  }
                }
              >
                {leaf.type === 'directory' && (
                  isExpanded
                    ? <ChevronDown size={16} className='min-w-4 min-h-4' />
                    : <ChevronRight size={16} className='min-w-4 min-h-4' />
                )}
                <p
                  className='data-[type=file]:pl-4 truncate'
                  data-type={leaf.type}
                >
                  {formattedName}
                </p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent onCloseAutoFocus={e => e.preventDefault()}>
              <ContextMenuItem
                autoFocus={false}
                className='select-none'
                onClick={e => {
                  e.stopPropagation();
                  setRenaming(true);
                }}
              >
                <Pencil size={16} strokeWidth={2} />
                <span className='ml-2'>
                  rename
                </span>
              </ContextMenuItem>
              <ContextMenuItem
                autoFocus={false}
                className='select-none'
                onClick={e => {
                  e.stopPropagation();
                  showMoveDialog(leaf);
                }}
              >
                <FolderInput size={16} strokeWidth={2} />
                <span className='ml-2'>
                  move
                </span>
              </ContextMenuItem>
              {leaf.type === 'directory' && (
                <ContextMenuItem
                  autoFocus={false}
                  className='select-none'
                  onClick={e => {
                    e.stopPropagation();
                    if (isExpanded) {
                      collapse(leaf.path);
                    } else {
                      expand(leaf.path);
                    }
                  }}
                >
                  {expanded.has(leaf.path)
                    ? <FolderPlus size={16} strokeWidth={2} />
                    : <FolderMinus size={16} strokeWidth={2} />
                  }
                  <span className='ml-2'>
                    {isExpanded ? 'collapse' : 'expand'}
                  </span>
                </ContextMenuItem>
              )}
              <ContextMenuSeparator />
              <ContextMenuItem
                autoFocus={false}
                className='select-none'
                onClick={e => {
                  e.stopPropagation();
                  setAddingItem('file');
                }}>
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
                }}>
                <FolderPlus size={16} strokeWidth={2} />
                <span className='ml-2'>
                  new directory
                </span>
              </ContextMenuItem>
              <ContextMenuSeparator />
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
                <Trash2 size={16} strokeWidth={2} />
                <span className='ml-2'>
                  delete
                </span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      )}
      {addingItem && (
        <AddItem
          dirPath={leaf.dirPath}
          itemType={addingItem}
          indentation={(leaf.type === 'directory' && !root) ? indentation + 1 : indentation}
          stopEditing={() => setAddingItem(false)}
        />
      )}
      {(leaf.type === 'directory' && (isExpanded || root)) && (
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
      {root && <RootAddItem />}
    </div>
  );
}
