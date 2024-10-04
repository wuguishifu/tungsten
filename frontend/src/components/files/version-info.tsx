import { cn } from '@/lib/utils';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { buttonVariants } from '../ui/button';

export default function VersionInfo() {
  return (
    <div className='flex flex-row items-centered justify-between pt-4'>
      <a
        href='https://github.com/wuguishifu/tungsten'
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs flex flex-row items-center text-neutral-400 hover:text-neutral-400')}
        target='_blank'
      >
        <span>
          View on GitHub
        </span>
        <GitHubLogoIcon className='ml-2' />
      </a>
      <a
        href='https://github.com/wuguishifu/tungsten/blob/master/CHANGELOG.md#version-135'
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs flex flex-row items-center text-neutral-400 hover:text-neutral-400')}
        target='_blank'
      >
        <span>
          Version 1.3.5
        </span>
      </a>
    </div>
  );
}
