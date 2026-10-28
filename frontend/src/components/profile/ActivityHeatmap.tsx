import React from 'react';
import type { HeatmapDay } from '@/types/api';
import GlassCard from '@/components/common/GlassCard';
import { mockHeatmapDays } from '@/api/mockData';
import { t } from '@/i18n';

export interface ActivityHeatmapProps {
  days?: HeatmapDay[];
  statusText?: string;
  className?: string;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  days = mockHeatmapDays,
  statusText = t('profile.heatmap.badge'),
  className,
}) => {
  const getCellClasses = (day: HeatmapDay): string => {
    if (day.status === 'upcoming') {
      return 'bg-surface-container-highest/40 text-on-surface-variant/30 border border-white/5';
    }
    if (day.day_short === 'இன்று' || day.status === 'pending') {
      return 'bg-secondary-container/40 text-secondary border-2 border-secondary animate-pulse';
    }

    switch (day.level) {
      case 4:
        return 'bg-tertiary text-on-tertiary font-bold shadow-sm shadow-tertiary/30';
      case 3:
        return 'bg-tertiary/80 text-on-tertiary font-bold';
      case 2:
        return 'bg-tertiary/50 text-on-surface';
      case 1:
        return 'bg-tertiary/30 text-on-surface-variant';
      default:
        return 'bg-surface-container-highest/60 text-on-surface-variant/40';
    }
  };

  return (
    <GlassCard className={`p-space-md ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-space-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">
            calendar_month
          </span>
          <h3 className="text-body-md font-bold text-on-surface">
            {t('profile.heatmap.title')}
          </h3>
        </div>
        <span className="text-label-sm text-tertiary bg-tertiary/10 border border-tertiary/20 px-2.5 py-0.5 rounded-full font-bold">
          {statusText}
        </span>
      </div>

      <p className="text-body-sm text-on-surface-variant mb-space-md">
        {t('profile.heatmap.desc')}
      </p>

      {/* 7x2 Grid */}
      <div
        className="grid grid-cols-7 gap-space-xs"
        role="grid"
        aria-label="14-Day Activity Heatmap"
      >
        {days.map((day) => (
          <div
            key={day.day_index}
            className="flex flex-col items-center gap-1"
            title={`${day.date}: ${day.day_name} - ${day.score}/${day.total} மதிப்பெண்`}
          >
            <div
              data-testid={`heatmap-cell-${day.day_index}`}
              className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] transition-transform hover:scale-105 ${getCellClasses(
                day
              )}`}
            >
              {day.day_index}
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium truncate max-w-full">
              {day.day_short}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default ActivityHeatmap;
