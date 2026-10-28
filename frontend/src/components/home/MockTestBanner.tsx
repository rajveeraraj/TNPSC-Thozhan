import React, { useState } from 'react';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface MockTestBannerProps {
  title?: string;
  initialTimeText?: string;
  onRegister?: () => void;
  className?: string;
}

export const MockTestBanner: React.FC<MockTestBannerProps> = ({
  title = t('home.mock_banner.title'),
  initialTimeText = '02 மணி 14 நிமி',
  onRegister,
  className,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    setIsRegistered((prev) => !prev);
    onRegister?.();
  };

  return (
    <GlassCard glow="emerald" className={`flex items-center justify-between p-space-md ${className || ''}`}>
      <div className="flex items-center gap-space-md">
        <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined text-[28px]">timer</span>
        </div>
        <div>
          <h4 className="text-body-md font-bold text-on-surface">{title}</h4>
          <p className="text-body-sm text-tertiary font-medium">
            {t('home.mock_banner.timer_label', { time: initialTimeText })}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRegister}
        className={`px-space-md py-space-sm rounded-lg text-label-md font-bold transition-all cursor-pointer ${
          isRegistered
            ? 'bg-tertiary/20 text-tertiary border border-tertiary/40'
            : 'bg-surface-container-highest text-on-surface hover:bg-surface-bright border border-white/10 active:scale-95'
        }`}
      >
        {isRegistered ? 'பதிவு முடிந்தது ✓' : t('home.mock_banner.register_btn')}
      </button>
    </GlassCard>
  );
};

export default MockTestBanner;
