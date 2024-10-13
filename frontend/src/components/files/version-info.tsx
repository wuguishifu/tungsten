import { cn } from '@/lib/utils';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';

export default function VersionInfo() {
  return (
    <div className='flex flex-row items-centered justify-between pt-4'>
      <Link
        to='https://github.com/wuguishifu/tungsten'
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs flex flex-row items-center text-neutral-400 hover:text-neutral-400')}
        target='_blank'
      >
        <span>
          View on GitHub
        </span>
        <GitHubLogoIcon className='ml-2' />
      </Link>
      <Link
        to='https://github.com/wuguishifu/tungsten/blob/master/CHANGELOG.md#version-213'
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs flex flex-row items-center text-neutral-400 hover:text-neutral-400')}
        target='_blank'
      >
        <span>
          Version 2.1.3
        </span>
      </Link>
    </div>
  );
}
