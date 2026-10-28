import React from 'react';
import type { PyqItem } from '@/types/api';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface PyqCardProps {
  pyq: PyqItem;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onTakeExam: () => void;
  className?: string;
}

export const PyqCard: React.FC<PyqCardProps> = ({
  pyq,
  isBookmarked,
  onToggleBookmark,
  onTakeExam,
  className,
}) => {
  return (
    <GlassCard
      className={`p-space-md flex flex-col gap-space-sm hover:border-secondary/30 transition-all ${
        className || ''
      }`}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm flex-1">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <div
            onClick={onTakeExam}
            className="flex-1 cursor-pointer"
          >
            <h4 className="text-headline-sm text-on-surface font-bold leading-snug hover:text-secondary transition-colors">
              {pyq.id === 'pyq_group4_2023' ? (
                <>
                  <span>TNPSC Group 4 - 2023</span>
                  <span className="text-body-sm font-normal text-on-surface-variant ml-1">
                    வினாத்தாள்
                  </span>
                </>
              ) : (
                pyq.title
              )}
            </h4>
            <span className="text-body-sm text-on-surface-variant">
              {t('practice.card.questions_count', { count: pyq.total_questions })}
              {pyq.description ? ` • ${pyq.description}` : ''}
            </span>
          </div>
        </div>

        {/* Bookmark Toggle */}
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark paper'}
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

      <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
        <span className="text-[11px] text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-md font-bold border border-tertiary/20">
          {pyq.tag || t('practice.card.solutions_tag')}
        </span>

        <button
          type="button"
          onClick={onTakeExam}
          className="px-space-md py-2 bg-gradient-to-r from-secondary-container to-secondary text-on-secondary hover:brightness-105 active:scale-95 rounded-xl font-bold text-label-md flex items-center gap-space-xs transition-all shadow-md shadow-secondary/10 cursor-pointer"
        >
          <span>{t('practice.card.take_exam_btn')}</span>
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
        </button>
      </div>
    </GlassCard>
  );
};

export default PyqCard;
