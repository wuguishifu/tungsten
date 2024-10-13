import { fileExists, getDataLeaf, getName } from '@/lib/file-utils';
import { DataLeaf, useData } from '@/providers/data/provider';
import { useEditor } from '@/providers/editor-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button, buttonVariants } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

type MoveItemDialogProps = {
  open: boolean;
  item: DataLeaf | null;
  onOpenChange: (open: boolean) => void;
  moveItem: (props: { originalItem: DataLeaf, toDir: DataLeaf }) => Promise<boolean>;
};

const formSchema = z.object({
  destinationPath: z.string().min(1, { message: '- folder path required' }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function MoveItemDialog(props: MoveItemDialogProps) {
  const {
    open,
    item,
    onOpenChange,
    moveItem,
  } = props;

  const { files, moveFile, moveDirectory } = useData();
  const { selectFile, filePath } = useEditor();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinationPath: '',
    },
  });

  function close() {
    form.reset();
    onOpenChange(false);
  }

  async function onSubmit(value: FormSchema) {
    if (!files || !item) return close();

    let { destinationPath } = value;
    if (destinationPath.endsWith('/')) {
      destinationPath = destinationPath.slice(0, -1);
    }

    if (destinationPath === item?.path) {
      // no need to move if it's the same path
      return close();
    }

    const toDir = getDataLeaf(destinationPath, files);
    if (toDir) {
      const committed = await moveItem({ originalItem: item, toDir });
      if (committed) {
        close();
      }
    } else {
      const newPath = `${destinationPath}/${item.name}`;
      try {
        if (item.type === 'file') {
          await moveFile(item.path, newPath);
          if (filePath === item.path) {
            selectFile(newPath);
          }
        } else {
          await moveDirectory(item.path, newPath);
          if (!filePath) return;
          if (fileExists(filePath, item)) {
            selectFile(null);
          }
        }
        close();
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error occurred');
        }
      }
    }
  }

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={open => {
      form.reset();
      onOpenChange(open);
    }}>
      <DialogContent>
        <DialogTitle>
          move "{item.type === 'directory' ? item.name : getName(item.name)}"
        </DialogTitle>
        <DialogDescription className=''>
          move the {item.type} "{item.name}" to another folder.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4'
          >
            <FormField
              control={form.control}
              name='destinationPath'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='leading-1'>
                    destination folder {form.formState.errors.destinationPath?.message ?? undefined}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose
                className={buttonVariants({ variant: 'ghost' })}
                type='button'
              >
                cancel
              </DialogClose>
              <Button
                variant='default'
                type='submit'
              >
                move item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
