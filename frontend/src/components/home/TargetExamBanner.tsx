import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface TargetExamBannerProps {
  targetExam?: string;
  daysRemaining?: number;
  completionPercentage?: number;
  className?: string;
}

export const TargetExamBanner: React.FC<TargetExamBannerProps> = ({
  targetExam = 'TNPSC Group 4 & VAO 2024',
  daysRemaining = 45,
  completionPercentage = 64,
  className,
}) => {
  return (
    <GlassCard glow="gold" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-label-sm uppercase tracking-wider text-secondary font-bold">
            {t('home.target_exam_badge')}
          </span>
          <h2 className="text-headline-lg text-on-surface mt-1 font-bold">
            {targetExam}
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            தேர்வு நாள்: நவம்பர் 2024 • {daysRemaining} நாட்கள் மட்டுமே உள்ளது
          </p>
        </div>

        <div className="bg-surface-container-highest px-space-md py-space-sm rounded-xl text-center shrink-0 border border-white/5">
          <span className="text-headline-md text-tertiary font-bold">
            {completionPercentage}%
          </span>
          <span className="block text-[10px] text-on-surface-variant uppercase font-medium">
            {t('home.completed_label')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-space-md flex flex-col gap-space-xs">
        <div className="flex items-center justify-between text-label-sm">
          <span className="text-on-surface-variant">பாடத்திட்ட முன்னேற்றம்</span>
          <span className="text-tertiary font-bold">{completionPercentage}%</span>
        </div>
        <div
          className="w-full bg-surface-container-lowest rounded-full h-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="bg-gradient-to-r from-tertiary to-tertiary-fixed h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default TargetExamBanner;
