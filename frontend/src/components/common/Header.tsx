import React from 'react';
import { cn } from '@/utils/cn';

export interface HeaderProps {
  title?: string;
  streakCount?: number;
  onAvatarClick?: () => void;
  onStreakClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'TNPSC தோழன்',
  streakCount = 0,
  onAvatarClick,
  onStreakClick,
  className,
}) => {
  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 pt-safe',
        className
      )}
    >
      <div className="max-w-md mx-auto h-16 px-space-md flex items-center justify-between">
        {/* Brand Title */}
        <div className="flex items-center gap-space-sm">
          <span className="font-headline font-bold text-headline-md text-on-surface tracking-tight">
            {title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-space-md">
          {/* Streak Badge */}
          <button
            type="button"
            onClick={onStreakClick}
            aria-label={`Streak: ${streakCount} days`}
            className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-space-xs rounded-full border border-outline/10 hover:border-tertiary/30 transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-tertiary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="text-label-sm font-bold text-tertiary">
              {streakCount}
            </span>
          </button>

          {/* Profile Avatar Button */}
          <button
            type="button"
            onClick={onAvatarClick}
            aria-label="Profile Avatar"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
