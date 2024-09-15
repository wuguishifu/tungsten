import { getName } from '@/lib/file-utils';
import { useAuth } from '@/providers/auth-provider';
import { FilePath, useData } from '@/providers/data-provider';
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
        ? <TreeComponent root name='_root' children={files} />
        : null
      }
    </TreeContext.Provider>
  );
}

type TreeComponentProps = {
  name: string;
  children: { [name: string]: string | FilePath } | string;
  indentation?: number;
  root?: boolean;
}

function TreeComponent(props: TreeComponentProps) {
  const {
    root,
    name,
    children,
    indentation = 0,
  } = props;

  return (
    <div>
      {!root && (
        <TreeLabel
          name={name}
          indentation={indentation}
          type={typeof children === 'string' ? 'file' : 'directory'}
          filePath={typeof children === 'string' ? children : undefined}
        />
      )}
      {(children && typeof children === 'object')
        ? Object.keys(children).map((name) => {
          const child = children[name];
          return (
            <TreeComponent
              key={name}
              name={name}
              children={child}
              indentation={root ? 0 : indentation + 1}
            />
          );
        })
        : null
      }
    </div>
  );
}

type TreeLabelProps = {
  name: string;
  indentation: number;
  type: 'file' | 'directory';
  filePath?: string;
}

function TreeLabel(props: TreeLabelProps) {
  const {
    name,
    indentation,
    type,
    filePath,
  } = props;

  const {
    selectedFile,
    selectFile,
  } = useContext(TreeContext);

  const formattedName = type === 'directory'
    ? name.slice(0, -1)
    : getName(name);
  const selected = selectedFile === filePath;

  return (
    <div
      data-selected={selected}
      className='flex flex-row items-center cursor-pointer hover:bg-neutral-600 pr-2 py-1 rounded-sm group data-[selected=true]:bg-neutral-600 mt-0.5'
      style={{ paddingLeft: indentation * 16 + 8, gap: 4 }}
      onClick={type === 'file'
        ? () => selectFile(filePath!)
        : undefined
      }
    >
      {type === 'file'
        ? <File size={16} strokeWidth={2} />
        : <Folder size={16} strokeWidth={2} />
      }
      <span className='cursor-pointer group-hover:text-neutral-100 text-sm group-data-[selected=true]:text-neutral-100 text-neutral-400'>
        {formattedName}
      </span>
    </div>
  );
}
