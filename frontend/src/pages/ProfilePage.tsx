import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import MetricsGrid from '@/components/profile/MetricsGrid';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import SettingsList from '@/components/profile/SettingsList';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { mockUser, mockProgress } from '@/api/mockData';
import { progressService } from '@/api/progressService';
import { apiClient } from '@/api/client';
import type { ProgressStats } from '@/types/api';
import { t } from '@/i18n';

export interface ProfilePageProps {
  onShowToast?: (message: string) => void;
  onLogout?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onShowToast,
  onLogout,
  onNavigateTab,
}) => {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser || mockUser;
  const isQuizSubmitted = useQuizStore((s) => s.isSubmitted);
  const [liveProgress, setLiveProgress] = useState<ProgressStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!apiClient.getMockMode() && storeUser) {
      progressService
        .getProgress()
        .then((data) => {
          if (isMounted) setLiveProgress(data);
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [storeUser, isQuizSubmitted]);

  // Determine active metrics: Live backend data when available, otherwise mock fallback
  const streakDays = liveProgress
    ? liveProgress.streak.current
    : isQuizSubmitted
    ? 8
    : mockProgress.streak.current;

  const accuracyPercentage = liveProgress
    ? liveProgress.stats.accuracy_percentage
    : mockProgress.stats.accuracy_percentage;

  const questionsSolved = liveProgress
    ? liveProgress.stats.questions_solved
    : isQuizSubmitted
    ? mockProgress.stats.questions_solved + 10
    : mockProgress.stats.questions_solved;

  const heatmapDays = liveProgress?.heatmap && liveProgress.heatmap.length > 0
    ? liveProgress.heatmap
    : mockProgress.heatmap;

  const handleEditProfile = () => {
    onShowToast?.('சுயவிவர திருத்தம் விரைவில் அணுகக் கிடைக்கும்');
  };

  const handleMetricClick = (metric: string) => {
    if (metric === 'streak') {
      onShowToast?.(`உங்கள் ${streakDays}-நாள் தொடர்ச்சி! 🔥 நாளைய தேர்வையும் எழுதுங்கள்.`);
    } else if (metric === 'accuracy') {
      onShowToast?.(`${accuracyPercentage}% துல்லியம்! அரசுப் பணி தேர்ச்சிக்கு மிகச்சிறந்த நிலை. 🎯`);
    } else {
      onShowToast?.(`மொத்தம் ${questionsSolved} வினாக்கள் தீர்க்கப்பட்டுள்ளன! 📚`);
    }
  };

  const handleSelectSetting = (id: string) => {
    if (id === 'bookmarks') {
      onNavigateTab?.('practice');
      onShowToast?.('புக்மார்க் செய்யப்பட்ட வினாக்கள் காண்பிக்கப்படுகின்றன');
    } else if (id === 'weak_topics') {
      onShowToast?.('பலவீனமான தலைப்புகள்: கணிதம் & இந்திய அரசியலமைப்பு');
    } else if (id === 'notifications') {
      onShowToast?.('தினசரி காலை 7:00 மணிக்கு நினைவூட்டல் அமைக்கப்பட்டுள்ளது ⏰');
    } else if (id === 'theme') {
      onShowToast?.('தமிழ் மொழி / Dark Mode இயல்பாக இயக்கப்பட்டுள்ளது');
    }
  };

  const handleLogoutAction = () => {
    onLogout?.();
    onShowToast?.('வெற்றிகரமாக வெளியேற்றப்பட்டீர்கள்');
  };

  return (
    <div className="flex flex-col gap-space-md animate-fade-in pb-12">
      {/* 1. Candidate Profile Header */}
      <ProfileHeader user={user} onEdit={handleEditProfile} />

      {/* 2. 3 Key Metrics Cards */}
      <MetricsGrid
        streakDays={streakDays}
        accuracyPercentage={accuracyPercentage}
        questionsSolved={questionsSolved}
        onMetricClick={handleMetricClick}
      />

      {/* 3. 14-Day Practice Activity Heatmap */}
      <ActivityHeatmap days={heatmapDays} />

      {/* Admin Dashboard Quick Access Card */}
      <a
        href="/admin"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high border border-white/10 transition-all group"
      >
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-body-md font-bold text-on-surface block group-hover:text-secondary transition-colors">
              நிர்வாக தளம் (Admin Dashboard)
            </span>
            <span className="text-body-sm text-on-surface-variant block">
              வினா வங்கி &amp; மதிப்பாய்வு கட்டுப்பாட்டு தளம்
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors">
          open_in_new
        </span>
      </a>

      {/* 4. Settings & Preferences List */}
      <SettingsList
        onSelectSetting={handleSelectSetting}
        onLogout={handleLogoutAction}
      />

      {/* 5. Version Footer */}
      <div className="text-center pt-2 pb-space-sm text-on-surface-variant/80">
        <p className="text-body-sm font-medium">{t('app.version')}</p>
        <p className="text-label-sm text-on-surface-variant/60 mt-0.5">
          {t('app.tagline')}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
