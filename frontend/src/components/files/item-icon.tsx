import { cn } from '@/lib/utils';
import { ItemType } from '@/providers/data/provider';
import { File, Folder, Image } from 'lucide-react';

type ItemIconProps = {
  type: ItemType;
  className?: string;
}

export default function ItemIcon(props: ItemIconProps) {
  const {
    type,
    className,
  } = props;

  switch (type) {
    case 'text': return <File className={cn('min-w-4', className)} size={16} />
    case 'drawing': return <Image className={cn('min-w-4', className)} size={16} />
    case 'directory': return <Folder className={cn('min-w-4', className)} size={16} />
  }
}
