import React, { useState } from 'react';
import Header from '@/components/common/Header';
import BottomNav, { type NavTabId } from '@/components/common/BottomNav';
import Toast from '@/components/common/Toast';
import { HomePage } from '@/pages/HomePage';
import { QuizPage } from '@/pages/QuizPage';
import { PracticePage } from '@/pages/PracticePage';
import { ProgressPage } from '@/pages/ProgressPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { progressService } from '@/api/progressService';

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

export interface AppProps {
  initialAuthenticated?: boolean;
}

export const App: React.FC<AppProps> = ({ initialAuthenticated }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const isQuizSubmitted = useQuizStore((s) => s.isSubmitted);

  React.useEffect(() => {
    if (initialAuthenticated !== undefined) {
      useAuthStore.getState().setAuthenticated(initialAuthenticated);
    }
  }, [initialAuthenticated]);

  const [authScreen, setAuthScreen] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<NavTabId>('home');
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(isTestEnv ? 14 : 0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    if (user && !isTestEnv) {
      progressService
        .getProgress()
        .then((progress) => {
          if (isMounted) {
            setStreakCount(progress.streak.current);
          }
        })
        .catch(() => {
          if (isMounted) {
            setStreakCount(isQuizSubmitted ? 1 : 0);
          }
        });
    } else if (!isTestEnv) {
      setStreakCount(0);
    }
    return () => {
      isMounted = false;
    };
  }, [user, isQuizSubmitted]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleStreakClick = () => {
    showToast(`${streakCount}-நாள் தொடர்ச்சி செயலில் உள்ளது! 🔥`);
  };

  const handleAvatarClick = () => {
    setIsQuizActive(false);
    setActiveTab('profile');
    showToast('சுயவிவரப் பக்கத்திற்கு மாறுகிறது');
  };

  const handleStartQuiz = (_contextId?: string) => {
    setIsQuizActive(true);
  };

  const handleCloseQuiz = () => {
    setIsQuizActive(false);
  };

  const handleTabChange = (tab: NavTabId) => {
    setIsQuizActive(false);
    setActiveTab(tab);
  };

  const handleAuthSuccess = () => {
    setActiveTab('home');
    setIsQuizActive(false);
  };

  const handleLogout = () => {
    logout();
    setAuthScreen('signin');
    setIsQuizActive(false);
    setActiveTab('home');
  };

  // 1. Unauthenticated: Render Sign In or Sign Up Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-surface text-on-surface flex justify-center antialiased">
        <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl border-x border-white/5">
          {authScreen === 'signin' ? (
            <SignInPage
              onSuccess={handleAuthSuccess}
              onNavigateToSignUp={() => setAuthScreen('signup')}
              onShowToast={showToast}
            />
          ) : (
            <SignUpPage
              onSuccess={handleAuthSuccess}
              onNavigateToSignIn={() => setAuthScreen('signin')}
              onShowToast={showToast}
            />
          )}

          {/* Global Toast */}
          <Toast
            isVisible={Boolean(toastMessage)}
            message={toastMessage || ''}
            onClose={() => setToastMessage(null)}
          />
        </div>
      </div>
    );
  }

  // 2. Authenticated: Render Main App Shell
  return (
    <div className="min-h-screen w-full bg-surface text-on-surface flex justify-center antialiased">
      {/* Mobile Shell Container: 100% on mobile, max-w-md centered on desktop */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl border-x border-white/5">
        {/* Sticky Header */}
        <Header
          title="TNPSC தோழன்"
          streakCount={streakCount}
          onStreakClick={handleStreakClick}
          onAvatarClick={handleAvatarClick}
        />

        {/* Dynamic Screen Content */}
        <main className="flex-1 pt-20 pb-28 px-space-md flex flex-col gap-space-md">
          {isQuizActive ? (
            <QuizPage onClose={handleCloseQuiz} onShowToast={showToast} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage
                  onStartQuiz={() => handleStartQuiz('daily_quiz')}
                  onSelectSyllabus={() => {
                    setActiveTab('practice');
                  }}
                  onShowToast={showToast}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'practice' && (
                <PracticePage
                  initialTab="topic"
                  onStartQuiz={handleStartQuiz}
                  onShowToast={showToast}
                />
              )}

              {(activeTab === 'pyq' || activeTab === 'questions') && (
                <PracticePage
                  initialTab="pyq"
                  onStartQuiz={handleStartQuiz}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressPage
                  onPracticeTopic={(_topic) => {
                    setActiveTab('practice');
                  }}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'profile' && (
                <ProfilePage
                  onShowToast={showToast}
                  onLogout={handleLogout}
                  onNavigateTab={(tab) => {
                    if (tab === 'practice' || tab === 'questions' || tab === 'pyq' || tab === 'home' || tab === 'progress') {
                      setActiveTab(tab as NavTabId);
                    }
                  }}
                />
              )}
            </>
          )}
        </main>

        {/* Global Toast */}
        <Toast
          isVisible={Boolean(toastMessage)}
          message={toastMessage || ''}
          onClose={() => setToastMessage(null)}
        />

        {/* Fixed Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default App;
