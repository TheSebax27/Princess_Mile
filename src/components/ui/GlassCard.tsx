import type { ReactNode } from 'react';
import clsx from 'clsx';

export function GlassCard({
  children,
  className,
  hover = true,
  as: Component = 'div',
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'button' | 'article';
}) {
  return (
    <Component
      className={clsx(
        'glass rounded-2xl',
        hover && 'glass-hover',
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-bright">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-xl text-sm text-text-muted sm:text-base">{subtitle}</p>}
    </div>
  );
}
