import useFile from '@/hooks/use-file';
import { useParams } from 'react-router-dom';

export default function Editor() {
  const { '*': filePath } = useParams();
  const [file] = useFile(filePath);

  return (
    <pre>
      {file}
    </pre>
  );
}
