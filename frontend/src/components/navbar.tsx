import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/auth-provider';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from './ui/button';

export default function Navbar() {
  const { username, logout } = useAuth();

  return (
    <nav className='flex flex-row items-center px-4 pt-4'>
      <Link to='/' className='flex flex-row items-center gap-2'>
        <img src='/logo.svg' alt='tungsten' className='h-8 w-8' />
        <h1 className='text-brand text-xl'>
          tungsten
        </h1>
      </Link>
      <div className='ml-auto flex flex-row items-center gap-2'>
        {username && (
          <Link to={`/${username}`} className={buttonVariants({ variant: 'ghost' })}>
            notebook
          </Link>
        )}
        <div>
          {username ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='outline-none'>
                <Button variant='ghost'>
                  {username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onCloseAutoFocus={e => e.preventDefault()}>
                <DropdownMenuItem onClick={logout} className='text-destructive data-[highlighted]:text-destructive'>
                  log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to='/login' className={buttonVariants({ variant: 'ghost' })}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
