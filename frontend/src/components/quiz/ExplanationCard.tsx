import React from 'react';
import { t } from '@/i18n';

export interface ExplanationCardProps {
  explanation: string;
  className?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  className,
}) => {
  if (!explanation) return null;

  return (
    <div
      className={`bg-surface-container-low/95 backdrop-blur-xl p-space-md rounded-xl border border-tertiary/20 flex gap-space-md items-start animate-fade-in shadow-lg ${
        className || ''
      }`}
      role="region"
      aria-label="Explanation"
    >
      <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary shrink-0 mt-0.5">
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          lightbulb
        </span>
      </div>

      <div className="flex flex-col gap-space-xs">
        <span className="text-label-md font-bold text-tertiary">
          {t('quiz.explanation_title')}
        </span>
        <p className="text-body-md text-on-surface leading-relaxed font-body">
          {explanation}
        </p>
      </div>
    </div>
  );
};

export default ExplanationCard;
