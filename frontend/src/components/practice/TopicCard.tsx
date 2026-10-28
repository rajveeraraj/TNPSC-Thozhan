import React from 'react';
import type { TopicItem } from '@/types/api';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface TopicCardProps {
  topic: TopicItem;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onStartPractice: () => void;
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isBookmarked,
  onToggleBookmark,
  onStartPractice,
  className,
}) => {
  const displayTitle =
    topic.id === 'topic_tamil_grammar'
      ? 'பொது தமிழ் - இலக்கணம்'
      : topic.title;

  return (
    <GlassCard
      className={`p-space-md flex flex-col gap-space-sm hover:border-secondary/30 transition-all ${
        className || ''
      }`}
    >
      {/* Header: Icon, Title, Subtitle, Bookmark Button */}
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm flex-1">
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {topic.icon || 'menu_book'}
            </span>
          </div>
          <div
            onClick={onStartPractice}
            className="flex-1 cursor-pointer"
          >
            <h4 className="text-headline-sm text-on-surface font-bold leading-snug hover:text-secondary transition-colors">
              {displayTitle}
            </h4>
            <span className="text-body-sm text-on-surface-variant line-clamp-1">
              {t('practice.card.questions_count', { count: topic.total_questions })}
              {topic.subtitle ? ` • ${topic.subtitle}` : ''}
            </span>
          </div>
        </div>

        {/* Bookmark Toggle Button */}
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
            isBookmarked
              ? 'bg-secondary/15 text-secondary border-secondary/30'
              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-secondary border-white/5'
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            bookmark
          </span>
        </button>
      </div>

      {/* Completion Progress Bar */}
      <div className="flex flex-col gap-space-xs my-1">
        <div className="flex justify-between text-label-sm">
          <span className="text-on-surface-variant">
            {t('practice.card.completed')}
          </span>
          <span className="text-tertiary font-bold">
            {topic.completed_percentage}%
          </span>
        </div>
        <div
          className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={topic.completed_percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-tertiary rounded-full transition-all duration-500"
            style={{ width: `${topic.completed_percentage}%` }}
          />
        </div>
      </div>

      {/* Action Row: Tag & Start Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-secondary bg-secondary/10 px-2.5 py-1 rounded-md font-bold border border-secondary/20">
          {topic.tag || t('practice.card.special_tag')}
        </span>

        <button
          type="button"
          onClick={onStartPractice}
          className="px-space-md py-2 bg-secondary text-on-secondary hover:brightness-105 active:scale-95 rounded-xl font-bold text-label-md flex items-center gap-space-xs transition-all shadow-md shadow-secondary/10 cursor-pointer"
        >
          <span>{t('practice.card.start_btn')}</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </GlassCard>
  );
};

export default TopicCard;
