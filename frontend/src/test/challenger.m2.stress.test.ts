import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashStringToSeed,
  createMulberry32,
  selectDailyQuestions,
  getTodayKolkataDate,
  getYesterdayKolkataDate,
  evaluateStreak,
  calculateQuizDayNumber,
  quizService,
} from '@/api/quizService';
import { questionService } from '@/api/questionService';
import { mockQuestions } from '@/api/mockData';
import { useQuizStore } from '@/store/quizStore';
import { usePracticeStore } from '@/store/practiceStore';
import type { StreakInfo } from '@/types/api';

describe('Challenger M2 Stress & Adversarial Test Suite', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    useQuizStore.getState().resetQuiz();
  });

  // =========================================================================
  // SECTION 1: Mulberry32 PRNG Determinism & Daily Question Selection
  // =========================================================================
  describe('Section 1: Mulberry32 PRNG Determinism & Question Selection', () => {
    it('hashStringToSeed is deterministic and handles arbitrary strings', () => {
      const seed1 = hashStringToSeed('2024-11-15');
      const seed2 = hashStringToSeed('2024-11-15');
      expect(seed1).toBe(seed2);
      expect(typeof seed1).toBe('number');

      // Edge cases: empty string, unicode string
      const emptySeed = hashStringToSeed('');
      expect(typeof emptySeed).toBe('number');
      const unicodeSeed = hashStringToSeed('தமிழ்-2024-11-15');
      expect(typeof unicodeSeed).toBe('number');
      expect(unicodeSeed).not.toBe(seed1);
    });

    it('Mulberry32 PRNG produces numbers strictly in [0, 1) and passes basic uniform distribution', () => {
      const seed = 987654321;
      const rng = createMulberry32(seed);
      const samples = 10000;
      let min = 1;
      let max = 0;
      let sum = 0;

      for (let i = 0; i < samples; i++) {
        const val = rng();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
        if (val < min) min = val;
        if (val > max) max = val;
        sum += val;
      }

      // Mean should be close to 0.5 for uniform distribution (within 0.02)
      const mean = sum / samples;
      expect(mean).toBeGreaterThan(0.48);
      expect(mean).toBeLessThan(0.52);
      expect(min).toBeLessThan(0.01);
      expect(max).toBeGreaterThan(0.99);
    });

    it('same date string always produces the exact same 10 questions and same options', () => {
      const datesToTest = [
        '2024-01-01',
        '2024-02-29', // Leap day
        '2024-08-15',
        '2024-12-31',
        '2025-06-10',
        '2030-01-01', // Far future
        '1970-01-01', // Epoch
      ];

      for (const d of datesToTest) {
        const run1 = selectDailyQuestions(mockQuestions, d, 10);
        const run2 = selectDailyQuestions(mockQuestions, d, 10);
        const run3 = selectDailyQuestions(mockQuestions, d, 10);

        expect(run1.length).toBe(10);
        expect(run2.length).toBe(10);
        expect(run3.length).toBe(10);

        // Verify IDs and question order
        const ids1 = run1.map((q) => q.id);
        const ids2 = run2.map((q) => q.id);
        const ids3 = run3.map((q) => q.id);
        expect(ids1).toEqual(ids2);
        expect(ids2).toEqual(ids3);

        // Verify options and option order
        for (let i = 0; i < 10; i++) {
          expect(run1[i]!.options).toEqual(run2[i]!.options);
          expect(run2[i]!.options).toEqual(run3[i]!.options);
          expect(run1[i]!.answer).toBe(run2[i]!.answer);
        }
      }
    });

    it('365 sequential dates test: no two consecutive days produce the exact same 10 questions, and all questions get selected', () => {
      const startDate = new Date('2024-01-01T12:00:00+05:30');
      const questionCounts = new Map<number, number>();
      mockQuestions.forEach((q) => questionCounts.set(q.id, 0));

      let prevQuestionIds: number[] = [];

      for (let day = 0; day < 365; day++) {
        const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
        const dateStr = getTodayKolkataDate(currentDate);

        const dailyQuestions = selectDailyQuestions(mockQuestions, dateStr, 10);
        expect(dailyQuestions.length).toBe(10);

        const currentIds = dailyQuestions.map((q) => q.id);
        const uniqueIds = new Set(currentIds);
        expect(uniqueIds.size).toBe(10); // No duplicates within single day

        if (prevQuestionIds.length > 0) {
          // Consecutive days must NOT have identical question selection
          expect(currentIds).not.toEqual(prevQuestionIds);
        }

        currentIds.forEach((id) => {
          questionCounts.set(id, (questionCounts.get(id) || 0) + 1);
        });

        prevQuestionIds = currentIds;
      }

      // Over 365 days, every single question in the pool must be selected at least once
      for (const count of questionCounts.values()) {
        expect(count).toBeGreaterThan(0);
      }
    });

    it('handles count boundaries gracefully (0, 1, 5, pool size, exceeding pool size)', () => {
      const dateStr = '2024-11-15';
      const count0 = selectDailyQuestions(mockQuestions, dateStr, 0);
      expect(count0).toEqual([]);

      const count1 = selectDailyQuestions(mockQuestions, dateStr, 1);
      expect(count1.length).toBe(1);

      const count5 = selectDailyQuestions(mockQuestions, dateStr, 5);
      expect(count5.length).toBe(5);

      const countAll = selectDailyQuestions(mockQuestions, dateStr, mockQuestions.length);
      expect(countAll.length).toBe(mockQuestions.length);

      // Exceeding pool size clamps to pool size
      const countExcess = selectDailyQuestions(mockQuestions, dateStr, 999);
      expect(countExcess.length).toBe(mockQuestions.length);
      const uniqueExcess = new Set(countExcess.map((q) => q.id));
      expect(uniqueExcess.size).toBe(mockQuestions.length);
    });

    it('does not mutate the source question pool', () => {
      const poolCopy = JSON.parse(JSON.stringify(mockQuestions));
      selectDailyQuestions(mockQuestions, '2024-05-20', 10);
      expect(mockQuestions).toEqual(poolCopy);
    });

    it('calculateQuizDayNumber returns valid positive progression', () => {
      const dayNum1 = calculateQuizDayNumber('2024-06-25');
      expect(dayNum1).toBe(142);
      const dayNum2 = calculateQuizDayNumber('2024-06-26');
      expect(dayNum2).toBe(143);
      const dayPast = calculateQuizDayNumber('2020-01-01');
      expect(dayPast).toBe(1);
    });
  });

  // =========================================================================
  // SECTION 2: Streak Continuity Logic Edge Cases & Long-Term Simulation
  // =========================================================================
  describe('Section 2: Streak Continuity Edge Cases & Calendar Boundaries', () => {
    it('getYesterdayKolkataDate calculates yesterday across leap day and year boundaries', () => {
      const leapDay = new Date('2024-03-01T12:00:00+05:30');
      expect(getYesterdayKolkataDate(leapDay)).toBe('2024-02-29');

      const nonLeapDay = new Date('2023-03-01T12:00:00+05:30');
      expect(getYesterdayKolkataDate(nonLeapDay)).toBe('2023-02-28');

      const newYear = new Date('2025-01-01T12:00:00+05:30');
      expect(getYesterdayKolkataDate(newYear)).toBe('2024-12-31');
    });

    it('edge case: first day ever starts at streak 1, best 1', () => {
      const initial: StreakInfo = { current: 0, best: 0, last_date: '' };
      const { updatedStreak, incremented } = evaluateStreak(initial, '2024-05-10');

      expect(updatedStreak.current).toBe(1);
      expect(updatedStreak.best).toBe(1);
      expect(updatedStreak.last_date).toBe('2024-05-10');
      expect(updatedStreak.is_completed_today).toBe(true);
      expect(incremented).toBe(true);
    });

    it('edge case: leap day continuity (2024-02-28 -> 2024-02-29 -> 2024-03-01)', () => {
      let streak: StreakInfo = { current: 5, best: 5, last_date: '2024-02-28' };

      // Day 1: Leap day
      const res1 = evaluateStreak(streak, '2024-02-29');
      expect(res1.updatedStreak.current).toBe(6);
      expect(res1.updatedStreak.last_date).toBe('2024-02-29');
      expect(res1.incremented).toBe(true);

      // Day 2: Day after leap day
      streak = res1.updatedStreak;
      const res2 = evaluateStreak(streak, '2024-03-01');
      expect(res2.updatedStreak.current).toBe(7);
      expect(res2.updatedStreak.last_date).toBe('2024-03-01');
      expect(res2.incremented).toBe(true);
    });

    it('edge case: non-leap year boundary (2023-02-28 -> 2023-03-01)', () => {
      const streak: StreakInfo = { current: 10, best: 10, last_date: '2023-02-28' };
      const res = evaluateStreak(streak, '2023-03-01');

      expect(res.updatedStreak.current).toBe(11);
      expect(res.updatedStreak.last_date).toBe('2023-03-01');
      expect(res.incremented).toBe(true);
    });

    it('edge case: year crossover continuity (2024-12-31 -> 2025-01-01)', () => {
      const streak: StreakInfo = { current: 20, best: 20, last_date: '2024-12-31' };
      const res = evaluateStreak(streak, '2025-01-01');

      expect(res.updatedStreak.current).toBe(21);
      expect(res.updatedStreak.best).toBe(21);
      expect(res.updatedStreak.last_date).toBe('2025-01-01');
      expect(res.incremented).toBe(true);
    });

    it('edge case: same day re-submit retains current and best without incrementing', () => {
      const streak: StreakInfo = { current: 15, best: 25, last_date: '2024-07-20' };
      const res = evaluateStreak(streak, '2024-07-20');

      expect(res.updatedStreak.current).toBe(15);
      expect(res.updatedStreak.best).toBe(25);
      expect(res.updatedStreak.last_date).toBe('2024-07-20');
      expect(res.incremented).toBe(false);
      expect(res.updatedStreak.is_completed_today).toBe(true);
    });

    it('edge case: skipped single day (2-day gap) resets current to 1 while preserving best', () => {
      const streak: StreakInfo = { current: 14, best: 30, last_date: '2024-07-18' };
      // User skips 2024-07-19, submits on 2024-07-20
      const res = evaluateStreak(streak, '2024-07-20');

      expect(res.updatedStreak.current).toBe(1);
      expect(res.updatedStreak.best).toBe(30);
      expect(res.updatedStreak.last_date).toBe('2024-07-20');
      expect(res.incremented).toBe(true);
    });

    it('edge case: multi-month gap resets current to 1 while preserving best', () => {
      const streak: StreakInfo = { current: 40, best: 40, last_date: '2024-01-01' };
      const res = evaluateStreak(streak, '2024-09-15');

      expect(res.updatedStreak.current).toBe(1);
      expect(res.updatedStreak.best).toBe(40);
      expect(res.updatedStreak.last_date).toBe('2024-09-15');
      expect(res.incremented).toBe(true);
    });

    it('simulation: 90 days of intermittent user activity maintains mathematical streak invariants', () => {
      let streak: StreakInfo = { current: 0, best: 0, last_date: '' };
      const baseDate = new Date('2024-01-01T12:00:00+05:30');

      // Schedule of activity: [dayOffset, isSubmit]
      // Days 0..9: continuous (streak reaches 10)
      // Day 10: skip
      // Days 11..13: continuous (streak reaches 3, best stays 10)
      // Day 13: same day re-submit (streak stays 3)
      // Day 14: skip
      // Days 15..30: 16 continuous days (streak reaches 16, best becomes 16)
      const simulationDays = [
        ...Array.from({ length: 10 }, (_, i) => ({ day: i, submit: true })),
        { day: 10, submit: false },
        { day: 11, submit: true },
        { day: 12, submit: true },
        { day: 13, submit: true },
        { day: 13, submit: true }, // same-day retry
        { day: 14, submit: false },
        ...Array.from({ length: 16 }, (_, i) => ({ day: 15 + i, submit: true })),
      ];

      for (const action of simulationDays) {
        if (!action.submit) continue;
        const actionDate = new Date(baseDate.getTime() + action.day * 24 * 60 * 60 * 1000);
        const dateStr = getTodayKolkataDate(actionDate);

        const res = evaluateStreak(streak, dateStr);
        streak = res.updatedStreak;

        // Mathematical Invariants:
        expect(streak.current).toBeGreaterThanOrEqual(1);
        expect(streak.best).toBeGreaterThanOrEqual(streak.current);
        expect(streak.last_date).toBe(dateStr);
      }

      // At end of simulation:
      // Day 15 to 30 = 16 days streak
      expect(streak.current).toBe(16);
      expect(streak.best).toBe(16);
    });
  });

  // =========================================================================
  // SECTION 3: Question Search & Filter Logic Complex Queries
  // =========================================================================
  describe('Section 3: Question Search and Filter Logic Stress Testing', () => {
    it('bilingual search: matches English terms regardless of case', async () => {
      // Lowercase, Uppercase, Mixed case searches
      const searchTerms = ['ambedkar', 'AMBEDKAR', 'AmBeDkAr', 'silappatikaram', 'SILAPPATIKARAM'];

      for (const term of searchTerms) {
        const res = await questionService.getQuestions({ search: term });
        expect(res.data.length).toBeGreaterThan(0);
      }
    });

    it('bilingual search: matches Tamil terms accurately in question text, options, and explanations', async () => {
      // Question text search
      const qRes = await questionService.getQuestions({ search: 'கட்டபொம்மன்' });
      expect(qRes.data.length).toBeGreaterThan(0);
      expect(qRes.data.some((q) => q.question_ta.includes('கட்டபொம்மன்'))).toBe(true);

      // Option text search (e.g. 'வளையல்')
      const optRes = await questionService.getQuestions({ search: 'காரணச் சிறப்புப்பெயர்' });
      expect(optRes.data.length).toBeGreaterThan(0);

      // Explanation search
      const expRes = await questionService.getQuestions({ search: 'ஈறுபோதல்' });
      expect(expRes.data.length).toBeGreaterThan(0);
      expect(expRes.data.some((q) => q.explanation.includes('ஈறுபோதல்'))).toBe(true);
    });

    it('handles search queries with special regex characters without throwing', async () => {
      const specialChars = ['(', ')', '[', ']', '+', '*', '?', '.', '\\', '^', '$', '|', '{"foo"}', "''"];

      for (const char of specialChars) {
        // Must not crash with SyntaxError: Invalid regular expression
        await expect(questionService.getQuestions({ search: char })).resolves.toBeDefined();
      }
    });

    it('handles empty and whitespace-only search strings by returning unfiltered results', async () => {
      const allQuestions = await questionService.getQuestions({ per_page: 50 });
      const emptySearch = await questionService.getQuestions({ search: '', per_page: 50 });
      const whitespaceSearch = await questionService.getQuestions({ search: '     ', per_page: 50 });

      expect(emptySearch.data.length).toBe(allQuestions.data.length);
      expect(whitespaceSearch.data.length).toBe(allQuestions.data.length);
    });

    it('combines multiple filters correctly (exam + topic + search + pagination)', async () => {
      const result = await questionService.getQuestions({
        exam: 'TNPSC',
        topic: 'தமிழ் இலக்கணம்',
        search: 'செங்கோல்',
        page: 1,
        per_page: 10,
      });

      expect(result.data.length).toBe(1);
      expect(result.data[0]!.id).toBe(101);
      expect(result.data[0]!.exam).toBe('TNPSC');
      expect(result.data[0]!.topic).toBe('தமிழ் இலக்கணம்');
      expect(result.meta.total).toBe(1);
    });

    it('returns empty array with proper pagination metadata when no questions match', async () => {
      const result = await questionService.getQuestions({
        search: 'NonExistentKeywordZeroMatch999',
      });

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.current_page).toBe(1);
      expect(result.meta.last_page).toBe(1);
    });

    it('pagination boundary test: navigating beyond total pages returns empty data', async () => {
      const result = await questionService.getQuestions({
        page: 999,
        per_page: 10,
      });

      expect(result.data).toEqual([]);
      expect(result.meta.current_page).toBe(999);
      expect(result.meta.last_page).toBe(4); // 36 / 10 = 4 pages
    });

    it('topic filter handles partial substring and case insensitivity', async () => {
      // Partial topic match 'இலக்கணம்' should match 'தமிழ் இலக்கணம்'
      const res = await questionService.getQuestions({ topic: 'இலக்கணம்' });
      expect(res.data.length).toBeGreaterThanOrEqual(6);
      res.data.forEach((q) => {
        expect(q.topic.includes('இலக்கணம்') || q.category.includes('இலக்கணம்')).toBe(true);
      });
    });
  });

  // =========================================================================
  // SECTION 4: Quiz & Practice Store State Invariants & Stress Testing
  // =========================================================================
  describe('Section 4: Store State Invariants & Stress Testing', () => {
    it('quiz submission marks quiz as completed today in quizService and quizStore', async () => {
      const quiz = await quizService.getTodayQuiz();
      const submission = await quizService.submitQuiz({
        quiz_id: quiz.quiz_id,
        date: quiz.date,
        time_taken_seconds: 120,
        answers: quiz.questions.map((q) => ({
          question_id: q.id,
          selected_option: q.answer,
        })),
      });

      expect(submission.score).toBe(10);
      expect(submission.accuracy_percentage).toBe(100);

      // Verify that subsequent call to getTodayQuiz reflects completion
      const updatedQuiz = await quizService.getTodayQuiz();
      expect(updatedQuiz.is_completed_today).toBe(true);
    });

    it('rapid user interaction in practiceStore maintains state consistency', async () => {
      const store = usePracticeStore.getState();
      await store.loadPracticeData();

      // Rapidly toggle filters and search
      store.setSelectedFilter('group2');
      store.setSearchQuery('வரலாறு');
      expect(usePracticeStore.getState().selectedFilter).toBe('group2');
      expect(usePracticeStore.getState().searchQuery).toBe('வரலாறு');

      store.setSelectedFilter('all');
      store.setSearchQuery('');
      expect(usePracticeStore.getState().selectedFilter).toBe('all');
      expect(usePracticeStore.getState().searchQuery).toBe('');

      // Rapid bookmark toggle
      const topic = usePracticeStore.getState().topics[0]!;
      await store.toggleBookmark(topic.id, 'topic');
      expect(usePracticeStore.getState().bookmarkedIds).toContain(topic.id);

      await store.toggleBookmark(topic.id, 'topic');
      expect(usePracticeStore.getState().bookmarkedIds).not.toContain(topic.id);
    });
  });
});
