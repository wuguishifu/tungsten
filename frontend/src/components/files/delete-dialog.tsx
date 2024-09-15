import { DataType, useData } from '@/providers/data-provider';
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
    deleteFile,
    deleteDirectory,
  } = useData();

  const {
    open,
    onOpenChange,
    name,
    type,
    path,
  } = props;

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
                if (type === 'file') {
                  deleteFile(path);
                } else {
                  deleteDirectory(path);
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
