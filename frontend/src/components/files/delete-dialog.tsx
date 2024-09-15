import { DataLeaf, DataType, useData } from '@/providers/data-provider';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { buttonVariants } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '../ui/dialog';

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name?: string;
  type?: DataType;
  path?: string;
};

export default function DeleteDialog(props: DeleteDialogProps) {
  const {
    open,
    onOpenChange,
    name,
    type,
    path,
  } = props;

  const { deleteFile, deleteDirectory } = useData();
  const { '*': filepath, username } = useParams();
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          Are you sure you want to delete the {type} "{name}"?
        </DialogTitle>
        <DialogDescription>
          This cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'ghost' })}>
            Cancel
          </DialogClose>
          <DialogClose
            className={buttonVariants({ variant: 'destructive' })}
            onClick={async () => {
              if (!path) return;
              try {
                let newFiles: DataLeaf | null = null;
                if (type === 'file') {
                  newFiles = await deleteFile(path);
                } else {
                  newFiles = await deleteDirectory(path);
                }
                if (!newFiles || !filepath) return;
                if (!fileExists(filepath, newFiles)) {
                  navigate(`/${username}`);
                }
              } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                  toast.error(error.message);
                } else {
                  toast.error('An unknown error has occurred.');
                }
              }
            }}
          >
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// shitty o(n) implementation
function fileExists(path: string, files: DataLeaf) {
  if (!files) return false;

  function exists(leaf: DataLeaf): boolean {
    if (leaf.path === path) {
      return true;
    }
    if (leaf.type === 'directory') {
      return leaf.children.some(exists);
    }
    return false
  }

  return exists(files);
};

