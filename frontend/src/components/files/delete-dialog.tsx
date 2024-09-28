import { fileExists } from '@/lib/file-utils';
import { DataLeaf, DataType, useData } from '@/providers/data/provider';
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
  isPermanent?: boolean;
};

export default function DeleteDialog(props: DeleteDialogProps) {
  const {
    open,
    name,
    type,
    path,
    isPermanent = false,
    onOpenChange,
  } = props;

  const { deleteFile, deleteDirectory, permanentlyDeleteFile } = useData();
  const { '*': filepath, username } = useParams();
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          are you sure you want to{isPermanent ? ' permanently ' : ' '}delete the {type} "{name}"?
        </DialogTitle>
        {isPermanent ? (
          <DialogDescription>
            this cannot be undone.
          </DialogDescription>
        ) : (
          <DialogDescription>
            you can view files you've deleted under "recently deleted."
          </DialogDescription>
        )}
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'ghost' })}>
            cancel
          </DialogClose>
          <DialogClose
            className={buttonVariants({ variant: 'destructive' })}
            onClick={async () => {
              if (!path) return;
              try {
                let newFiles: DataLeaf | null = null;
                if (type === 'file') {
                  if (isPermanent) {
                    await permanentlyDeleteFile(path);
                  } else {
                    newFiles = await deleteFile(path);
                  }
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
            delete
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
