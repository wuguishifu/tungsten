import { ExternalLink, File } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export default function Anchor(props: Props) {
  const isDocumentLink = props.className?.includes('internal-document-link');

  return (
    <Link
      to={props.href ?? '#'}
      target={isDocumentLink ? '_self' : '_blank'}
      rel='noopener noreferrer'
    >
      <span className='md-preview-link-text'>
        {props.children}
      </span>
      {isDocumentLink ? (
        <File
          size={12}
          className='ml-0.5 inline mb-1'
        />
      ) : (
        <ExternalLink
          size={12}
          className='ml-0.5 inline mb-1'
        />
      )}
    </Link>
  );
}
