import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getName } from '@/lib/file-utils';
import { useData } from '@/providers/data-provider';
import { File } from 'lucide-react';
import { toast } from 'sonner';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';

export default function RecentlyDeleted() {
  const { deleted } = useData();

  return (
    <Accordion type='single' collapsible>
      <AccordionItem value='item-1' className='border-b-0'>
        <AccordionTrigger className='mt-auto flex flex-row items-center gap-2 group cursor-pointer'>
          <span className='group-hover:text-neutral-100 text-sm text-neutral-400'>
            recently deleted
          </span>
        </AccordionTrigger>
        <AccordionContent className='pb-0'>
          {!!deleted?.length && (
            deleted.map(name => (
              <RecentlyDeletedItem name={name} key={name} />
            ))
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

type RecentlyDeletedItemProps = {
  name: string;
}

function RecentlyDeletedItem(props: RecentlyDeletedItemProps) {
  const {
    name,
  } = props;

  const { restoreFile, permanentlyDeleteFile } = useData();

  return (
    <div
      onContextMenu={e => e.preventDefault()}
      onClick={e => e.stopPropagation()}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className='flex flex-row items-center cursor-pointer hover:bg-neutral-800 pr-2 py-1 gap-1 rounded-sm mt-0.5 hover:text-neutral-100 text-neutral-400'>
            <File size={16} />
            <span>
              {/* this is kinda stupid but it's cuz the file is always file.md.identifier */}
              {getName(getName(name))}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent onCloseAutoFocus={e => e.preventDefault()}>
          <ContextMenuItem
            autoFocus={false}
            className='select-none'
            onClick={async e => {
              e.stopPropagation();
              const newName = await restoreFile(name);
              if (newName !== name && newName !== null) {
                toast.success(`Restored ${getName(name)} as ${getName(newName)}.`);
              } else {
                toast.success(`Restored ${getName(name)}.`);
              }
            }}
          >
            restore
          </ContextMenuItem>
          <ContextMenuItem
            autoFocus={false}
            className='select-none text-destructive data-[highlighted]:text-destructive'
            onClick={async e => {
              e.stopPropagation();
              try {
                await permanentlyDeleteFile(name);
              } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                  toast.error(error.message);
                } else {
                  toast.error('An unknown error occurred.');
                }
              }
            }}
          >
            permanently delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
