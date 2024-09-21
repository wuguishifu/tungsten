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
          Tungsten
        </h1>
      </Link>
      <div className='ml-auto flex flex-row items-center gap-2'>
        {username && (
          <Link to={`/${username}`} className={buttonVariants({ variant: 'ghost' })}>
            Notebook
          </Link>
        )}
        <div>
          {username ? (
            <Button variant='ghost' onClick={logout}>
              Log Out
            </Button>
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
