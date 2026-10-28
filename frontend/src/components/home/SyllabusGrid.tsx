import React from 'react';
import { t } from '@/i18n';

export interface SyllabusItem {
  id: string;
  title: string;
  topicsCount: number;
  icon: string;
  bgClass: string;
  textClass: string;
}

export const DEFAULT_SYLLABUS_ITEMS: SyllabusItem[] = [
  {
    id: 'tamil_literature',
    title: 'தமிழ் இலக்கியம்',
    topicsCount: 12,
    icon: 'menu_book',
    bgClass: 'bg-secondary-container/20',
    textClass: 'text-secondary',
  },
  {
    id: 'polity',
    title: 'இந்திய அரசியல்',
    topicsCount: 8,
    icon: 'gavel',
    bgClass: 'bg-tertiary/10',
    textClass: 'text-tertiary',
  },
  {
    id: 'history',
    title: 'வரலாறு',
    topicsCount: 10,
    icon: 'account_balance',
    bgClass: 'bg-primary/10',
    textClass: 'text-primary',
  },
  {
    id: 'geography',
    title: 'புவியியல்',
    topicsCount: 7,
    icon: 'public',
    bgClass: 'bg-tertiary-fixed/10',
    textClass: 'text-tertiary-fixed',
  },
  {
    id: 'maths',
    title: 'கணிதம்',
    topicsCount: 10,
    icon: 'calculate',
    bgClass: 'bg-secondary/10',
    textClass: 'text-secondary',
  },
  {
    id: 'gk',
    title: 'பொது அறிவு',
    topicsCount: 15,
    icon: 'psychology',
    bgClass: 'bg-primary-fixed/10',
    textClass: 'text-primary-fixed',
  },
];

export interface SyllabusGridProps {
  items?: SyllabusItem[];
  onSelectSubject?: (subjectId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

export const SyllabusGrid: React.FC<SyllabusGridProps> = ({
  items = DEFAULT_SYLLABUS_ITEMS,
  onSelectSubject,
  onViewAll,
  className,
}) => {
  return (
    <div className={`flex flex-col gap-space-sm ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-headline-sm font-bold text-on-surface">
          {t('home.syllabus.title')}
        </h3>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-label-sm text-secondary hover:underline cursor-pointer font-medium"
          >
            {t('home.syllabus.view_all')}
          </button>
        )}
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-space-sm">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectSubject?.(item.id)}
            className="rounded-xl bg-surface-container-high/60 backdrop-blur-md p-space-md flex flex-col items-start gap-space-xs hover:bg-surface-container-high transition-all text-left border border-white/5 active:scale-[0.98] cursor-pointer group"
          >
            <div
              className={`w-10 h-10 rounded-xl ${item.bgClass} flex items-center justify-center ${item.textClass} transition-transform group-hover:scale-105`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
            </div>
            <h4 className="text-body-md font-bold text-on-surface mt-1 group-hover:text-secondary transition-colors">
              {item.title}
            </h4>
            <span className="text-label-sm text-on-surface-variant">
              {t('home.syllabus.topics_count', { count: item.topicsCount })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SyllabusGrid;
