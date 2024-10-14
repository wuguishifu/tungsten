import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

export default function VersionInfo() {
  return (
    <div className='flex flex-row items-centered justify-between pt-4'>
      <Link
        to='https://github.com/wuguishifu/tungsten'
        className='text-xs flex flex-row items-center text-neutral-400 hover:text-neutral-400 hover:underline underline-offset-4'
        target='_blank'
      >
        <span>
          View on GitHub
        </span>
        <GitHubLogoIcon className='ml-2' />
      </Link>
      <Link
        to='https://github.com/wuguishifu/tungsten/blob/master/CHANGELOG.md#version-300'
        className='text-xs flex flex-row items-center text-neutral-400 hover:text-neutral-400 hover:underline underline-offset-4'
        target='_blank'
      >
        <span>
          Version 3.0.1
        </span>
      </Link>
    </div>
  );
}
