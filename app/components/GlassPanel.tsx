import { ReactNode } from 'react';

export default function GlassPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`hpv33Glass ${className}`.trim()}>{children}</section>;
}
