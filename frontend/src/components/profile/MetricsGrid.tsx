import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface MetricsGridProps {
  streakDays?: number;
  accuracyPercentage?: number;
  questionsSolved?: number;
  onMetricClick?: (metric: string) => void;
  className?: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  streakDays = 7,
  accuracyPercentage = 84,
  questionsSolved = 1420,
  onMetricClick,
  className,
}) => {
  return (
    <div
      className={`grid grid-cols-3 gap-space-sm ${className || ''}`}
      role="region"
      aria-label="Candidate Statistics"
    >
      {/* 1. Streak Card */}
      <GlassCard
        className="p-space-md flex flex-col items-center text-center shadow-lg transition-transform active:scale-95 cursor-pointer hover:border-tertiary/30"
        onClick={() => onMetricClick?.('streak')}
      >
        <div className="w-10 h-10 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center mb-1">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_fire_department
          </span>
        </div>
        <span className="text-headline-sm font-bold text-on-surface">
          {streakDays} {t('profile.metrics.streak_title')}
        </span>
        <span className="text-[11px] text-on-surface-variant mt-0.5">
          {t('profile.metrics.streak_sub')}
        </span>
      </GlassCard>

      {/* 2. Accuracy Card */}
      <GlassCard
        className="p-space-md flex flex-col items-center text-center shadow-lg transition-transform active:scale-95 cursor-pointer hover:border-secondary/30"
        onClick={() => onMetricClick?.('accuracy')}
      >
        <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mb-1">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            ads_click
          </span>
        </div>
        <span className="text-headline-sm font-bold text-on-surface">
          {accuracyPercentage}%
        </span>
        <span className="text-[11px] text-on-surface-variant mt-0.5">
          {t('profile.metrics.accuracy_sub')}
        </span>
      </GlassCard>

      {/* 3. Questions Solved Card */}
      <GlassCard
        className="p-space-md flex flex-col items-center text-center shadow-lg transition-transform active:scale-95 cursor-pointer hover:border-primary/30"
        onClick={() => onMetricClick?.('questions')}
      >
        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-1">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            menu_book
          </span>
        </div>
        <span className="text-headline-sm font-bold text-on-surface">
          {questionsSolved.toLocaleString()}
        </span>
        <span className="text-[11px] text-on-surface-variant mt-0.5">
          {t('profile.metrics.solved_sub')}
        </span>
      </GlassCard>
    </div>
  );
};

export default MetricsGrid;
