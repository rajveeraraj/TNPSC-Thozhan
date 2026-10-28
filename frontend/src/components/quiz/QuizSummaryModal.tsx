import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { t } from '@/i18n';
import type { QuizSubmissionResult } from '@/types/api';

export interface QuizSummaryModalProps {
  isOpen: boolean;
  score: number;
  total: number;
  submissionResult?: QuizSubmissionResult | null;
  onGoHome: () => void;
  className?: string;
}

export const QuizSummaryModal: React.FC<QuizSummaryModalProps> = ({
  isOpen,
  score,
  total,
  submissionResult,
  onGoHome,
  className,
}) => {
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const currentStreak = submissionResult?.streak?.current ?? 8;

  useEffect(() => {
    if (isOpen) {
      try {
        // Trigger cheerful confetti blast
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffb77d', '#4edea3', '#d97707', '#bec6e0'],
        });
      } catch {
        // Safe fallback in non-canvas test environments
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-space-md bg-black/80 backdrop-blur-md animate-fade-in ${
        className || ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-results-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-surface-container p-space-lg shadow-2xl border border-secondary/30 flex flex-col items-center text-center gap-space-md animate-fade-in relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy / Success Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-secondary-container to-secondary flex items-center justify-center text-on-secondary shadow-lg shadow-secondary/20">
          <span
            className="material-symbols-outlined text-[36px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            emoji_events
          </span>
        </div>

        {/* Title */}
        <div>
          <h2
            id="quiz-results-title"
            className="text-headline-lg font-bold text-on-surface"
          >
            {t('quiz.results.title')}
          </h2>
          <p className="text-body-sm text-tertiary font-bold mt-1">
            {t('quiz.results.streak_msg', { count: currentStreak })}
          </p>
        </div>

        {/* Score & Accuracy Grid */}
        <div className="w-full grid grid-cols-2 gap-space-sm">
          <div className="bg-surface-container-high/80 p-space-md rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-headline-md font-bold text-tertiary">
              {score} / {total}
            </span>
            <span className="text-label-sm text-on-surface-variant mt-0.5">
              மதிப்பெண்
            </span>
          </div>

          <div className="bg-surface-container-high/80 p-space-md rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-headline-md font-bold text-secondary">
              {accuracy}%
            </span>
            <span className="text-label-sm text-on-surface-variant mt-0.5">
              துல்லியம்
            </span>
          </div>
        </div>

        {/* Motivational Feedback */}
        <p className="text-body-sm text-on-surface-variant italic">
          {accuracy >= 80
            ? 'அற்புதம்! உங்கள் தேர்வு தயாரிப்பு மிகச்சிறப்பாக உள்ளது. 🌟'
            : 'நன்றாக முயற்சி செய்தீர்கள்! தொடர்ந்து பயிற்சி செய்யுங்கள். 💪'}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onGoHome}
          className="w-full py-space-md px-space-lg rounded-xl bg-gradient-to-r from-secondary-container to-secondary text-on-secondary font-headline-sm font-bold flex items-center justify-center gap-space-xs shadow-lg shadow-secondary-container/20 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer mt-space-xs"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span>{t('quiz.results.home_btn')}</span>
        </button>
      </div>
    </div>
  );
};

export default QuizSummaryModal;
