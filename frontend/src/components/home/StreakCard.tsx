import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface StreakCardProps {
  currentStreak?: number;
  bestStreak?: number;
  activityDays?: Array<{
    day: string;
    completed: boolean;
    isToday?: boolean;
    isUpcoming?: boolean;
  }>;
  onCardClick?: () => void;
  className?: string;
}

const DEFAULT_14_DAYS = [
  { day: 'தி', completed: true },
  { day: 'செ', completed: true },
  { day: 'பு', completed: true },
  { day: 'வி', completed: true },
  { day: 'வெ', completed: true },
  { day: 'ச', completed: true },
  { day: 'ஞா', completed: true },
  { day: 'தி', completed: true },
  { day: 'செ', completed: true },
  { day: 'பு', completed: true },
  { day: 'வி', completed: true },
  { day: 'வெ', completed: true },
  { day: 'இன்று', completed: false, isToday: true },
  { day: 'நாளை', completed: false, isUpcoming: true },
];

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak = 7,
  bestStreak = 21,
  activityDays = DEFAULT_14_DAYS,
  onCardClick,
  className,
}) => {
  return (
    <GlassCard
      glow="emerald"
      interactive={Boolean(onCardClick)}
      onClick={onCardClick}
      className={className}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-tertiary text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface">
              {t('home.streak_card_title', { count: currentStreak })}
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              {t('home.streak_record', { best: bestStreak })}
            </p>
          </div>
        </div>

        <span className="bg-secondary-container/20 text-secondary text-label-sm px-space-sm py-space-xs rounded-full font-bold shrink-0">
          {t('home.streak_active_badge')}
        </span>
      </div>

      {/* 14-day Activity Dots Row */}
      <div className="mt-space-md pt-space-xs border-t border-white/5">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
          {activityDays.map((item, idx) => {
            let dotColor = 'bg-surface-container-highest border border-white/10';
            if (item.completed) {
              dotColor = 'bg-tertiary shadow-sm shadow-tertiary/40';
            } else if (item.isToday) {
              dotColor = 'bg-secondary-container border border-secondary animate-pulse';
            }

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 min-w-[20px] flex-1"
                title={`${item.day}: ${item.completed ? 'முடிந்தது' : item.isToday ? 'இன்று' : 'வரவிருப்பது'}`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all ${dotColor}`}
                  data-testid={`activity-dot-${idx}`}
                />
                <span className="text-[10px] text-on-surface-variant/80 font-medium whitespace-nowrap">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

export default StreakCard;
