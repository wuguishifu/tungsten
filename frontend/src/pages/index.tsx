import Tree from '@/components/files/tree';
import { useData } from '@/providers/data-provider';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Index() {
  const { loadFile } = useData();

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>('');

  const {
    '*': filePath,
  } = useParams();

  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    loadFile(filePath)
      .then((data) => {
        setValue(data);
      })
      .finally(() => setLoading(false));
  }, [loadFile, filePath]);

  return (
    <div>
      <Tree />
      <pre>
        {loading ? 'Loading...' : value}
      </pre>
    </div>
  );
}
