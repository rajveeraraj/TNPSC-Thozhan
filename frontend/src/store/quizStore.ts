import { create } from './storeHelper';
import type {
  DailyQuizData,
  OptionId,
  QuizSubmissionResult,
} from '@/types/api';
import { quizService } from '@/api/quizService';

export interface QuizState {
  dailyQuiz: DailyQuizData | null;
  currentQuestionIndex: number;
  answers: Record<number, OptionId>;
  timeRemaining: number;
  isQuizActive: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submissionResult: QuizSubmissionResult | null;
  error: string | null;

  // Actions
  loadDailyQuiz: () => Promise<DailyQuizData>;
  startQuiz: (customQuiz?: DailyQuizData) => void;
  selectOption: (questionId: number, optionId: OptionId) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setTimeRemaining: (time: number) => void;
  submitCurrentQuiz: () => Promise<QuizSubmissionResult>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  dailyQuiz: null,
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 600, // 10 minutes default
  isQuizActive: false,
  isSubmitting: false,
  isSubmitted: false,
  submissionResult: null,
  error: null,

  loadDailyQuiz: async () => {
    try {
      const quiz = await quizService.getTodayQuiz();
      set({
        dailyQuiz: quiz,
        timeRemaining: quiz.time_limit_seconds || 600,
        error: null,
      });
      return quiz;
    } catch (err) {
      const message = (err as Error)?.message || 'Failed to load daily quiz';
      set({ error: message });
      throw err;
    }
  },

  startQuiz: (customQuiz?: DailyQuizData) => {
    const quiz = customQuiz || get().dailyQuiz;
    if (!quiz) return;

    set({
      dailyQuiz: quiz,
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: quiz.time_limit_seconds || 600,
      isQuizActive: true,
      isSubmitted: false,
      submissionResult: null,
      error: null,
    });
  },

  selectOption: (questionId: number, optionId: OptionId) => {
    const { answers, isSubmitted } = get();
    if (isSubmitted) return;

    set({
      answers: {
        ...answers,
        [questionId]: optionId,
      },
    });
  },

  goToQuestion: (index: number) => {
    const { dailyQuiz } = get();
    if (!dailyQuiz) return;
    const maxIndex = dailyQuiz.questions.length - 1;
    const boundedIndex = Math.max(0, Math.min(index, maxIndex));
    set({ currentQuestionIndex: boundedIndex });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, dailyQuiz } = get();
    if (!dailyQuiz) return;
    if (currentQuestionIndex < dailyQuiz.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  setTimeRemaining: (time: number) => {
    set({ timeRemaining: Math.max(0, time) });
  },

  submitCurrentQuiz: async () => {
    const { dailyQuiz, answers, timeRemaining } = get();
    if (!dailyQuiz) {
      throw new Error('No active quiz to submit');
    }

    set({ isSubmitting: true, error: null });

    try {
      const payloadAnswers: { question_id: number; selected_option: OptionId }[] = [];
      for (const q of dailyQuiz.questions) {
        const selected = answers[q.id];
        if (selected) {
          payloadAnswers.push({
            question_id: q.id,
            selected_option: selected,
          });
        }
      }

      const timeTaken = Math.max(
        0,
        (dailyQuiz.time_limit_seconds || 600) - timeRemaining
      );

      const result = await quizService.submitQuiz({
        quiz_id: dailyQuiz.quiz_id,
        date: dailyQuiz.date,
        time_taken_seconds: timeTaken,
        answers: payloadAnswers,
      });

      set({
        isSubmitting: false,
        isSubmitted: true,
        submissionResult: result,
      });

      return result;
    } catch (err) {
      const msg = (err as Error)?.message || 'Quiz submission failed';
      set({ isSubmitting: false, error: msg });
      throw err;
    }
  },

  resetQuiz: () => {
    set({
      currentQuestionIndex: 0,
      answers: {},
      isQuizActive: false,
      isSubmitted: false,
      isSubmitting: false,
      submissionResult: null,
      error: null,
    });
  },
}));
