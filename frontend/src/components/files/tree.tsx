import { getName } from '@/lib/file-utils';
import { useAuth } from '@/providers/auth-provider';
import { DataLeaf, useData } from '@/providers/data-provider';
import { File, Folder } from 'lucide-react';
import { createContext, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type TreeContextProps = {
  selectedFile: string | null;
  selectFile: (path: string) => void;
}

const TreeContext = createContext({} as TreeContextProps);

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

  const value = {
    selectedFile,
    selectFile,
  };

  return (
    <TreeContext.Provider value={value}>
      {files
        ? <TreeLeaf
          leaf={files}
          root
        />
        : null
      }
    </TreeContext.Provider>
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
  } = useContext(TreeContext);

  const formattedName = leaf.type === 'file' ? getName(leaf.name) : leaf.name;

  return (
    <div>
      {!root && (
        <div
          data-selected={selectedFile === leaf.path}
          className='flex flex-row items-center cursor-pointer hover:bg-neutral-600 pr-2 py-1 rounded-sm group data-[selected=true]:bg-neutral-600 mt-0.5'
          style={{ paddingLeft: indentation * 16 + 8, gap: 4 }}
          onClick={leaf.type === 'file'
            ? () => selectFile(leaf.path)
            : undefined
          }
        >
          {leaf.type === 'file'
            ? <File size={16} strokeWidth={2} />
            : <Folder size={16} strokeWidth={2} />
          }
          <span className='group-hover:text-neutral-100 text-sm group-data-[selected=true]:text-neutral-100 text-neutral-400'>
            {formattedName}
          </span>
        </div>
      )}
      {(leaf.type === 'directory') && (
        leaf.children.map((child) => {
          return (
            <TreeLeaf
              key={child.path}
              leaf={child}
              indentation={root ? 0 : indentation + 1}
            />
          )
        })
      )}
    </div>
  );
}
