import { ExternalLink, File, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export default function Anchor(props: Props) {
  const isDocumentLink = props.className?.includes('internal-document-link');
  const isText = props.className?.includes('document-text');

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
        isText ? (
          <File
            size={12}
            className='ml-1 inline mb-1'
          />
        ) : (
          <Image
            size={12}
            className='ml-1 inline mb-1'
          />
        )
      ) : (
        <ExternalLink
          size={12}
          className='ml-1 inline mb-1'
        />
      )}
    </Link>
  );
}
