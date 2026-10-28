import React, { useEffect, useState } from 'react';
import { useQuizStore } from '@/store/quizStore';
import QuizHeader from '@/components/quiz/QuizHeader';
import QuestionCard from '@/components/quiz/QuestionCard';
import OptionButton from '@/components/quiz/OptionButton';
import ExplanationCard from '@/components/quiz/ExplanationCard';
import QuizSummaryModal from '@/components/quiz/QuizSummaryModal';
import { t } from '@/i18n';
import type { OptionId } from '@/types/api';

export interface QuizPageProps {
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onClose, onShowToast }) => {
  const {
    dailyQuiz,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isSubmitting,
    isSubmitted,
    submissionResult,
    loadDailyQuiz,
    startQuiz,
    selectOption,
    nextQuestion,
    prevQuestion,
    setTimeRemaining,
    submitCurrentQuiz,
    resetQuiz,
  } = useQuizStore();

  const [isLoading, setIsLoading] = useState(!dailyQuiz);
  const [showSummary, setShowSummary] = useState(false);

  // Initialize Quiz if not already active
  useEffect(() => {
    let mounted = true;

    const initQuiz = async () => {
      try {
        if (!dailyQuiz) {
          const quiz = await loadDailyQuiz();
          if (mounted) {
            startQuiz(quiz);
            setIsLoading(false);
          }
        } else if (!useQuizStore.getState().isQuizActive) {
          startQuiz(dailyQuiz);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          onShowToast?.('வினாக்களை ஏற்றுவதில் பிழை ஏற்பட்டது');
          setIsLoading(false);
        }
      }
    };

    initQuiz();

    return () => {
      mounted = false;
    };
  }, [dailyQuiz, loadDailyQuiz, startQuiz, onShowToast]);

  // Live Timer Countdown Interval
  useEffect(() => {
    if (isSubmitted || isLoading || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      const current = useQuizStore.getState().timeRemaining;
      if (current <= 1) {
        clearInterval(timer);
        setTimeRemaining(0);
        // Automatically submit quiz on time expiration
        handleFinishQuiz();
      } else {
        setTimeRemaining(current - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, isLoading, timeRemaining, setTimeRemaining]);

  const questions = dailyQuiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length || 10;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Selected answer for current question
  const currentAnswerId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isCurrentAnswered = Boolean(currentAnswerId);

  const handleSelectOption = (optionId: OptionId) => {
    if (!currentQuestion) return;
    selectOption(currentQuestion.id, optionId);
  };

  const handleFinishQuiz = async () => {
    try {
      await submitCurrentQuiz();
      setShowSummary(true);
    } catch {
      onShowToast?.('தேர்வை சமர்ப்பிப்பதில் பிழை ஏற்பட்டது');
    }
  };

  const handleGoHome = () => {
    setShowSummary(false);
    resetQuiz();
    onClose();
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-space-md text-on-surface">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-body-md text-on-surface-variant font-medium">
          மாதிரித் தேர்வு தயாராகிறது...
        </p>
      </div>
    );
  }

  const progressPercentage = Math.round(
    ((currentQuestionIndex + 1) / totalQuestions) * 100
  );

  return (
    <div className="flex flex-col gap-space-md animate-fade-in pb-12">
      {/* 1. Header with Question Counter, Timer, and Close button */}
      <QuizHeader
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
        onExit={handleGoHome}
      />

      {/* 2. Linear Progress Bar */}
      <div
        className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-secondary rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 3. Question Card with Category Pill & Audio TTS */}
      <QuestionCard
        question={currentQuestion}
        onAudioError={(msg) => onShowToast?.(msg)}
      />

      {/* 4. Options List */}
      <div className="flex flex-col gap-space-sm" role="radiogroup">
        {currentQuestion.options.map((opt) => (
          <OptionButton
            key={opt.id}
            option={opt}
            selectedOptionId={currentAnswerId}
            correctAnswerId={currentQuestion.answer}
            isAnswered={isCurrentAnswered}
            onSelect={handleSelectOption}
            disabled={isSubmitting}
          />
        ))}
      </div>

      {/* 5. Instant Explanation Card (Appears after answer selection) */}
      {isCurrentAnswered && (
        <ExplanationCard explanation={currentQuestion.explanation} />
      )}

      {/* 6. Bottom Navigation Action Buttons */}
      <div className="flex items-center gap-space-md pt-space-xs mt-auto">
        <button
          type="button"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="flex-1 h-14 bg-surface-container-high hover:bg-surface-bright disabled:opacity-40 disabled:cursor-not-allowed text-on-surface rounded-xl font-bold text-label-md transition-all flex items-center justify-center gap-space-xs cursor-pointer border border-white/5 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          <span>{t('quiz.prev_btn')}</span>
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={handleFinishQuiz}
            disabled={isSubmitting}
            className="flex-1 h-14 bg-gradient-to-r from-secondary-container to-secondary text-on-secondary hover:brightness-105 rounded-xl font-bold text-label-md transition-all flex items-center justify-center gap-space-xs shadow-lg shadow-secondary-container/20 cursor-pointer active:scale-[0.98]"
          >
            <span>
              {isSubmitting ? t('quiz.submitting') : t('quiz.submit_btn')}
            </span>
            <span className="material-symbols-outlined text-[20px]">check</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={nextQuestion}
            disabled={isSubmitting}
            className="flex-1 h-14 bg-secondary-container hover:brightness-110 text-on-secondary-container rounded-xl font-bold text-label-md transition-all flex items-center justify-center gap-space-xs shadow-lg shadow-secondary-container/20 cursor-pointer active:scale-[0.98]"
          >
            <span>{t('quiz.next_btn')}</span>
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </button>
        )}
      </div>

      {/* 7. Quiz Completion Summary Modal */}
      <QuizSummaryModal
        isOpen={showSummary || isSubmitted}
        score={submissionResult?.score ?? 0}
        total={submissionResult?.total ?? totalQuestions}
        submissionResult={submissionResult}
        onGoHome={handleGoHome}
      />
    </div>
  );
};

export default QuizPage;
