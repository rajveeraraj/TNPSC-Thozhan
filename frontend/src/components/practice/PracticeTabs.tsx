import React from 'react';
import { t } from '@/i18n';

export interface PracticeTabsProps {
  activeTab: 'topic' | 'pyq';
  onTabChange: (tab: 'topic' | 'pyq') => void;
  className?: string;
}

export const PracticeTabs: React.FC<PracticeTabsProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div
      className={`flex p-1 bg-surface-container-highest rounded-xl ${
        className || ''
      }`}
      role="tablist"
      aria-label="Practice Categories"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'topic'}
        onClick={() => onTabChange('topic')}
        data-testid="tab-topic"
        className={`flex-1 py-2.5 px-space-md rounded-lg text-label-md font-bold transition-all flex items-center justify-center gap-space-xs cursor-pointer ${
          activeTab === 'topic'
            ? 'bg-secondary text-on-secondary shadow-md'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">category</span>
        <span>{t('practice.tabs.topic')}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'pyq'}
        onClick={() => onTabChange('pyq')}
        data-testid="tab-pyq"
        className={`flex-1 py-2.5 px-space-md rounded-lg text-label-md font-bold transition-all flex items-center justify-center gap-space-xs cursor-pointer ${
          activeTab === 'pyq'
            ? 'bg-secondary text-on-secondary shadow-md'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">history_edu</span>
        <span>{t('practice.tabs.pyq')}</span>
      </button>
    </div>
  );
};

export default PracticeTabs;
