import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface SettingsItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  isDestructive?: boolean;
}

export const getSettingsItems = (): SettingsItem[] => [
  {
    id: 'bookmarks',
    title: t('profile.settings.bookmarks.title'),
    subtitle: t('profile.settings.bookmarks.desc'),
    icon: 'bookmark',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'weak_topics',
    title: t('profile.settings.weak_topics.title'),
    subtitle: t('profile.settings.weak_topics.desc'),
    icon: 'analytics',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    id: 'notifications',
    title: t('profile.settings.notifications.title'),
    subtitle: t('profile.settings.notifications.desc'),
    icon: 'notifications',
    iconBg: 'bg-tertiary/10',
    iconColor: 'text-tertiary',
  },
  {
    id: 'theme',
    title: t('profile.settings.appearance.title'),
    subtitle: t('profile.settings.appearance.desc'),
    icon: 'palette',
    iconBg: 'bg-primary-container',
    iconColor: 'text-primary-fixed-dim',
  },
  {
    id: 'logout',
    title: t('profile.settings.logout.title'),
    subtitle: t('profile.settings.logout.desc'),
    icon: 'logout',
    iconBg: 'bg-error/10',
    iconColor: 'text-error',
    isDestructive: true,
  },
];

export interface SettingsListProps {
  items?: SettingsItem[];
  onSelectSetting?: (id: string) => void;
  onLogout?: () => void;
  className?: string;
}

export const SettingsList: React.FC<SettingsListProps> = ({
  items,
  onSelectSetting,
  onLogout,
  className,
}) => {
  const settingsItems = items || getSettingsItems();

  const handleClick = (item: SettingsItem) => {
    if (item.id === 'logout') {
      onLogout?.();
    } else {
      onSelectSetting?.(item.id);
    }
  };

  return (
    <GlassCard className={`overflow-hidden p-0 divide-y divide-white/5 ${className || ''}`}>
      <div className="px-space-md py-space-sm bg-surface-container-high/40">
        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
          {t('profile.settings.title')}
        </span>
      </div>

      <div className="flex flex-col">
        {settingsItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item)}
            className="w-full px-space-md py-3.5 flex items-center justify-between hover:bg-surface-container-high/60 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div
                className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
              </div>
              <div className="min-w-0">
                <h4
                  className={`text-body-md font-bold truncate ${
                    item.isDestructive
                      ? 'text-error'
                      : 'text-on-surface group-hover:text-secondary transition-colors'
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-body-sm text-on-surface-variant truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <span
              className={`material-symbols-outlined text-[18px] shrink-0 ${
                item.isDestructive ? 'text-error' : 'text-on-surface-variant/60'
              }`}
            >
              chevron_right
            </span>
          </button>
        ))}
      </div>
    </GlassCard>
  );
};

export default SettingsList;
