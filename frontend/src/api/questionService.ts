import type {
  Question,
  QuestionQueryParams,
  PaginationMeta,
  AttemptResult,
  TopicItem,
  PyqItem,
  OptionId,
  IQuestionService,
} from '@/types/api';
import { mockQuestions, mockTopics, mockPyqs } from './mockData';
import { apiClient } from './client';

const BOOKMARKS_STORAGE_KEY = 'exambuddy_bookmarks';

function getStoredBookmarks(): string[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) return JSON.parse(stored) as string[];
    }
  } catch {
    // Ignore
  }
  return [];
}

class QuestionService implements IQuestionService {
  public async getQuestions(
    params?: QuestionQueryParams
  ): Promise<{ data: Question[]; meta: PaginationMeta }> {
    if (!apiClient.getMockMode()) {
      const response = await apiClient.get<Question[]>('/questions', {
        params: params as Record<string, string | number | boolean | undefined>,
      });
      return {
        data: response.data,
        meta: {
          current_page: params?.page || 1,
          per_page: params?.per_page || 20,
          total: response.data.length,
          last_page: 1,
        },
      };
    }

    let filtered = [...mockQuestions];

    if (params) {
      const { exam, year, paper, topic, search } = params;

      if (exam) {
        filtered = filtered.filter(
          (q) => q.exam.toLowerCase() === exam.toLowerCase()
        );
      }

      if (year) {
        filtered = filtered.filter((q) => q.year === Number(year));
      }

      if (paper) {
        filtered = filtered.filter(
          (q) => q.paper.toLowerCase() === paper.toLowerCase()
        );
      }

      if (topic) {
        const lowerTopic = topic.toLowerCase();
        filtered = filtered.filter(
          (q) =>
            q.topic.toLowerCase().includes(lowerTopic) ||
            q.category.toLowerCase().includes(lowerTopic)
        );
      }

      if (search && search.trim() !== '') {
        const query = search.toLowerCase().trim();
        filtered = filtered.filter(
          (q) =>
            q.question_ta.toLowerCase().includes(query) ||
            (q.question_en && q.question_en.toLowerCase().includes(query)) ||
            q.topic.toLowerCase().includes(query) ||
            q.category.toLowerCase().includes(query) ||
            q.explanation.toLowerCase().includes(query) ||
            q.options.some(
              (opt) =>
                opt.text_ta.toLowerCase().includes(query) ||
                (opt.text_en && opt.text_en.toLowerCase().includes(query))
            )
        );
      }
    }

    const page = Math.max(1, params?.page || 1);
    const perPage = Math.max(1, params?.per_page || 20);
    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));

    const startIndex = (page - 1) * perPage;
    const paginatedQuestions = filtered.slice(startIndex, startIndex + perPage);

    return {
      data: paginatedQuestions,
      meta: {
        current_page: page,
        per_page: perPage,
        total,
        last_page: lastPage,
      },
    };
  }

  public async submitAttempt(
    questionId: number,
    selectedOption: OptionId
  ): Promise<AttemptResult> {
    if (!apiClient.getMockMode()) {
      const response = await apiClient.post<AttemptResult>('/attempts', {
        question_id: questionId,
        selected_option: selectedOption,
      });
      return response.data;
    }

    const question = mockQuestions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error(`Question with id ${questionId} not found`);
    }

    const isCorrect = question.answer === selectedOption;

    return {
      attempt_id: Date.now(),
      question_id: questionId,
      is_correct: isCorrect,
      correct_answer: question.answer,
      explanation: question.explanation,
    };
  }

  public async getTopics(): Promise<TopicItem[]> {
    if (!apiClient.getMockMode()) {
      try {
        const response = await apiClient.get<TopicItem[]>('/topics');
        const bookmarkedIds = new Set(getStoredBookmarks());
        return response.data.map((topic) => ({
          ...topic,
          is_bookmarked: bookmarkedIds.has(topic.id),
        }));
      } catch {
        // fall through to mock
      }
    }

    const bookmarkedIds = new Set(getStoredBookmarks());
    return mockTopics.map((topic) => ({
      ...topic,
      is_bookmarked: bookmarkedIds.has(topic.id),
    }));
  }

  public async getPyqs(): Promise<PyqItem[]> {
    if (!apiClient.getMockMode()) {
      try {
        const response = await apiClient.get<PyqItem[]>('/pyqs');
        const bookmarkedIds = new Set(getStoredBookmarks());
        return response.data.map((pyq) => ({
          ...pyq,
          is_bookmarked: bookmarkedIds.has(pyq.id),
        }));
      } catch {
        // fall through to mock
      }
    }

    const bookmarkedIds = new Set(getStoredBookmarks());
    return mockPyqs.map((pyq) => ({
      ...pyq,
      is_bookmarked: bookmarkedIds.has(pyq.id),
    }));
  }
}

export const questionService = new QuestionService();
