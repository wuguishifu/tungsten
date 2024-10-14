import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getName } from '@/lib/file-utils';
import { useData } from '@/providers/data/provider';
import { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'sonner';
import { buttonVariants } from '../ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '../ui/dialog';
import DeleteDialog from './delete-dialog';

type RecentlyDeletedContextProps = {
  restoreFile: (name: string) => Promise<void>;
  showDeleteDialog: (name: string) => void;
}

const RecentlyDeletedContext = createContext({} as RecentlyDeletedContextProps);

export default function RecentlyDeleted() {
  const {
    deleted,
    restoreFile: commitRestore,
    permanentlyDeleteAll,
  } = useData();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState<string | undefined>();
  const showDeleteDialog = useCallback((name: string) => {
    setDeleteDialogVisible(true);
    setDeleteItem(name);
  }, []);

  const restoreFile = useCallback(async (name: string) => {
    const newName = await commitRestore(name);
    if (newName !== name && newName !== null) {
      toast.success(`Restored ${getName(name)} as ${getName(newName)}.`);
    } else {
      toast.success(`Restored ${getName(name)}.`);
    }
  }, [commitRestore]);

  const [clearDialogVisible, setClearDialogVisible] = useState(false);

  const value = {
    restoreFile,
    showDeleteDialog,
  }

  return (
    <>
      <DeleteDialog
        open={deleteDialogVisible}
        onOpenChange={setDeleteDialogVisible}
        isPermanent
        name={deleteItem}
        path={deleteItem}
        type='file'
      />
      <Dialog open={clearDialogVisible} onOpenChange={setClearDialogVisible}>
        <DialogContent>
          <DialogTitle>
            are you sure you want to empty the trash?
          </DialogTitle>
          <DialogDescription>
            this cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: 'ghost' })}>
              cancel
            </DialogClose>
            <DialogClose
              className={buttonVariants({ variant: 'destructive' })}
              onClick={async () => {
                await permanentlyDeleteAll();
                setClearDialogVisible(false);
              }}
            >
              empty trash
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <RecentlyDeletedContext.Provider value={value}>
        <Accordion type='single' collapsible>
          <AccordionItem value='item-1' className='border-b-0'>
            <ContextMenu>
              <ContextMenuTrigger>
                <AccordionTrigger className='mt-auto flex flex-row items-center gap-2 cursor-pointer hover:text-neutral-100 text-neutral-400 text-sm pt-4 underline-offset-4'>
                  <span>
                    recently deleted
                  </span>
                </AccordionTrigger>
              </ContextMenuTrigger>
              <ContextMenuContent onCloseAutoFocus={e => e.preventDefault()}>
                <ContextMenuItem
                  autoFocus={false}
                  className='select-none text-destructive data-[highlighted]:text-destructive'
                  onClick={async e => {
                    e.stopPropagation();
                    setClearDialogVisible(true);
                  }}
                >
                  empty trash
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <AccordionContent className='pb-0'>
              {deleted?.length ? (
                deleted.map(name => (
                  <RecentlyDeletedItem name={name} key={name} />
                ))
              ) : (
                <div className='text-neutral-600 text-xs pt-4'>
                  there's nothing here yet!
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </RecentlyDeletedContext.Provider>
    </>
  );
}

type RecentlyDeletedItemProps = {
  name: string;
}

function RecentlyDeletedItem(props: RecentlyDeletedItemProps) {
  const {
    name,
  } = props;

  const { restoreFile, showDeleteDialog } = useContext(RecentlyDeletedContext);

  return (
    <div
      onContextMenu={e => e.preventDefault()}
      onClick={e => e.stopPropagation()}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className='max-w-64 overflow-hidden flex px-2 cursor-pointer hover:bg-neutral-800 py-1 rounded-sm mt-0.5 hover:text-neutral-100 text-neutral-400'>
            <p className='truncate'>
              {/* this is kinda stupid but it's cuz the file is always file.md.identifier */}
              {getName(getName(name))}
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent onCloseAutoFocus={e => e.preventDefault()}>
          <ContextMenuItem
            autoFocus={false}
            className='select-none'
            onClick={async e => {
              e.stopPropagation();
              restoreFile(name);
            }}
          >
            restore
          </ContextMenuItem>
          <ContextMenuItem
            autoFocus={false}
            className='select-none text-destructive data-[highlighted]:text-destructive'
            onClick={async e => {
              e.stopPropagation();
              showDeleteDialog(name);
            }}
          >
            permanently delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
