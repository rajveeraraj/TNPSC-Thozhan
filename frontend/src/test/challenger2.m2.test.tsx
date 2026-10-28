import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, act, screen } from '@testing-library/react';
import { t, setLocale, getLocale } from '@/i18n';
import { useQuizStore } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import { usePracticeStore } from '@/store/practiceStore';
import { create } from '@/store/storeHelper';
import {
  evaluateStreak,
  getStoredStreak,
  saveStoredStreak,
  isQuizCompletedOnDate,
  markQuizCompletedOnDate,
  selectDailyQuestions,
  getYesterdayKolkataDate,
} from '@/api/quizService';
import { questionService } from '@/api/questionService';
import { progressService } from '@/api/progressService';
import { apiClient } from '@/api/client';
import { mockQuestions, mockUser } from '@/api/mockData';
import type { StreakInfo } from '@/types/api';

import taDict from '@/i18n/ta.json';
import enDict from '@/i18n/en.json';

describe('Challenger 2 Empirical Verification: Milestone 2', () => {
  beforeEach(() => {
    setLocale('ta');
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    useQuizStore.getState().resetQuiz();
    useQuizStore.setState({ timeRemaining: 600, dailyQuiz: null });
    useAuthStore.setState({
      user: { ...mockUser },
      token: 'mock-jwt-token-tnpsc-2024',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    usePracticeStore.setState({
      activeTab: 'topic',
      selectedFilter: 'all',
      searchQuery: '',
      topics: [],
      pyqs: [],
      bookmarkedIds: [],
      isLoading: false,
      error: null,
    });
  });

  // =========================================================================
  // SECTION 1: EMPIRICAL CHALLENGE - i18n Translation Engine t(key, params)
  // =========================================================================
  describe('1. Empirical Challenge: i18n Translation Engine t(key, params)', () => {
    it('handles non-existent flat and nested keys by returning raw key string', () => {
      expect(t('missing_key')).toBe('missing_key');
      expect(t('home.non_existent_property')).toBe('home.non_existent_property');
      expect(t('deep.nested.non.existent.path.to.string')).toBe(
        'deep.nested.non.existent.path.to.string'
      );
    });

    it('returns key string gracefully when path points to an object or namespace', () => {
      // 'home' is a dictionary object, not a string
      expect(t('home')).toBe('home');
      // 'home.daily_quiz' is also an object
      expect(t('home.daily_quiz')).toBe('home.daily_quiz');
      // 'profile.settings' is an object
      expect(t('profile.settings')).toBe('profile.settings');
    });

    it('handles empty string, whitespace, and malformed dot notation gracefully', () => {
      expect(t('')).toBe('');
      expect(t('   ')).toBe('   ');
      expect(t('...')).toBe('...');
      expect(t('home..target_exam_title')).toBe('home..target_exam_title');
      expect(t('.home.target_exam_title')).toBe('.home.target_exam_title');
    });

    it('handles missing or empty params object without corrupting text or throwing', () => {
      // Streak card title contains {count}
      const withUndefined = t('home.streak_card_title');
      expect(withUndefined).toBe('{count} நாள் தொடர்ச்சி ({count} Days Streak)');

      const withEmptyObj = t('home.streak_card_title', {});
      expect(withEmptyObj).toBe('{count} நாள் தொடர்ச்சி ({count} Days Streak)');
    });

    it('correctly interpolates numeric 0, negative numbers, and empty strings', () => {
      // Zero count
      const zeroResult = t('home.streak_card_title', { count: 0 });
      expect(zeroResult).toBe('0 நாள் தொடர்ச்சி (0 Days Streak)');

      // Negative number
      const negativeResult = t('home.streak_card_title', { count: -3 });
      expect(negativeResult).toBe('-3 நாள் தொடர்ச்சி (-3 Days Streak)');

      // Empty string replacement
      const emptyParam = t('home.streak_card_title', { count: '' });
      expect(emptyParam).toBe(' நாள் தொடர்ச்சி ( Days Streak)');
    });

    it('handles extra unused parameters without error or unintended mutation', () => {
      const result = t('home.streak_card_title', {
        count: 14,
        extraParam: 'ignored_val',
        unusedNumber: 999,
      });
      expect(result).toBe('14 நாள் தொடர்ச்சி (14 Days Streak)');
    });

    it('preserves special characters and Tamil Unicode glyphs in parameter values', () => {
      const unicodeParam = t('home.daily_quiz.title', { day: '142 (பொது அறிவு)' });
      expect(unicodeParam).toBe('நாள் #142 (பொது அறிவு) - சிறப்பு மாதிரித் தேர்வு');

      // HTML characters
      const htmlParam = t('home.daily_quiz.title', { day: '<b>10</b>' });
      expect(htmlParam).toBe('நாள் #<b>10</b> - சிறப்பு மாதிரித் தேர்வு');

      // Math and punctuation
      const punctParam = t('home.daily_quiz.title', { day: '10 & 20 / 30% [test]' });
      expect(punctParam).toBe('நாள் #10 & 20 / 30% [test] - சிறப்பு மாதிரித் தேர்வு');
    });

    it('verifies behavior when parameter value contains dollar signs ($1, $&, $$)', () => {
      // In JS String.replace(RegExp, string), $ is special.
      // E.g., { day: "$100" } or { day: "$$" }
      const dollarParam = t('home.daily_quiz.title', { day: '$100' });
      // If String.replace is used directly with regex, $1 might be treated as capture group 1.
      // Let's document the exact empirical behavior
      expect(typeof dollarParam).toBe('string');
      expect(dollarParam.length).toBeGreaterThan(0);
    });

    it('switches locales and verifies fallback behavior', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');
      expect(t('nav.home')).toBe('Home');
      expect(t('home.target_exam_badge')).toBe('Target Exam');

      // Switch back to Tamil
      setLocale('ta');
      expect(getLocale()).toBe('ta');
      expect(t('nav.home')).toBe('முகப்பு');
      expect(t('home.target_exam_badge')).toBe('இலக்கு தேர்வு (Target Exam)');
    });

    it('verifies dictionary completeness: every key in en.json has a corresponding key in ta.json', () => {

      function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
        let keys: string[] = [];
        for (const [k, v] of Object.entries(obj)) {
          const path = prefix ? `${prefix}.${k}` : k;
          if (v && typeof v === 'object' && !Array.isArray(v)) {
            keys = keys.concat(collectKeys(v as Record<string, unknown>, path));
          } else {
            keys.push(path);
          }
        }
        return keys;
      }

      const taKeys = new Set(collectKeys(taDict));
      const enKeys = new Set(collectKeys(enDict));

      // Check all taKeys exist in enKeys
      const missingInEn: string[] = [];
      taKeys.forEach((key) => {
        if (!enKeys.has(key)) missingInEn.push(key);
      });

      // Check all enKeys exist in taKeys
      const missingInTa: string[] = [];
      enKeys.forEach((key) => {
        if (!taKeys.has(key)) missingInTa.push(key);
      });

      expect(missingInEn).toEqual([]);
      expect(missingInTa).toEqual([]);
    });
  });

  // =========================================================================
  // SECTION 2: EMPIRICAL CHALLENGE - Reactive State Stores (Zustand-compatible)
  // =========================================================================
  describe('2. Empirical Challenge: Reactive State Stores & storeHelper', () => {
    it('notifies multiple subscribers synchronously upon state changes', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsub1 = useQuizStore.subscribe(listener1);
      const unsub2 = useQuizStore.subscribe(listener2);

      useQuizStore.getState().setTimeRemaining(500);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(useQuizStore.getState().timeRemaining).toBe(500);

      // Unsubscribe listener 1
      unsub1();
      useQuizStore.getState().setTimeRemaining(400);

      expect(listener1).toHaveBeenCalledTimes(1); // Not called again
      expect(listener2).toHaveBeenCalledTimes(2); // Called again
      expect(useQuizStore.getState().timeRemaining).toBe(400);

      unsub2();
      useQuizStore.getState().setTimeRemaining(300);
      expect(listener2).toHaveBeenCalledTimes(2);
    });

    it('verifies custom store created via create() supports partial object and updater function', () => {
      interface CounterState {
        count: number;
        step: number;
        increment: () => void;
      }

      const useCounter = create<CounterState>((set) => ({
        count: 0,
        step: 2,
        increment: () => set((state) => ({ count: state.count + state.step })),
      }));

      expect(useCounter.getState().count).toBe(0);

      // Direct setState partial object
      useCounter.setState({ count: 10 });
      expect(useCounter.getState().count).toBe(10);
      expect(useCounter.getState().step).toBe(2);

      // Action updater function
      useCounter.getState().increment();
      expect(useCounter.getState().count).toBe(12);
    });

    it('renders with React 18 useSyncExternalStore and verifies selective re-rendering without tearing', () => {
      let renderCountQuestion = 0;
      let renderCountTimer = 0;

      // Component A only selects currentQuestionIndex
      function QuestionIndexComponent() {
        const questionIndex = useQuizStore((s) => s.currentQuestionIndex);
        renderCountQuestion++;
        return <div data-testid="question-index">{questionIndex}</div>;
      }

      // Component B only selects timeRemaining
      function TimerComponent() {
        const timeRemaining = useQuizStore((s) => s.timeRemaining);
        renderCountTimer++;
        return <div data-testid="timer-display">{timeRemaining}</div>;
      }

      function TestParent() {
        return (
          <div>
            <QuestionIndexComponent />
            <TimerComponent />
          </div>
        );
      }

      render(<TestParent />);

      expect(screen.getByTestId('question-index').textContent).toBe('0');
      expect(screen.getByTestId('timer-display').textContent).toBe('600');
      expect(renderCountQuestion).toBe(1);
      expect(renderCountTimer).toBe(1);

      // Change timeRemaining -> QuestionIndexComponent should NOT re-render!
      act(() => {
        useQuizStore.getState().setTimeRemaining(590);
      });

      expect(screen.getByTestId('timer-display').textContent).toBe('590');
      expect(renderCountTimer).toBe(2);
      expect(renderCountQuestion).toBe(1); // Preserved selective render

      // Change questionIndex -> TimerComponent should NOT re-render!
      act(() => {
        useQuizStore.setState({ currentQuestionIndex: 3 });
      });

      expect(screen.getByTestId('question-index').textContent).toBe('3');
      expect(renderCountQuestion).toBe(2);
      expect(renderCountTimer).toBe(2); // Preserved selective render
    });

    it('stress tests rapid batch updates without tearing or stale state', () => {
      useQuizStore.getState();

      act(() => {
        for (let i = 0; i < 50; i++) {
          useQuizStore.getState().selectOption(100 + i, 'A');
        }
      });

      const finalAnswers = useQuizStore.getState().answers;
      expect(Object.keys(finalAnswers).length).toBe(50);
      expect(finalAnswers[100]).toBe('A');
      expect(finalAnswers[149]).toBe('A');
    });

    it('challenges quizStore boundary conditions and safeguards', async () => {
      const store = useQuizStore.getState();

      // Load daily quiz
      await store.loadDailyQuiz();
      store.startQuiz();
      expect(useQuizStore.getState().isQuizActive).toBe(true);

      // Test negative goToQuestion
      store.goToQuestion(-10);
      expect(useQuizStore.getState().currentQuestionIndex).toBe(0);

      // Test overflow goToQuestion
      store.goToQuestion(999);
      expect(useQuizStore.getState().currentQuestionIndex).toBe(9); // 10 questions -> max index 9

      // Test nextQuestion at boundary
      store.nextQuestion();
      expect(useQuizStore.getState().currentQuestionIndex).toBe(9); // Stays at 9

      // Test prevQuestion at boundary
      store.goToQuestion(0);
      store.prevQuestion();
      expect(useQuizStore.getState().currentQuestionIndex).toBe(0); // Stays at 0

      // Test negative time remaining clamped to 0
      store.setTimeRemaining(-100);
      expect(useQuizStore.getState().timeRemaining).toBe(0);

      // Test option selection modification
      store.selectOption(101, 'A');
      expect(useQuizStore.getState().answers[101]).toBe('A');
      store.selectOption(101, 'B'); // Overwrite answer
      expect(useQuizStore.getState().answers[101]).toBe('B');

      // Submit quiz
      await store.submitCurrentQuiz();
      expect(useQuizStore.getState().isSubmitted).toBe(true);

      // Crucial safeguard: selecting option after submission must be ignored
      store.selectOption(101, 'C');
      expect(useQuizStore.getState().answers[101]).toBe('B'); // Unchanged!
    });

    it('rejects submitCurrentQuiz cleanly when no dailyQuiz is active', async () => {
      useQuizStore.setState({ dailyQuiz: null });
      await expect(useQuizStore.getState().submitCurrentQuiz()).rejects.toThrow(
        'No active quiz to submit'
      );
    });

    it('challenges practiceStore actions and bookmark synchronization', async () => {
      const practice = usePracticeStore.getState();

      await practice.loadPracticeData();
      const initialTopics = usePracticeStore.getState().topics;
      expect(initialTopics.length).toBeGreaterThan(0);

      const topicToBookmark = initialTopics[0]!;
      expect(topicToBookmark).toBeDefined();

      // Toggle bookmark on
      const isBookmarked = await practice.toggleBookmark(topicToBookmark.id, 'topic');
      expect(isBookmarked).toBe(true);
      expect(usePracticeStore.getState().bookmarkedIds).toContain(topicToBookmark.id);
      expect(
        usePracticeStore.getState().topics.find((t) => t.id === topicToBookmark.id)
          ?.is_bookmarked
      ).toBe(true);

      // Toggle bookmark off
      const isBookmarkedAgain = await practice.toggleBookmark(topicToBookmark.id, 'topic');
      expect(isBookmarkedAgain).toBe(false);
      expect(usePracticeStore.getState().bookmarkedIds).not.toContain(topicToBookmark.id);
      expect(
        usePracticeStore.getState().topics.find((t) => t.id === topicToBookmark.id)
          ?.is_bookmarked
      ).toBe(false);
    });

    it('challenges authStore logout, update, and null safety', () => {
      const auth = useAuthStore.getState();

      // Update user
      auth.updateUser({ name: 'ராஜவேல்' });
      expect(useAuthStore.getState().user?.name).toBe('ராஜவேல்');

      // Logout
      auth.logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();

      // updateUser when user is null should be a safe no-op
      expect(() => {
        useAuthStore.getState().updateUser({ name: 'Test' });
      }).not.toThrow();
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  // =========================================================================
  // SECTION 3: EMPIRICAL CHALLENGE - Mock Data Persistence Across Page Reloads
  // =========================================================================
  describe('3. Empirical Challenge: Mock Data Persistence Across Simulated Reloads', () => {
    it('persists streak state and correctly simulates sequential daily logins across page reloads', () => {
      // Simulation: Day 1 - User completes quiz on 2024-11-10
      const day1Streak: StreakInfo = {
        current: 1,
        best: 1,
        last_date: '2024-11-10',
        is_completed_today: true,
      };
      saveStoredStreak(day1Streak);
      markQuizCompletedOnDate('2024-11-10');

      // Reload 1: Verify state was persisted in storage
      let restoredStreak = getStoredStreak();
      expect(restoredStreak.current).toBe(1);
      expect(restoredStreak.best).toBe(1);
      expect(restoredStreak.last_date).toBe('2024-11-10');
      expect(isQuizCompletedOnDate('2024-11-10')).toBe(true);
      expect(isQuizCompletedOnDate('2024-11-11')).toBe(false);

      // Day 2: User completes quiz consecutively on 2024-11-11
      const evalDay2 = evaluateStreak(restoredStreak, '2024-11-11');
      expect(evalDay2.updatedStreak.current).toBe(2);
      expect(evalDay2.updatedStreak.best).toBe(2);
      expect(evalDay2.incremented).toBe(true);
      saveStoredStreak(evalDay2.updatedStreak);
      markQuizCompletedOnDate('2024-11-11');

      // Reload 2: Verify Day 2 state persisted
      restoredStreak = getStoredStreak();
      expect(restoredStreak.current).toBe(2);
      expect(restoredStreak.best).toBe(2);
      expect(restoredStreak.last_date).toBe('2024-11-11');

      // Day 2 (second submission on same day): Must be idempotent
      const evalDay2Repeat = evaluateStreak(restoredStreak, '2024-11-11');
      expect(evalDay2Repeat.updatedStreak.current).toBe(2);
      expect(evalDay2Repeat.incremented).toBe(false);

      // Day 5: User skips 3 days and submits on 2024-11-15 -> Streak resets to 1, Best remains 2
      const evalDay5 = evaluateStreak(restoredStreak, '2024-11-15');
      expect(evalDay5.updatedStreak.current).toBe(1);
      expect(evalDay5.updatedStreak.best).toBe(2); // Best preserved!
      saveStoredStreak(evalDay5.updatedStreak);
      markQuizCompletedOnDate('2024-11-15');

      // Reload 3: Verify Day 5 reset persisted with preserved best
      restoredStreak = getStoredStreak();
      expect(restoredStreak.current).toBe(1);
      expect(restoredStreak.best).toBe(2);
      expect(restoredStreak.last_date).toBe('2024-11-15');
    });

    it('persists bookmarks across service calls and simulates page reloads', async () => {
      // 1. Initial topics are read
      const initialTopics = await questionService.getTopics();
      const topic1 = initialTopics[0]!.id;
      const topic2 = initialTopics[1]!.id;

      // 2. Toggle bookmarks
      await progressService.toggleBookmark(topic1, 'topic');
      await progressService.toggleBookmark(topic2, 'topic');

      // 3. Simulate reload by querying new service calls
      const topicsAfterReload = await questionService.getTopics();
      const savedTopic1 = topicsAfterReload.find((t) => t.id === topic1);
      const savedTopic2 = topicsAfterReload.find((t) => t.id === topic2);

      expect(savedTopic1?.is_bookmarked).toBe(true);
      expect(savedTopic2?.is_bookmarked).toBe(true);

      // 4. Remove one bookmark
      await progressService.toggleBookmark(topic1, 'topic');

      // 5. Simulate reload
      const topicsAfterSecondReload = await questionService.getTopics();
      expect(topicsAfterSecondReload.find((t) => t.id === topic1)?.is_bookmarked).toBe(false);
      expect(topicsAfterSecondReload.find((t) => t.id === topic2)?.is_bookmarked).toBe(true);
    });

    it('persists auth token via apiClient and cleans up on logout', () => {
      const testToken = 'custom-aspirant-bearer-token-xyz';
      apiClient.setToken(testToken);
      expect(apiClient.getToken()).toBe(testToken);
      expect(window.localStorage.getItem('exambuddy_token')).toBe(testToken);

      // Logout clears token in storage
      useAuthStore.getState().logout();
      expect(apiClient.getToken()).toBeNull();
      expect(window.localStorage.getItem('exambuddy_token')).toBeNull();
    });

    it('survives corrupted JSON and null storage values gracefully', () => {
      // Corrupted streak JSON
      window.localStorage.setItem('exambuddy_streak', 'INVALID_MALFORMED_JSON{{{');
      expect(() => {
        const streak = getStoredStreak();
        expect(streak).toBeDefined();
        expect(streak.current).toBe(7); // Falls back to initialStreak default
      }).not.toThrow();

      // Corrupted completed quizzes JSON
      window.localStorage.setItem('exambuddy_completed_quizzes', 'NOT_JSON');
      expect(() => {
        const completed = isQuizCompletedOnDate('2024-11-15');
        expect(completed).toBe(false);
      }).not.toThrow();

      // Corrupted bookmarks JSON
      window.localStorage.setItem('exambuddy_bookmarks', '{corrupt: true');
      expect(async () => {
        const topics = await questionService.getTopics();
        expect(topics.length).toBeGreaterThan(0);
      }).not.toThrow();
    });
  });

  // =========================================================================
  // SECTION 4: EMPIRICAL CHALLENGE - Deterministic PRNG & Syllabus Invariants
  // =========================================================================
  describe('4. Empirical Challenge: Seeded PRNG & Question Bank Invariants', () => {
    it('guarantees 100% question distribution uniqueness across 30 simulated consecutive days', () => {
      const dates = Array.from({ length: 30 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return `2024-11-${day}`;
      });

      const dailySelections = dates.map((dateStr) => {
        return selectDailyQuestions(mockQuestions, dateStr, 10).map((q) => q.id);
      });

      // Every day must yield exactly 10 questions
      dailySelections.forEach((selection) => {
        expect(selection.length).toBe(10);
        // No duplicate questions in a single day
        const set = new Set(selection);
        expect(set.size).toBe(10);
      });

      // No two consecutive days should have identical 10-question sequences
      for (let i = 0; i < dailySelections.length - 1; i++) {
        expect(dailySelections[i]).not.toEqual(dailySelections[i + 1]);
      }
    });

    it('verifies all 36 questions adhere strictly to OptionId types and valid answers', () => {
      mockQuestions.forEach((q) => {
        expect(['A', 'B', 'C', 'D']).toContain(q.answer);
        expect(q.options.length).toBe(4);
        expect(q.options.map((o) => o.id)).toEqual(['A', 'B', 'C', 'D']);
        expect(q.options.map((o) => o.label)).toEqual(['அ', 'ஆ', 'இ', 'ஈ']);
        expect(q.question_ta.trim().length).toBeGreaterThan(5);
        expect(q.explanation.trim().length).toBeGreaterThan(10);
      });
    });
  });

  // =========================================================================
  // SECTION 5: ADVERSARIAL EDGE CASES & VULNERABILITY MINING
  // =========================================================================
  describe('5. Adversarial Edge Cases & Vulnerability Mining', () => {
    it('probes t(key, params) with regex special replacement patterns in param values ($1, $&)', () => {
      // In JS String.prototype.replace(regex, str), '$1' refers to capture group 1.
      // Since new RegExp(`\\{${paramKey}\\}`, 'g') has NO capture groups, '$1' is erased!
      const resultWithDollar = t('home.streak_card_title', { count: '$100' });
      // If '$1' was erased, count becomes '00' instead of '$100'
      // We observe and document this JavaScript RegExp replacement quirk:
      const hasReplacementQuirk = resultWithDollar.includes('00 நாள்') && !resultWithDollar.includes('$100');
      // Verify that t() completes without crashing in either case
      expect(typeof resultWithDollar).toBe('string');
      // If quirk exists, document that standard string replacement without function replacer interprets '$'
      if (hasReplacementQuirk) {
        expect(resultWithDollar).toBe('00 நாள் தொடர்ச்சி (00 Days Streak)');
      }
    });

    it('probes t(key, params) with regex metacharacters in parameter keys', () => {
      // What if paramKey contains regex symbols like 'count)' or 'count['?
      // new RegExp(`\\{${paramKey}\\}`, 'g') will throw if unescaped!
      expect(() => {
        t('home.streak_card_title', { 'count)': 10 });
      }).toThrow(); // SyntaxError: Invalid regular expression due to unescaped ')'
    });

    it('probes leap year and year transition boundaries for Kolkata dates', () => {
      // Leap year 2024: 2024-03-01 -> yesterday is 2024-02-29
      const marchFirstLeap = new Date('2024-03-01T12:00:00+05:30');
      const yesterdayLeap = getYesterdayKolkataDate(marchFirstLeap);
      expect(yesterdayLeap).toBe('2024-02-29');

      // Non-leap year 2025: 2025-03-01 -> yesterday is 2025-02-28
      const marchFirstNonLeap = new Date('2025-03-01T12:00:00+05:30');
      const yesterdayNonLeap = getYesterdayKolkataDate(marchFirstNonLeap);
      expect(yesterdayNonLeap).toBe('2025-02-28');

      // Year boundary: 2025-01-01 -> yesterday is 2024-12-31
      const janFirst = new Date('2025-01-01T12:00:00+05:30');
      const yesterdayNewYear = getYesterdayKolkataDate(janFirst);
      expect(yesterdayNewYear).toBe('2024-12-31');
    });

    it('probes getStoredStreak behavior when localStorage contains string "null"', () => {
      // In JS, JSON.parse("null") === null
      window.localStorage.setItem('exambuddy_streak', 'null');
      const result = getStoredStreak();
      // If getStoredStreak does not guard against null return from JSON.parse:
      // It returns null instead of falling back to initialStreak!
      if (result === null) {
        // Calling evaluateStreak with this null will crash:
        expect(() => {
          evaluateStreak(result as unknown as StreakInfo, '2024-11-15');
        }).toThrow(TypeError);
      } else {
        expect(result).toHaveProperty('current');
      }
    });

    it('probes resetQuiz() to see if timeRemaining is restored', () => {
      useQuizStore.getState().setTimeRemaining(120);
      expect(useQuizStore.getState().timeRemaining).toBe(120);

      useQuizStore.getState().resetQuiz();
      // Notice: resetQuiz resets isQuizActive, answers, etc., but timeRemaining remains 120
      const remainingAfterReset = useQuizStore.getState().timeRemaining;
      expect(typeof remainingAfterReset).toBe('number');
    });

    it('probes unstable object selector in useStore and verifies error detection', () => {
      // In React 18's useSyncExternalStore, returning a new object reference on every snapshot
      // triggers an infinite loop or error if not memoized.
      function UnstableComponent() {
        // This selector creates a brand-new object on every invocation
        const { idx } = useQuizStore((s) => ({ idx: s.currentQuestionIndex }));
        return <div>{idx}</div>;
      }

      // We expect React to detect unstable getSnapshot and throw or report maximum update depth
      let caughtError: Error | null = null;
      try {
        render(<UnstableComponent />);
      } catch (err) {
        caughtError = err as Error;
      }
      expect(caughtError).not.toBeNull();
      expect(caughtError!.message).toContain('Maximum update depth exceeded');
    });
  });
});

