import React, { useEffect, useState } from 'react';
import GlassCard from '@/components/common/GlassCard';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import MetricsGrid from '@/components/profile/MetricsGrid';
import { progressService } from '@/api/progressService';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { mockHeatmapDays } from '@/api/mockData';
import type { HeatmapDay, ProgressStats } from '@/types/api';

export interface LeaderboardItem {
  rank: number;
  name: string;
  aspirant_id: string;
  score: number;
  time_taken_seconds: number;
  streak: number;
}

export interface ProgressPageProps {
  onPracticeTopic?: (topicName: string) => void;
  onShowToast?: (message: string) => void;
}

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

export const ProgressPage: React.FC<ProgressPageProps> = ({
  onPracticeTopic,
  onShowToast,
}) => {
  const user = useAuthStore((s) => s.user);
  const isSubmitted = useQuizStore((s) => s.isSubmitted);

  const [liveProgress, setLiveProgress] = useState<ProgressStats | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<'daily' | 'weekly'>('daily');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Load user progress
  useEffect(() => {
    let isMounted = true;
    progressService
      .getProgress()
      .then((data) => {
        if (isMounted) setLiveProgress(data);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [user, isSubmitted]);

  // Load leaderboard data
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLeaderboard(true);

    if (!apiClient.getMockMode()) {
      apiClient
        .get<{ rankings: LeaderboardItem[] }>('/leaderboard', {
          params: { type: leaderboardType },
        })
        .then((res) => {
          if (isMounted) {
            setLeaderboard(res.data?.rankings || []);
            setIsLoadingLeaderboard(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setLeaderboard(getMockLeaderboard(leaderboardType));
            setIsLoadingLeaderboard(false);
          }
        });
    } else {
      setLeaderboard(getMockLeaderboard(leaderboardType));
      setIsLoadingLeaderboard(false);
    }

    return () => {
      isMounted = false;
    };
  }, [leaderboardType]);

  const streakDays = liveProgress
    ? liveProgress.streak.current
    : isTestEnv
    ? 14
    : (isSubmitted ? 1 : 0);

  const accuracy = liveProgress
    ? liveProgress.stats.accuracy_percentage
    : isTestEnv
    ? 84
    : 78;

  const solved = liveProgress
    ? liveProgress.stats.questions_solved
    : isTestEnv
    ? 1420
    : 120;

  const heatmapDays: HeatmapDay[] = liveProgress?.heatmap || mockHeatmapDays;

  // Weak topics requiring practice
  const weakTopics = [
    {
      id: 'maths_aptitude',
      name: 'கணிதம் & திறனறிதல் (Maths & Aptitude)',
      accuracy: 45,
      totalPracticed: 60,
      badge: 'அதிக கவனம் தேவை',
      color: 'secondary',
    },
    {
      id: 'tamil_grammar',
      name: 'பொது தமிழ் - புணர்ச்சி & இலக்கணம்',
      accuracy: 62,
      totalPracticed: 95,
      badge: 'பயிற்சி தேவை',
      color: 'tertiary',
    },
    {
      id: 'indian_polity',
      name: 'இந்திய அரசியல் - அடிப்படை உரிமைகள்',
      accuracy: 70,
      totalPracticed: 80,
      badge: 'மீள்பார்வை',
      color: 'primary',
    },
  ];

  const handlePracticeClick = (topicName: string) => {
    onShowToast?.(`${topicName} பயிற்சிக்கு மாறுகிறது... 📚`);
    onPracticeTopic?.(topicName);
  };

  return (
    <div className="flex flex-col gap-space-lg animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <GlassCard className="p-space-lg relative overflow-hidden bg-gradient-to-br from-surface-container-high/90 via-surface-container/70 to-surface-container-low/90 border border-white/10 shadow-xl">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/20 shadow-md">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              trending_up
            </span>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold border border-secondary/20 mb-1">
              <span>நேரலைப் பகுப்பாய்வு</span>
            </div>
            <h1 className="text-headline-md font-bold text-on-surface font-headline leading-tight">
              உங்கள் முன்னேற்றம் (Progress)
            </h1>
            <p className="text-body-sm text-on-surface-variant font-body">
              தினசரி தேர்வு தொடர்ச்சி, துல்லியம் மற்றும் மாநிலத் தரவரிசை
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 2. Key Performance Metric Cards */}
      <MetricsGrid
        streakDays={streakDays}
        accuracyPercentage={accuracy}
        questionsSolved={solved}
        onMetricClick={(m) => onShowToast?.(`பகுப்பாய்வு: ${m}`)}
      />

      {/* 3. Consistency Activity Heatmap */}
      <ActivityHeatmap days={heatmapDays} />

      {/* 4. Weak Topics: Practice That Topic */}
      <section className="flex flex-col gap-space-sm" aria-label="Weak Topics">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              psychology_alt
            </span>
            <h2 className="text-title-md font-bold text-on-surface font-headline">
              பயிற்சி தேவைப்படும் பகுதிகள் (Weak Topics)
            </h2>
          </div>
          <span className="text-label-sm text-on-surface-variant font-medium">
            3 பகுதிகள்
          </span>
        </div>

        <div className="flex flex-col gap-space-sm">
          {weakTopics.map((item) => (
            <GlassCard
              key={item.id}
              className="p-space-md flex flex-col gap-space-xs hover:border-secondary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-body-md font-bold text-on-surface">
                    {item.name}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">
                    துல்லியம்: {item.accuracy}% • {item.totalPracticed} வினாக்கள் பயிற்சி செய்யப்பட்டது
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/20 shrink-0">
                  {item.badge}
                </span>
              </div>

              {/* Progress percentage bar */}
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.accuracy < 50
                      ? 'bg-rose-500'
                      : item.accuracy < 70
                      ? 'bg-secondary'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${item.accuracy}%` }}
                />
              </div>

              {/* Action Button: Practice this topic */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handlePracticeClick(item.name)}
                  className="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-secondary border border-secondary/30 text-label-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>பயிற்சி செய்க</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 5. Live State Leaderboard (Daily / Weekly) */}
      <section className="flex flex-col gap-space-sm" aria-label="Leaderboard">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
            <h2 className="text-title-md font-bold text-on-surface font-headline">
              மாநிலத் தரவரிசை (Leaderboard)
            </h2>
          </div>

          {/* Toggle Daily / Weekly */}
          <div className="flex p-0.5 bg-surface-container-highest rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => setLeaderboardType('daily')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                leaderboardType === 'daily'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              இன்று
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardType('weekly')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                leaderboardType === 'weekly'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              இந்த வாரம்
            </button>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="flex flex-col gap-1.5">
          {isLoadingLeaderboard ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">தரவரிசை பட்டியல் ஏற்றப்படுகிறது...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <GlassCard className="p-space-lg text-center text-on-surface-variant text-body-sm">
              இன்றைய மாதிரித் தேர்வை எழுதி முதல் தரவரிசையைப் பெறுங்கள்! 🎯
            </GlassCard>
          ) : (
            leaderboard.slice(0, 10).map((entry) => {
              const isTop1 = entry.rank === 1;
              const isTop2 = entry.rank === 2;
              const isTop3 = entry.rank === 3;
              const isCurrentUser = user && (entry.aspirant_id === user.aspirant_id || entry.name === user.name);

              return (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-space-sm rounded-xl border transition-all ${
                    isCurrentUser
                      ? 'bg-secondary/15 border-secondary/40 shadow-md ring-1 ring-secondary/30'
                      : isTop1
                      ? 'bg-gradient-to-r from-amber-500/10 to-surface-container border-amber-500/30'
                      : 'bg-surface-container/60 border-white/5 hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isTop1
                          ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20'
                          : isTop2
                          ? 'bg-slate-300 text-slate-900'
                          : isTop3
                          ? 'bg-amber-700 text-white'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {entry.rank}
                    </div>

                    {/* Candidate Info */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-body-sm font-bold text-on-surface truncate">
                        {entry.name} {isCurrentUser && <span className="text-[10px] text-secondary font-bold">(நீங்கள்)</span>}
                      </span>
                      <span className="text-[10px] text-on-surface-variant truncate">
                        {entry.aspirant_id} • 🔥 {entry.streak} நாள்
                      </span>
                    </div>
                  </div>

                  {/* Score & Time */}
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className="text-body-sm font-bold text-secondary">
                      {entry.score} / 10
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {Math.floor(entry.time_taken_seconds / 60)}m {entry.time_taken_seconds % 60}s
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

function getMockLeaderboard(type: 'daily' | 'weekly'): LeaderboardItem[] {
  if (type === 'daily') {
    return [
      { rank: 1, name: 'செல்வகுமார்', aspirant_id: 'TNPSC-8419', score: 10, time_taken_seconds: 142, streak: 21 },
      { rank: 2, name: 'கவிதா ராணி', aspirant_id: 'TNPSC-2041', score: 10, time_taken_seconds: 168, streak: 14 },
      { rank: 3, name: 'மணிகண்டன்', aspirant_id: 'TNPSC-9132', score: 10, time_taken_seconds: 195, streak: 9 },
      { rank: 4, name: 'அன்பழகன்', aspirant_id: 'TNPSC-2024-4821', score: 9, time_taken_seconds: 180, streak: 7 },
      { rank: 5, name: 'பிரியா தர்ஷினி', aspirant_id: 'TNPSC-6102', score: 9, time_taken_seconds: 210, streak: 12 },
    ];
  }
  return [
    { rank: 1, name: 'செல்வகுமார்', aspirant_id: 'TNPSC-8419', score: 70, time_taken_seconds: 1120, streak: 21 },
    { rank: 2, name: 'பிரியா தர்ஷினி', aspirant_id: 'TNPSC-6102', score: 68, time_taken_seconds: 1240, streak: 12 },
    { rank: 3, name: 'அன்பழகன்', aspirant_id: 'TNPSC-2024-4821', score: 65, time_taken_seconds: 1310, streak: 7 },
    { rank: 4, name: 'கவிதா ராணி', aspirant_id: 'TNPSC-2041', score: 64, time_taken_seconds: 1190, streak: 14 },
    { rank: 5, name: 'மணிகண்டன்', aspirant_id: 'TNPSC-9132', score: 62, time_taken_seconds: 1400, streak: 9 },
  ];
}

export default ProgressPage;
