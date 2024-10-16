import { useCallback, useEffect, useRef } from 'react';

type ClickOutsideProps = {
  onClick?: (event: MouseEvent, inside: boolean) => void;
  onRelease?: (event: MouseEvent, inside: boolean) => void;
  children: Readonly<React.ReactNode>;
  className?: string;
}

export default function ClickWithin(props: ClickOutsideProps) {
  const {
    onClick,
    onRelease,
    children,
    className,
  } = props;

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!onClick) return;
    const inside = !!ref.current && ref.current.contains(event.target as Node);
    onClick(event, inside);
  }, [onClick]);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!onRelease) return;
    const inside = !!ref.current && ref.current.contains(event.target as Node)
    onRelease(event, inside);
  }, [onRelease]);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('auxclick', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('auxclick', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseUp]);

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}
