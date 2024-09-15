import { getName } from '@/lib/file-utils';
import { useAuth } from '@/providers/auth-provider';
import { DataLeaf, DataType, useData } from '@/providers/data-provider';
import { File, Folder } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import AddItem from './add-item';
import DeleteDialog from './delete-dialog';

type TreeContextProps = {
  selectedFile: string | null;
  selectFile: (path: string) => void;
  showDeleteDialog: (props: { path: string, type: DataType, name: string }) => void;
}

const TreeContext = createContext({} as TreeContextProps);

const textClassname = 'group-hover:text-neutral-100 text-sm group-data-[selected=true]:text-neutral-100 text-neutral-400';

export default function Tree() {
  const { files } = useData();
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

  const value = {
    selectedFile,
    selectFile,
    showDeleteDialog,
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
  } = useContext(TreeContext);

  const [addingItem, setAddingItem] = useState<false | 'file' | 'directory'>(false);

  const formattedName = leaf.type === 'file' ? getName(leaf.name) : leaf.name;

  return (
    <div
      onContextMenu={e => e.preventDefault()}
      onClick={e => e.stopPropagation()}
    >
      {!root && (
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-selected={selectedFile === leaf.path}
              className='flex flex-row items-center cursor-pointer hover:bg-neutral-800 pr-2 py-1 gap-1 rounded-sm group data-[selected=true]:bg-neutral-700 mt-0.5'
              style={{ paddingLeft: indentation * 16 + 8 }}
              onClick={leaf.type === 'file'
                ? () => selectFile(leaf.path)
                : undefined
              }
            >
              {leaf.type === 'file'
                ? <File size={16} className={textClassname} />
                : <Folder size={16} className={textClassname} />
              }
              <span className={textClassname}>
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
