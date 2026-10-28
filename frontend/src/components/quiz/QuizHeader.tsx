import React, { useState } from 'react';
import { t } from '@/i18n';

export interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  onExit: () => void;
  className?: string;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onExit,
  className,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCloseClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmExit = () => {
    setShowConfirmModal(false);
    onExit();
  };

  const handleCancelExit = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <header
        className={`w-full flex items-center justify-between pb-space-sm border-b border-white/5 ${className || ''}`}
      >
        <div className="flex items-center gap-space-sm">
          {/* Question Counter */}
          <span className="text-label-md font-bold text-on-surface">
            {t('quiz.question_counter', {
              current: currentQuestion,
              total: totalQuestions,
            })}
          </span>

          {/* Separator Dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-outline/40" />

          {/* Timer */}
          <div className="flex items-center gap-1 text-tertiary font-mono text-label-sm font-bold bg-tertiary/10 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px]">timer</span>
            <span>{t('quiz.time_remaining', { time: formatTime(timeRemaining) })}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleCloseClick}
          aria-label="Close quiz"
          className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-on-surface transition-all active:scale-95 cursor-pointer border border-white/5"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </header>

      {/* Close Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-black/75 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-surface-container p-space-lg shadow-2xl border border-white/10 flex flex-col gap-space-md animate-fade-in">
            <div className="flex items-center gap-space-sm text-secondary">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="text-headline-sm font-bold text-on-surface">
                {t('quiz.close_confirm_title')}
              </h3>
            </div>

            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {t('quiz.close_confirm_desc')}
            </p>

            <div className="flex items-center gap-space-sm mt-space-xs">
              <button
                type="button"
                onClick={handleCancelExit}
                className="flex-1 py-2.5 px-space-md rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-bold text-label-md transition-all cursor-pointer"
              >
                {t('quiz.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="flex-1 py-2.5 px-space-md rounded-xl bg-error/20 hover:bg-error/30 text-error border border-error/30 font-bold text-label-md transition-all cursor-pointer"
              >
                {t('quiz.exit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizHeader;
