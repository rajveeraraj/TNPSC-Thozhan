import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashStringToSeed,
  createMulberry32,
  selectDailyQuestions,
  getTodayKolkataDate,
  getYesterdayKolkataDate,
  evaluateStreak,
  quizService,
} from '@/api/quizService';
import { questionService } from '@/api/questionService';
import { progressService } from '@/api/progressService';
import { mockQuestions, mockTopics, mockPyqs, mockUser } from '@/api/mockData';
import { t, setLocale, getLocale } from '@/i18n';
import { useQuizStore } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import { usePracticeStore } from '@/store/practiceStore';
import type { StreakInfo } from '@/types/api';

describe('Milestone 2: API Layer, Mock Engine & Tamil i18n', () => {
  beforeEach(() => {
    // Reset locale and localStorage
    setLocale('ta');
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    useQuizStore.getState().resetQuiz();
  });

  // -------------------------------------------------------------
  // 1. Date-Seeded Deterministic PRNG & Daily Quiz Generation
  // -------------------------------------------------------------
  describe('1. Deterministic Mulberry32 PRNG & Seeded Daily Quiz', () => {
    it('generates consistent seed from identical date strings', () => {
      const seed1 = hashStringToSeed('2024-11-15');
      const seed2 = hashStringToSeed('2024-11-15');
      expect(seed1).toBe(seed2);
      expect(typeof seed1).toBe('number');

      const seedOther = hashStringToSeed('2024-11-16');
      expect(seed1).not.toBe(seedOther);
    });

    it('generates identical pseudo-random float sequence for identical seeds', () => {
      const prng1 = createMulberry32(123456);
      const prng2 = createMulberry32(123456);

      const seq1 = [prng1(), prng1(), prng1(), prng1()];
      const seq2 = [prng2(), prng2(), prng2(), prng2()];

      expect(seq1).toEqual(seq2);
      seq1.forEach((val) => {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      });
    });

    it('selects exactly 10 questions deterministically for the same date', () => {
      const dateStr = '2024-11-15';
      const selectionA = selectDailyQuestions(mockQuestions, dateStr, 10);
      const selectionB = selectDailyQuestions(mockQuestions, dateStr, 10);

      expect(selectionA.length).toBe(10);
      expect(selectionB.length).toBe(10);

      const idsA = selectionA.map((q) => q.id);
      const idsB = selectionB.map((q) => q.id);

      // Must be 100% identical in order and content
      expect(idsA).toEqual(idsB);

      // Verify no duplicate questions
      const uniqueIds = new Set(idsA);
      expect(uniqueIds.size).toBe(10);
    });

    it('different dates produce different question selections', () => {
      const selectionDay1 = selectDailyQuestions(mockQuestions, '2024-11-15', 10);
      const selectionDay2 = selectDailyQuestions(mockQuestions, '2024-11-16', 10);

      const ids1 = selectionDay1.map((q) => q.id);
      const ids2 = selectionDay2.map((q) => q.id);

      // Distinct order/set
      expect(ids1).not.toEqual(ids2);
    });

    it('computes current date and yesterday in Asia/Kolkata timezone', () => {
      const kolkataToday = getTodayKolkataDate();
      expect(kolkataToday).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      const reference = new Date('2024-11-15T10:00:00Z');
      const todayIST = getTodayKolkataDate(reference);
      const yesterdayIST = getYesterdayKolkataDate(reference);

      expect(todayIST).toBe('2024-11-15');
      expect(yesterdayIST).toBe('2024-11-14');
    });

    it('getTodayQuiz returns a fully formed 10-question daily quiz data object', async () => {
      const dailyQuiz = await quizService.getTodayQuiz();

      expect(dailyQuiz.total_questions).toBe(10);
      expect(dailyQuiz.questions.length).toBe(10);
      expect(dailyQuiz.title).toContain('சிறப்பு மாதிரித் தேர்வு');
      expect(dailyQuiz.time_limit_seconds).toBe(600);

      // Inspect question structure
      const q = dailyQuiz.questions[0]!;
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question_ta');
      expect(q).toHaveProperty('answer');
      expect(q).toHaveProperty('explanation');
      expect(q.options.length).toBe(4);
      expect(q.options.map((o) => o.label)).toEqual(['அ', 'ஆ', 'இ', 'ஈ']);
    });
  });

  // -------------------------------------------------------------
  // 2. Quiz Submission & Streak Continuity Evaluation
  // -------------------------------------------------------------
  describe('2. Quiz Submission & Streak Continuity Evaluation', () => {
    it('first completion starts streak at 1', () => {
      const initial: StreakInfo = {
        current: 0,
        best: 0,
        last_date: '',
      };
      const result = evaluateStreak(initial, '2024-11-15');

      expect(result.updatedStreak.current).toBe(1);
      expect(result.updatedStreak.best).toBe(1);
      expect(result.updatedStreak.last_date).toBe('2024-11-15');
      expect(result.incremented).toBe(true);
      expect(result.updatedStreak.is_completed_today).toBe(true);
    });

    it('consecutive day completion increments current streak and updates best', () => {
      const currentStreak: StreakInfo = {
        current: 7,
        best: 7,
        last_date: '2024-11-14',
      };
      // User submits on 2024-11-15 (day immediately following 2024-11-14)
      const result = evaluateStreak(currentStreak, '2024-11-15');

      expect(result.updatedStreak.current).toBe(8);
      expect(result.updatedStreak.best).toBe(8);
      expect(result.updatedStreak.last_date).toBe('2024-11-15');
      expect(result.incremented).toBe(true);
    });

    it('submitting on the same day maintains streak without double incrementing', () => {
      const currentStreak: StreakInfo = {
        current: 8,
        best: 21,
        last_date: '2024-11-15',
      };
      const result = evaluateStreak(currentStreak, '2024-11-15');

      expect(result.updatedStreak.current).toBe(8);
      expect(result.updatedStreak.best).toBe(21);
      expect(result.incremented).toBe(false);
      expect(result.updatedStreak.is_completed_today).toBe(true);
    });

    it('broken streak (gap of 2+ days) resets current streak to 1 while preserving best', () => {
      const currentStreak: StreakInfo = {
        current: 12,
        best: 25,
        last_date: '2024-11-10', // 5 days ago
      };
      const result = evaluateStreak(currentStreak, '2024-11-15');

      expect(result.updatedStreak.current).toBe(1);
      expect(result.updatedStreak.best).toBe(25); // Preserved best
      expect(result.updatedStreak.last_date).toBe('2024-11-15');
      expect(result.incremented).toBe(true);
    });

    it('submitQuiz calculates score, accuracy, and returns itemized feedback', async () => {
      const quiz = await quizService.getTodayQuiz();

      // Answer first 8 correctly, last 2 incorrectly
      const answers = quiz.questions.map((q, idx) => {
        if (idx < 8) {
          return { question_id: q.id, selected_option: q.answer };
        } else {
          // Intentionally choose wrong answer
          const wrongOption = q.answer === 'A' ? 'B' : 'A';
          return { question_id: q.id, selected_option: wrongOption as 'A' | 'B' };
        }
      });

      const submission = await quizService.submitQuiz({
        quiz_id: quiz.quiz_id,
        date: quiz.date,
        time_taken_seconds: 145,
        answers,
      });

      expect(submission.score).toBe(8);
      expect(submission.total).toBe(10);
      expect(submission.accuracy_percentage).toBe(80);
      expect(submission.results.length).toBe(10);

      // Verify first 8 are marked is_correct true
      for (let i = 0; i < 8; i++) {
        expect(submission.results[i]!.is_correct).toBe(true);
        expect(submission.results[i]!.explanation.length).toBeGreaterThan(10);
      }
      // Last 2 marked is_correct false
      expect(submission.results[8]!.is_correct).toBe(false);
      expect(submission.results[9]!.is_correct).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 3. Question Bank & Practice Filtering Logic
  // -------------------------------------------------------------
  describe('3. Question Bank & Practice Service', () => {
    it('mockQuestions contains at least 36 questions across 6 syllabus areas', () => {
      expect(mockQuestions.length).toBeGreaterThanOrEqual(36);

      const topics = new Set(mockQuestions.map((q) => q.topic));
      expect(topics.has('தமிழ் இலக்கணம்')).toBe(true);
      expect(topics.has('தமிழ் இலக்கியம்')).toBe(true);
      expect(topics.has('இந்திய அரசியல்')).toBe(true);
      expect(topics.has('வரலாறு')).toBe(true);
      expect(topics.has('கணிதம்')).toBe(true);
      expect(topics.has('பொது அறிவு')).toBe(true);

      // Verify each topic has at least 6 questions
      const grammarCount = mockQuestions.filter((q) => q.topic === 'தமிழ் இலக்கணம்').length;
      const literatureCount = mockQuestions.filter((q) => q.topic === 'தமிழ் இலக்கியம்').length;
      const polityCount = mockQuestions.filter((q) => q.topic === 'இந்திய அரசியல்').length;
      const historyCount = mockQuestions.filter((q) => q.topic === 'வரலாறு').length;
      const mathsCount = mockQuestions.filter((q) => q.topic === 'கணிதம்').length;
      const gkCount = mockQuestions.filter((q) => q.topic === 'பொது அறிவு').length;

      expect(grammarCount).toBeGreaterThanOrEqual(6);
      expect(literatureCount).toBeGreaterThanOrEqual(6);
      expect(polityCount).toBeGreaterThanOrEqual(6);
      expect(historyCount).toBeGreaterThanOrEqual(6);
      expect(mathsCount).toBeGreaterThanOrEqual(6);
      expect(gkCount).toBeGreaterThanOrEqual(6);
    });

    it('filters questions by topic correctly', async () => {
      const response = await questionService.getQuestions({ topic: 'தமிழ் இலக்கணம்' });
      expect(response.data.length).toBeGreaterThanOrEqual(6);
      response.data.forEach((q) => {
        expect(q.topic).toBe('தமிழ் இலக்கணம்');
      });
    });

    it('filters questions by exam and paper', async () => {
      const response = await questionService.getQuestions({
        exam: 'TNPSC',
        paper: 'Group 4',
      });
      expect(response.data.length).toBeGreaterThan(0);
      response.data.forEach((q) => {
        expect(q.exam).toBe('TNPSC');
        expect(q.paper).toBe('Group 4');
      });
    });

    it('performs bilingual keyword search across Tamil and English fields', async () => {
      // Tamil search
      const tamilSearch = await questionService.getQuestions({ search: 'சிலப்பதிகாரம்' });
      expect(tamilSearch.data.length).toBeGreaterThan(0);
      expect(
        tamilSearch.data.some(
          (q) => q.question_ta.includes('சிலப்பதிகார') || q.explanation.includes('சிலப்பதிகாரம்')
        )
      ).toBe(true);

      // English search
      const englishSearch = await questionService.getQuestions({ search: 'Silappatikaram' });
      expect(englishSearch.data.length).toBeGreaterThan(0);
      expect(
        englishSearch.data.some(
          (q) => q.question_en && q.question_en.includes('Silappatikaram')
        )
      ).toBe(true);

      // Polity search
      const politySearch = await questionService.getQuestions({ search: 'Ambedkar' });
      expect(politySearch.data.length).toBeGreaterThan(0);
    });

    it('paginates question sets accurately', async () => {
      const page1 = await questionService.getQuestions({ page: 1, per_page: 5 });
      const page2 = await questionService.getQuestions({ page: 2, per_page: 5 });

      expect(page1.data.length).toBe(5);
      expect(page2.data.length).toBe(5);
      expect(page1.meta.current_page).toBe(1);
      expect(page2.meta.current_page).toBe(2);
      expect(page1.meta.per_page).toBe(5);

      // No question overlap between page 1 and page 2
      const ids1 = page1.data.map((q) => q.id);
      const ids2 = page2.data.map((q) => q.id);
      ids1.forEach((id) => expect(ids2).not.toContain(id));
    });

    it('submitAttempt validates individual question attempts', async () => {
      const attemptSuccess = await questionService.submitAttempt(101, 'A');
      expect(attemptSuccess.is_correct).toBe(true);
      expect(attemptSuccess.correct_answer).toBe('A');
      expect(attemptSuccess.explanation).toContain('ஈறுபோதல்');

      const attemptFailure = await questionService.submitAttempt(101, 'C');
      expect(attemptFailure.is_correct).toBe(false);
      expect(attemptFailure.correct_answer).toBe('A');
    });

    it('retrieves topics and PYQ papers', async () => {
      const topics = await questionService.getTopics();
      expect(topics.length).toBe(mockTopics.length);
      expect(topics.some((t) => t.title.includes('தமிழ் இலக்கணம்'))).toBe(true);

      const pyqs = await questionService.getPyqs();
      expect(pyqs.length).toBe(mockPyqs.length);
      expect(pyqs.some((p) => p.id === 'pyq_group4_2023')).toBe(true);
      expect(pyqs.some((p) => p.id === 'pyq_group2_2022')).toBe(true);
      expect(pyqs.some((p) => p.id === 'pyq_vao_2021')).toBe(true);
    });

    it('toggleBookmark successfully toggles bookmark state', async () => {
      const topicId = 'topic_tamil_grammar';
      const isBookmarkedFirst = await progressService.toggleBookmark(topicId, 'topic');
      expect(isBookmarkedFirst).toBe(true);

      const topicsAfterAdd = await questionService.getTopics();
      const targetTopic = topicsAfterAdd.find((t) => t.id === topicId);
      expect(targetTopic?.is_bookmarked).toBe(true);

      // Toggle again to remove
      const isBookmarkedSecond = await progressService.toggleBookmark(topicId, 'topic');
      expect(isBookmarkedSecond).toBe(false);

      const topicsAfterRemove = await questionService.getTopics();
      const removedTopic = topicsAfterRemove.find((t) => t.id === topicId);
      expect(removedTopic?.is_bookmarked).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 4. Tamil & English i18n Localization
  // -------------------------------------------------------------
  describe('4. Tamil Localization Catalog & Translation Function', () => {
    it('resolves core application and navigation strings', () => {
      expect(t('app.name')).toBe('TNPSC தோழன்');
      expect(t('app.version')).toBe('TNPSC தோழன் பதிப்பு 2.4.1');
      expect(t('nav.home')).toBe('முகப்பு');
      expect(t('nav.practice')).toBe('பயிற்சி');
      expect(t('nav.pyq')).toBe('வினாக்கள்');
      expect(t('nav.profile')).toBe('சுயவிவரம்');
    });

    it('resolves strings for all 4 Stitch screens', () => {
      // Screen 1: Home
      expect(t('home.target_exam_title')).toBe('TNPSC Group 4 & VAO 2024');
      expect(t('home.target_exam_countdown')).toContain('45 நாட்கள்');
      expect(t('home.daily_quiz.badge')).toBe('இன்றைய மாதிரித் தேர்வு');

      // Screen 2: Quiz Player
      expect(t('quiz.explanation_title')).toBe('விளக்கம் (Explanation)');
      expect(t('quiz.options.A')).toBe('அ');
      expect(t('quiz.options.B')).toBe('ஆ');
      expect(t('quiz.options.C')).toBe('இ');
      expect(t('quiz.options.D')).toBe('ஈ');
      expect(t('quiz.prev_btn')).toBe('முந்தைய');
      expect(t('quiz.next_btn')).toBe('அடுத்து');

      // Screen 3: Practice & PYQs
      expect(t('practice.tabs.topic')).toBe('தலைப்பு வாரியாக');
      expect(t('practice.tabs.pyq')).toBe('முந்தைய வினாக்கள்');
      expect(t('practice.search_placeholder')).toContain('தேடுக');
      expect(t('practice.filters.all')).toBe('அனைத்தும்');

      // Screen 4: Profile & Progress
      expect(t('profile.badge')).toBe('Group 4 VAO');
      expect(t('profile.metrics.streak_sub')).toContain('தொடர்ச்சி');
      expect(t('profile.metrics.accuracy_sub')).toContain('துல்லியம்');
      expect(t('profile.metrics.solved_sub')).toContain('வினாக்கள்');
      expect(t('profile.heatmap.title')).toBe('14-நாள் செயல்பாட்டு வரைபடம்');
      expect(t('profile.settings.bookmarks.title')).toBe('குறிப்புகள் & சேமிப்பு');
    });

    it('interpolates single and multiple parameters in translation strings', () => {
      const streakTitle = t('home.streak_card_title', { count: 7 });
      expect(streakTitle).toBe('7 நாள் தொடர்ச்சி (7 Days Streak)');

      const streakRecord = t('home.streak_record', { best: 21 });
      expect(streakRecord).toBe('சாதனை: அதிகபட்சம் 21 நாட்கள்');

      const questionCounter = t('quiz.question_counter', { current: 3, total: 10 });
      expect(questionCounter).toBe('வினா 3 / 10');

      const timeRemaining = t('quiz.time_remaining', { time: '08:45' });
      expect(timeRemaining).toBe('08:45 மீதம்');

      const scoreSummary = t('quiz.results.score_summary', { score: 9, total: 10 });
      expect(scoreSummary).toBe('உங்கள் மதிப்பெண்: 9 / 10');
    });

    it('handles locale switching and fallback mechanism', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');
      expect(t('app.name')).toContain('ExamBuddy');
      expect(t('nav.home')).toBe('Home');
      expect(t('nav.practice')).toBe('Practice');

      // Fallback for non-existent key returns key name
      const nonExistent = t('some.untranslated.key');
      expect(nonExistent).toBe('some.untranslated.key');

      // Reset to Tamil
      setLocale('ta');
      expect(getLocale()).toBe('ta');
      expect(t('nav.home')).toBe('முகப்பு');
    });
  });

  // -------------------------------------------------------------
  // 5. Reactive State Stores (Zustand-compatible)
  // -------------------------------------------------------------
  describe('5. Reactive State Stores (Quiz, Auth, Practice)', () => {
    it('useQuizStore manages full quiz lifecycle', async () => {
      const store = useQuizStore.getState();

      // 1. Load quiz
      await store.loadDailyQuiz();
      expect(useQuizStore.getState().dailyQuiz).not.toBeNull();
      expect(useQuizStore.getState().dailyQuiz?.questions.length).toBe(10);

      // 2. Start quiz
      store.startQuiz();
      expect(useQuizStore.getState().isQuizActive).toBe(true);
      expect(useQuizStore.getState().currentQuestionIndex).toBe(0);

      const firstQuestion = useQuizStore.getState().dailyQuiz!.questions[0]!;
      expect(firstQuestion).toBeDefined();

      // 3. Select option
      useQuizStore.getState().selectOption(firstQuestion.id, 'B');
      expect(useQuizStore.getState().answers[firstQuestion.id]).toBe('B');

      // 4. Navigation
      useQuizStore.getState().nextQuestion();
      expect(useQuizStore.getState().currentQuestionIndex).toBe(1);

      useQuizStore.getState().prevQuestion();
      expect(useQuizStore.getState().currentQuestionIndex).toBe(0);

      useQuizStore.getState().goToQuestion(5);
      expect(useQuizStore.getState().currentQuestionIndex).toBe(5);

      // 5. Submit quiz
      const result = await useQuizStore.getState().submitCurrentQuiz();
      expect(result).toHaveProperty('score');
      expect(useQuizStore.getState().isSubmitted).toBe(true);
      expect(useQuizStore.getState().submissionResult).not.toBeNull();

      // 6. Reset
      useQuizStore.getState().resetQuiz();
      expect(useQuizStore.getState().isQuizActive).toBe(false);
      expect(useQuizStore.getState().answers).toEqual({});
    });

    it('useAuthStore manages user credentials and profile state', () => {
      const auth = useAuthStore.getState();
      expect(auth.user?.name).toContain('அன்பழகன்');
      expect(auth.user?.aspirant_id).toBe(mockUser.aspirant_id);
      expect(auth.isAuthenticated).toBe(true);

      // Profile edit
      auth.updateUser({ target_exam: 'Group 2 Prelims 2025' });
      expect(useAuthStore.getState().user?.target_exam).toBe('Group 2 Prelims 2025');

      // Logout
      auth.logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('usePracticeStore manages tabs, search query, filter chips, and bookmarks', async () => {
      const practice = usePracticeStore.getState();

      // 1. Load data
      await practice.loadPracticeData();
      expect(usePracticeStore.getState().topics.length).toBeGreaterThan(0);
      expect(usePracticeStore.getState().pyqs.length).toBe(3);

      // 2. Switch tab
      practice.setActiveTab('pyq');
      expect(usePracticeStore.getState().activeTab).toBe('pyq');

      // 3. Set filter & search
      practice.setSelectedFilter('group4');
      practice.setSearchQuery('தமிழ்');
      expect(usePracticeStore.getState().selectedFilter).toBe('group4');
      expect(usePracticeStore.getState().searchQuery).toBe('தமிழ்');

      // 4. Bookmark toggle
      const firstTopicId = usePracticeStore.getState().topics[0]!.id;
      const initialBookmarked = usePracticeStore
        .getState()
        .bookmarkedIds.includes(firstTopicId);

      const toggledState = await usePracticeStore
        .getState()
        .toggleBookmark(firstTopicId, 'topic');
      expect(toggledState).toBe(!initialBookmarked);
      expect(
        usePracticeStore.getState().bookmarkedIds.includes(firstTopicId)
      ).toBe(toggledState);
    });
  });
});
