import React from 'react';
import type { User } from '@/types/api';
import GlassCard from '@/components/common/GlassCard';
import { t } from '@/i18n';

export interface ProfileHeaderProps {
  user: User;
  onEdit?: () => void;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEdit,
  className,
}) => {
  const tamilName = user.name.includes(' ')
    ? user.name.split(' ')[0]
    : user.name;
  const englishSubName = user.name.includes('(')
    ? user.name.substring(user.name.indexOf('('))
    : null;

  return (
    <GlassCard
      glow="dual"
      className={`relative overflow-hidden p-space-lg ${className || ''}`}
    >
      <div className="flex items-center gap-space-md">
        {/* Avatar with Gradient Ring & Verified Badge */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-secondary to-tertiary">
            <div className="w-full h-full rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-on-surface text-[40px]">
                person
              </span>
            </div>
          </div>
          <div
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md"
            title="சரிபார்க்கப்பட்ட பயனர்"
          >
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[11px] font-bold border border-secondary/20">
              {t('profile.badge')}
            </span>
          </div>

          <h2 className="text-headline-md text-on-surface font-bold truncate">
            <span>{tamilName}</span>
            {englishSubName && (
              <span className="text-body-md font-normal text-on-surface-variant ml-1.5">
                {englishSubName}
              </span>
            )}
          </h2>

          <p className="text-body-sm text-on-surface-variant font-mono mt-0.5">
            {t('profile.aspirant_id', { id: user.aspirant_id })}
          </p>
        </div>
      </div>

      {/* Target Status Row & Edit Action */}
      <div className="mt-space-md pt-space-sm border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="text-body-sm text-on-surface-variant">
            {t('profile.target_status')}
          </span>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-secondary hover:underline font-label-md flex items-center gap-1 cursor-pointer font-bold text-label-sm"
          >
            <span>{t('profile.edit_btn')}</span>
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        )}
      </div>
    </GlassCard>
  );
};

export default ProfileHeader;
