import { create } from './storeHelper';
import type { TopicItem, PyqItem } from '@/types/api';
import { questionService } from '@/api/questionService';
import { progressService } from '@/api/progressService';

export interface PracticeState {
  activeTab: 'topic' | 'pyq';
  selectedFilter: string; // 'all' | 'group4' | 'group2' | 'vao' | 'tamil'
  searchQuery: string;
  topics: TopicItem[];
  pyqs: PyqItem[];
  bookmarkedIds: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveTab: (tab: 'topic' | 'pyq') => void;
  setSelectedFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  loadPracticeData: () => Promise<void>;
  toggleBookmark: (
    id: string,
    type?: 'topic' | 'pyq' | 'question'
  ) => Promise<boolean>;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  activeTab: 'topic',
  selectedFilter: 'all',
  searchQuery: '',
  topics: [],
  pyqs: [],
  bookmarkedIds: [],
  isLoading: false,
  error: null,

  setActiveTab: (tab: 'topic' | 'pyq') => {
    set({ activeTab: tab });
  },

  setSelectedFilter: (filter: string) => {
    set({ selectedFilter: filter });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  loadPracticeData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [topics, pyqs] = await Promise.all([
        questionService.getTopics(),
        questionService.getPyqs(),
      ]);

      const initialBookmarked = [
        ...topics.filter((t) => t.is_bookmarked).map((t) => t.id),
        ...pyqs.filter((p) => p.is_bookmarked).map((p) => p.id),
      ];

      set({
        topics,
        pyqs,
        bookmarkedIds: initialBookmarked,
        isLoading: false,
      });
    } catch (err) {
      const msg = (err as Error)?.message || 'Failed to load practice data';
      set({ error: msg, isLoading: false });
    }
  },

  toggleBookmark: async (id: string, type: 'topic' | 'pyq' | 'question' = 'topic') => {
    const isNowBookmarked = await progressService.toggleBookmark(id, type);

    const { topics, pyqs, bookmarkedIds } = get();

    const updatedBookmarks = isNowBookmarked
      ? [...bookmarkedIds, id]
      : bookmarkedIds.filter((bId) => bId !== id);

    const updatedTopics = topics.map((t) =>
      t.id === id ? { ...t, is_bookmarked: isNowBookmarked } : t
    );

    const updatedPyqs = pyqs.map((p) =>
      p.id === id ? { ...p, is_bookmarked: isNowBookmarked } : p
    );

    set({
      bookmarkedIds: updatedBookmarks,
      topics: updatedTopics,
      pyqs: updatedPyqs,
    });

    return isNowBookmarked;
  },
}));
