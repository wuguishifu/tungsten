import Navbar from '@/components/navbar';

export default function UiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='min-h-screen px-8'>
      <Navbar />
      {children}
    </div>
  );
}
