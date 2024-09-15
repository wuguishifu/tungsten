import { ClipLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className='w-full h-full flex justify-center items-center' >
      <ClipLoader color='#ABB2BF' />
    </div>
  );
};
