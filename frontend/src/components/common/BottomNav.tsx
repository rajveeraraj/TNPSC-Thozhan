import React from 'react';
import { cn } from '@/utils/cn';

export type NavTabId = 'home' | 'practice' | 'pyq' | 'questions' | 'progress' | 'profile';

export interface NavTabItem {
  id: NavTabId;
  label: string;
  icon: string;
  path: string;
}

export const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'முகப்பு', icon: 'home', path: '#home' },
  { id: 'practice', label: 'பயிற்சி', icon: 'fitness_center', path: '#practice' },
  { id: 'pyq', label: 'வினாக்கள்', icon: 'history_edu', path: '#pyq' },
  { id: 'progress', label: 'முன்னேற்றம்', icon: 'trending_up', path: '#progress' },
  { id: 'profile', label: 'சுயவிவரம்', icon: 'account_circle', path: '#profile' },
];

export interface BottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  const normalizedActive = activeTab === 'questions' ? 'pyq' : activeTab;

  return (
    <nav
      className={cn(
        'fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl border-t border-white/5',
        className
      )}
      data-active-classes="text-secondary bg-surface-container-highest"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-1">
        {NAV_TABS.map((tab) => {
          const isActive = normalizedActive === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              data-path={tab.label}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-14 h-16 rounded-xl transition-all cursor-pointer',
                isActive
                  ? 'text-secondary bg-surface-container-highest shadow-inner'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
              )}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] font-bold tracking-tight truncate max-w-full px-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
