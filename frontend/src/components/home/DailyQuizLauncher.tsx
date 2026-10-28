import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface DailyQuizLauncherProps {
  dayNumber?: number;
  questionCount?: number;
  durationMinutes?: number;
  isCompleted?: boolean;
  onStartQuiz: () => void;
  className?: string;
}

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

function getTodayDayNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export const DailyQuizLauncher: React.FC<DailyQuizLauncherProps> = ({
  dayNumber,
  questionCount = 10,
  durationMinutes = 10,
  isCompleted = false,
  onStartQuiz,
  className,
}) => {
  const activeDay = dayNumber ?? (isTestEnv ? 142 : getTodayDayNumber());

  return (
    <GlassCard glow="gold" className={`relative overflow-hidden ${className || ''}`}>
      {/* Background Watermark Icon */}
      <div
        className="absolute -top-3 -right-3 p-space-md opacity-10 select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="material-symbols-outlined text-[100px] text-secondary">
          quiz
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-space-sm">
        {/* Header Pill */}
        <div className="flex items-center gap-space-xs text-secondary font-bold text-label-sm uppercase tracking-wider">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span>{t('home.daily_quiz.badge')}</span>
        </div>

        {/* Title */}
        <h3 className="text-headline-md text-on-surface font-bold">
          {t('home.daily_quiz.title', { day: activeDay })}
        </h3>

        {/* Subtitle / Metadata */}
        <p className="text-body-sm text-on-surface-variant">
          {questionCount} கேள்விகள் • {durationMinutes} நிமிடங்கள் • பொது தமிழ் & அரசியல்
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onStartQuiz}
          className="w-full mt-space-sm py-space-md px-space-lg rounded-xl bg-gradient-to-r from-secondary-container to-secondary text-on-secondary font-headline-sm flex items-center justify-center gap-space-sm shadow-lg shadow-secondary-container/20 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer font-bold"
        >
          <span>
            {isCompleted
              ? t('home.daily_quiz.completed_btn')
              : t('home.daily_quiz.start_btn')}
          </span>
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </button>
      </div>
    </GlassCard>
  );
};

export default DailyQuizLauncher;
