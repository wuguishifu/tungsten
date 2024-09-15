import useFile from '@/hooks/use-file';
import { useParams } from 'react-router-dom';

export default function Editor() {
  const { '*': filePath } = useParams();
  const [file] = useFile(filePath);

  return (
    <div className='bg-neutral-800 h-full rounded-lg w-full p-4'>
      <pre>
        {file}
      </pre>
    </div>
  );
}
