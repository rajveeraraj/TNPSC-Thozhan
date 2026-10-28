import type {
  DailyQuizData,
  QuizSubmissionPayload,
  QuizSubmissionResult,
  StreakInfo,
  DailyQuizResultItem,
  Question,
  IDailyQuizService,
} from '@/types/api';
import { mockQuestions, initialStreak } from './mockData';
import { apiClient } from './client';

const STREAK_STORAGE_KEY = 'exambuddy_streak';
const COMPLETED_QUIZZES_KEY = 'exambuddy_completed_quizzes';

/**
 * Returns current date string (YYYY-MM-DD) in Asia/Kolkata timezone.
 */
export function getTodayKolkataDate(referenceDate: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(referenceDate);
}

/**
 * Returns yesterday's date string (YYYY-MM-DD) in Asia/Kolkata timezone.
 */
export function getYesterdayKolkataDate(referenceDate: Date = new Date()): string {
  // Subtract 24 hours from reference date
  const prevDate = new Date(referenceDate.getTime() - 24 * 60 * 60 * 1000);
  return getTodayKolkataDate(prevDate);
}

/**
 * Hashes a date string to a 32-bit unsigned integer seed.
 */
export function hashStringToSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

/**
 * Mulberry32 32-bit PRNG generator.
 * Produces deterministic pseudo-random numbers between 0 (inclusive) and 1 (exclusive).
 */
export function createMulberry32(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically shuffles and selects 10 questions for a given date in Asia/Kolkata.
 */
export function selectDailyQuestions(pool: Question[], dateStr: string, count = 10): Question[] {
  const seed = hashStringToSeed(dateStr);
  const random = createMulberry32(seed);

  // Clone pool for Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Calculates day number since epoch reference date (e.g. day #142)
 */
export function calculateQuizDayNumber(dateStr: string): number {
  const ref = new Date('2024-06-25T00:00:00+05:30').getTime();
  const current = new Date(`${dateStr}T00:00:00+05:30`).getTime();
  const diffDays = Math.floor((current - ref) / (24 * 60 * 60 * 1000));
  return Math.max(1, 142 + diffDays);
}

/**
 * Retrieves current streak state from local storage or returns default
 */
export function getStoredStreak(): StreakInfo {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STREAK_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as StreakInfo;
      }
    }
  } catch {
    // Fall back to initial
  }
  return { ...initialStreak };
}

/**
 * Persists streak state to local storage
 */
export function saveStoredStreak(streak: StreakInfo): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
    }
  } catch {
    // Ignore in non-browser env
  }
}

/**
 * Checks if quiz for the given date was already completed
 */
export function isQuizCompletedOnDate(dateStr: string): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(COMPLETED_QUIZZES_KEY);
      if (stored) {
        const completedList = JSON.parse(stored) as string[];
        return completedList.includes(dateStr);
      }
    }
  } catch {
    // Ignore
  }
  return false;
}

/**
 * Marks quiz for the given date as completed
 */
export function markQuizCompletedOnDate(dateStr: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(COMPLETED_QUIZZES_KEY);
      const completedList: string[] = stored ? (JSON.parse(stored) as string[]) : [];
      if (!completedList.includes(dateStr)) {
        completedList.push(dateStr);
        window.localStorage.setItem(COMPLETED_QUIZZES_KEY, JSON.stringify(completedList));
      }
    }
  } catch {
    // Ignore
  }
}

/**
 * Evaluates streak continuity based on last completed date and current submission date.
 */
export function evaluateStreak(currentStreak: StreakInfo, submissionDate: string): {
  updatedStreak: StreakInfo;
  incremented: boolean;
} {
  const { current, best, last_date } = currentStreak;

  // If already submitted today
  if (last_date === submissionDate) {
    return {
      updatedStreak: {
        ...currentStreak,
        is_completed_today: true,
        incremented: false,
      },
      incremented: false,
    };
  }

  // Calculate the day before submissionDate in Asia/Kolkata
  const subDateObj = new Date(`${submissionDate}T12:00:00+05:30`);
  const yesterdayStr = getYesterdayKolkataDate(subDateObj);

  let newCurrent = 1;
  if (last_date === yesterdayStr) {
    // Consecutive day completion!
    newCurrent = current + 1;
  } else {
    // Missed one or more days -> streak resets to 1
    newCurrent = 1;
  }

  const newBest = Math.max(best, newCurrent);
  const updatedStreak: StreakInfo = {
    current: newCurrent,
    best: newBest,
    last_date: submissionDate,
    is_completed_today: true,
    incremented: true,
  };

  return { updatedStreak, incremented: true };
}

class DailyQuizService implements IDailyQuizService {
  public async getTodayQuiz(): Promise<DailyQuizData> {
    if (!apiClient.getMockMode()) {
      const response = await apiClient.get<DailyQuizData>('/quiz/daily');
      return response.data;
    }

    const todayDate = getTodayKolkataDate();
    const dayNumber = calculateQuizDayNumber(todayDate);
    const questions = selectDailyQuestions(mockQuestions, todayDate, 10);
    const isCompleted = isQuizCompletedOnDate(todayDate);

    const quizData: DailyQuizData = {
      quiz_id: dayNumber,
      date: todayDate,
      title: `நாள் #${dayNumber} - சிறப்பு மாதிரித் தேர்வு`,
      subtitle: '10 கேள்விகள் • 10 நிமிடங்கள் • பொது தமிழ் & அரசியல்',
      time_limit_seconds: 600,
      total_questions: questions.length,
      is_completed_today: isCompleted,
      questions,
    };

    return quizData;
  }

  public async submitQuiz(payload: QuizSubmissionPayload): Promise<QuizSubmissionResult> {
    if (!apiClient.getMockMode()) {
      try {
        const response = await apiClient.post<QuizSubmissionResult>('/quiz/daily/submit', payload);
        if (response.data) {
          const res = response.data;
          // Sync streak locally as well
          if (res.streak) {
            saveStoredStreak({
              current: res.streak.current,
              best: res.streak.best,
              last_date: res.streak.last_date || getTodayKolkataDate(),
              is_completed_today: true,
            });
          }
          markQuizCompletedOnDate(payload.date || getTodayKolkataDate());
          return res;
        }
      } catch (err) {
        console.warn('API quiz submission failed, calculating fallback results:', err);
      }
    }

    const { date, answers } = payload;
    const submissionDate = date || getTodayKolkataDate();

    // Map all mock questions for quick lookup
    const questionMap = new Map<number, Question>(mockQuestions.map((q) => [q.id, q]));

    let correctCount = 0;
    const results: DailyQuizResultItem[] = answers.map((ans) => {
      const q = questionMap.get(ans.question_id);
      const correctOption = q ? q.answer : 'A';
      const isCorrect = ans.selected_option === correctOption;
      if (isCorrect) correctCount++;

      return {
        question_id: ans.question_id,
        selected_option: ans.selected_option,
        correct_option: correctOption,
        is_correct: isCorrect,
        explanation: q?.explanation || '',
      };
    });

    const total = answers.length > 0 ? answers.length : 10;
    const accuracy = Math.round((correctCount / total) * 100);

    // Evaluate streak
    const currentStreak = getStoredStreak();
    const { updatedStreak } = evaluateStreak(currentStreak, submissionDate);
    saveStoredStreak(updatedStreak);
    markQuizCompletedOnDate(submissionDate);

    const submissionResult: QuizSubmissionResult = {
      score: correctCount,
      total,
      accuracy_percentage: accuracy,
      streak: updatedStreak,
      results,
    };

    return submissionResult;
  }
}

export const quizService = new DailyQuizService();
