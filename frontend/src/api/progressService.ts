import type { ProgressStats, IProgressService } from '@/types/api';
import { mockProgress } from './mockData';
import { getStoredStreak, isQuizCompletedOnDate, getTodayKolkataDate } from './quizService';
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

function saveStoredBookmarks(bookmarks: string[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    }
  } catch {
    // Ignore
  }
}

class ProgressService implements IProgressService {
  public async getProgress(): Promise<ProgressStats> {
    if (!apiClient.getMockMode()) {
      const response = await apiClient.get<ProgressStats>('/progress');
      return response.data;
    }

    const currentStreak = getStoredStreak();
    const today = getTodayKolkataDate();
    const isCompletedToday = isQuizCompletedOnDate(today);

    // Dynamic heatmap adjustment based on today's completion
    const dynamicHeatmap = mockProgress.heatmap.map((day) => {
      if (day.day_short === 'இன்று' || day.date === today) {
        if (isCompletedToday) {
          return {
            ...day,
            level: 4 as const,
            score: 10,
            total: 10,
            status: 'completed' as const,
          };
        }
      }
      return day;
    });

    return {
      ...mockProgress,
      streak: {
        ...currentStreak,
        is_completed_today: isCompletedToday,
      },
      heatmap: dynamicHeatmap,
    };
  }

  public async toggleBookmark(
    itemId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _type: 'topic' | 'pyq' | 'question' = 'topic'
  ): Promise<boolean> {
    const currentBookmarks = getStoredBookmarks();
    const index = currentBookmarks.indexOf(itemId);
    let isBookmarked: boolean;

    if (index > -1) {
      currentBookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      currentBookmarks.push(itemId);
      isBookmarked = true;
    }

    saveStoredBookmarks(currentBookmarks);
    return isBookmarked;
  }
}

export const progressService = new ProgressService();
