import React from 'react';
import { cn } from '@/utils/cn';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'high' | 'highest' | 'low';
  glow?: 'none' | 'gold' | 'emerald' | 'dual';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  glow = 'none',
  interactive = false,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface-container/80 border-white/10',
    high: 'bg-surface-container-high/80 border-white/10',
    highest: 'bg-surface-container-highest/80 border-white/10',
    low: 'bg-surface-container-low/80 border-white/5',
  }[variant];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl backdrop-blur-xl border shadow-xl transition-all',
        variantStyles,
        interactive && 'hover:border-white/20 active:scale-[0.99] cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Ambient Glow Overlays */}
      {glow === 'gold' && (
        <div
          aria-hidden="true"
          className="absolute -right-10 -bottom-10 w-36 h-36 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"
        />
      )}
      {glow === 'emerald' && (
        <div
          aria-hidden="true"
          className="absolute -right-10 -bottom-10 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl pointer-events-none"
        />
      )}
      {glow === 'dual' && (
        <>
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 w-36 h-36 bg-secondary/15 rounded-full blur-2xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -left-10 -bottom-10 w-36 h-36 bg-tertiary/15 rounded-full blur-2xl pointer-events-none"
          />
        </>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
