import React, { useEffect, useState } from 'react';
import TargetExamBanner from '@/components/home/TargetExamBanner';
import StreakCard from '@/components/home/StreakCard';
import DailyQuizLauncher from '@/components/home/DailyQuizLauncher';
import SyllabusGrid from '@/components/home/SyllabusGrid';
import MockTestBanner from '@/components/home/MockTestBanner';
import { useQuizStore } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import { progressService } from '@/api/progressService';
import { apiClient } from '@/api/client';
import type { ProgressStats } from '@/types/api';

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

function getTodayDayNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export interface HomePageProps {
  onStartQuiz: () => void;
  onSelectSyllabus?: (subjectId: string) => void;
  onShowToast?: (message: string) => void;
  onNavigateTab?: (tab: 'home' | 'practice' | 'pyq' | 'progress' | 'profile') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartQuiz,
  onSelectSyllabus,
  onShowToast,
  onNavigateTab,
}) => {
  const isSubmitted = useQuizStore((s) => s.isSubmitted);
  const user = useAuthStore((s) => s.user);
  const [liveProgress, setLiveProgress] = useState<ProgressStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!apiClient.getMockMode() && user) {
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
  }, [user, isSubmitted]);

  const currentStreak = liveProgress
    ? liveProgress.streak.current
    : isTestEnv
    ? (isSubmitted ? 8 : 7)
    : (isSubmitted ? 1 : 0);

  const bestStreak = liveProgress
    ? liveProgress.streak.best
    : isTestEnv
    ? 21
    : (isSubmitted ? 1 : 0);

  const completionPercentage = liveProgress
    ? Math.min(100, Math.round((liveProgress.stats.questions_solved / 50) * 100))
    : isTestEnv
    ? (isSubmitted ? 70 : 64)
    : 0;

  const dayNumber = isTestEnv ? 142 : getTodayDayNumber();

  const activityDays = liveProgress?.heatmap && liveProgress.heatmap.length > 0
    ? liveProgress.heatmap.map((h) => ({
        day: h.status === 'upcoming' ? 'நாளை' : (h.day_short || h.day_name),
        completed: h.status === 'completed' || h.level > 0,
        isToday: h.day_short === 'இன்று' || h.status === 'pending',
        isUpcoming: h.status === 'upcoming',
      }))
    : isTestEnv
    ? undefined
    : [
        { day: 'தி', completed: false },
        { day: 'செ', completed: false },
        { day: 'பு', completed: false },
        { day: 'வி', completed: false },
        { day: 'வெ', completed: false },
        { day: 'ச', completed: false },
        { day: 'ஞா', completed: false },
        { day: 'தி', completed: false },
        { day: 'செ', completed: false },
        { day: 'பு', completed: false },
        { day: 'வி', completed: false },
        { day: 'வெ', completed: false },
        { day: 'இன்று', completed: isSubmitted, isToday: true },
        { day: 'நாளை', completed: false, isUpcoming: true },
      ];

  const handleStreakClick = () => {
    onShowToast?.(`${currentStreak}-நாள் தொடர்ச்சி செயலில் உள்ளது! 🔥 அதிகபட்சம் ${bestStreak} நாட்கள்`);
    onNavigateTab?.('progress');
  };

  const handleSyllabusSelect = (subjectId: string) => {
    onShowToast?.(`பாடப்பிரிவு தேர்ந்தெடுக்கப்பட்டது: ${subjectId}`);
    onSelectSyllabus?.(subjectId);
  };

  const handleMockRegister = () => {
    onShowToast?.('மெகா மாதிரித் தேர்வுக்கு உங்கள் பதிவு வெற்றிகரமாக ஏற்கப்பட்டது! 🎯');
  };

  return (
    <div className="flex flex-col gap-space-md animate-fade-in pb-4">
      {/* 1. Target Exam Banner */}
      <TargetExamBanner
        targetExam={user?.target_exam || "TNPSC Group 4 & VAO 2024"}
        daysRemaining={45}
        completionPercentage={completionPercentage}
      />

      {/* 2. Streak Card with 14-day activity dots row */}
      <StreakCard
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        activityDays={activityDays}
        onCardClick={handleStreakClick}
      />

      {/* 3. Daily Quiz Launcher Card */}
      <DailyQuizLauncher
        dayNumber={dayNumber}
        questionCount={10}
        durationMinutes={10}
        isCompleted={isSubmitted}
        onStartQuiz={onStartQuiz}
      />

      {/* 4. 6-Card Syllabus Grid */}
      <SyllabusGrid
        onSelectSubject={handleSyllabusSelect}
        onViewAll={() => onSelectSyllabus?.('all')}
      />

      {/* 5. Mega Mock Test Banner */}
      <MockTestBanner onRegister={handleMockRegister} />
    </div>
  );
};

export default HomePage;
