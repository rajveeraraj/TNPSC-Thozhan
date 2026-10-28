import React, { useEffect, useRef } from 'react';
import GlassCard from '@/components/common/GlassCard';
import PracticeTabs from '@/components/practice/PracticeTabs';
import SearchBar from '@/components/practice/SearchBar';
import FilterChips from '@/components/practice/FilterChips';
import TopicCard from '@/components/practice/TopicCard';
import PyqCard from '@/components/practice/PyqCard';
import { usePracticeStore } from '@/store/practiceStore';
import { t } from '@/i18n';

export interface PracticePageProps {
  initialTab?: 'topic' | 'pyq';
  onStartQuiz: (contextId?: string) => void;
  onShowToast?: (message: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  initialTab,
  onStartQuiz,
  onShowToast,
}) => {
  const {
    activeTab,
    selectedFilter,
    searchQuery,
    topics,
    pyqs,
    bookmarkedIds,
    isLoading,
    setActiveTab,
    setSelectedFilter,
    setSearchQuery,
    loadPracticeData,
    toggleBookmark,
  } = usePracticeStore();

  const prevInitialTabRef = useRef<'topic' | 'pyq' | undefined>(undefined);

  useEffect(() => {
    if (initialTab && initialTab !== prevInitialTabRef.current) {
      prevInitialTabRef.current = initialTab;
      setActiveTab(initialTab);
    }
  }, [initialTab, setActiveTab]);

  useEffect(() => {
    if (topics.length === 0 && pyqs.length === 0) {
      loadPracticeData();
    }
  }, [topics.length, pyqs.length, loadPracticeData]);

  const handleToggleBookmark = async (
    e: React.MouseEvent,
    id: string,
    type: 'topic' | 'pyq'
  ) => {
    e.stopPropagation();
    const isNowBookmarked = await toggleBookmark(id, type);
    if (isNowBookmarked) {
      onShowToast?.(t('practice.card.bookmarked'));
    } else {
      onShowToast?.(t('practice.card.unbookmarked'));
    }
  };

  const handleQuickPractice = () => {
    onShowToast?.('10-வினாக்கள் கொண்ட விரைவுப் பயிற்சி தொடங்குகிறது! ⚡');
    onStartQuiz('quick_practice');
  };

  // Filter topics
  const filteredTopics = topics.filter((tItem) => {
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'tamil') {
        const matchesTamil =
          tItem.category === 'tamil' ||
          tItem.title.includes('தமிழ்') ||
          (tItem.subtitle && tItem.subtitle.includes('தமிழ்'));
        if (!matchesTamil) return false;
      } else if (selectedFilter === 'group4') {
        if (!tItem.tag?.includes('Group 4') && tItem.category !== 'group4') {
          return false;
        }
      } else if (selectedFilter === 'group2') {
        if (!tItem.tag?.includes('Group 2') && tItem.category !== 'group2') {
          return false;
        }
      } else if (selectedFilter === 'vao') {
        if (!tItem.tag?.includes('VAO') && tItem.category !== 'vao') {
          return false;
        }
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = tItem.title.toLowerCase().includes(q);
      const matchSubtitle = tItem.subtitle?.toLowerCase().includes(q) ?? false;
      const matchTag = tItem.tag?.toLowerCase().includes(q) ?? false;
      return matchTitle || matchSubtitle || matchTag;
    }

    return true;
  });

  // Filter PYQs
  const filteredPyqs = pyqs.filter((pItem) => {
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'group4' && pItem.category !== 'group4') return false;
      if (selectedFilter === 'group2' && pItem.category !== 'group2') return false;
      if (selectedFilter === 'vao' && pItem.category !== 'vao') return false;
      if (
        selectedFilter === 'tamil' &&
        !pItem.description?.includes('தமிழ்') &&
        !pItem.title.includes('தமிழ்')
      ) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = pItem.title.toLowerCase().includes(q);
      const matchDesc = pItem.description?.toLowerCase().includes(q) ?? false;
      const matchYear = pItem.year?.toString().includes(q) ?? false;
      return matchTitle || matchDesc || matchYear;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-space-md animate-fade-in relative pb-16">
      {/* 1. Top Motivational Banner */}
      <GlassCard glow="gold" className="p-space-lg">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="text-label-sm uppercase tracking-wider text-secondary font-bold">
            {t('practice.header_badge')}
          </span>
          <span className="text-label-sm text-tertiary bg-tertiary/10 border border-tertiary/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span>{t('practice.target_badge')}</span>
          </span>
        </div>

        <h2 className="text-headline-md text-on-surface font-bold mt-1">
          {activeTab === 'pyq'
            ? 'முந்தைய ஆண்டு வினாக்கள் (PYQs)'
            : 'பயிற்சி தளம் (Practice)'}
        </h2>
        <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
          {t('practice.subheading')}
        </p>
      </GlassCard>

      {/* 2. Segmented Tab Switcher (Topic-wise vs PYQs) */}
      <PracticeTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* 4. Horizontal Scrolling Filter Chips */}
      <FilterChips
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* 5. Main Content List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-space-sm text-on-surface-variant">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
          <span className="text-label-md">தரவுகள் ஏற்றப்படுகின்றன...</span>
        </div>
      ) : activeTab === 'topic' ? (
        <div className="flex flex-col gap-space-md">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isBookmarked={bookmarkedIds.includes(topic.id)}
                onToggleBookmark={(e) => handleToggleBookmark(e, topic.id, 'topic')}
                onStartPractice={() => {
                  if (topic.id === 'topic_tamil_grammar') {
                    onShowToast?.('பொது தமிழ் பயிற்சி திறக்கப்படுகிறது');
                  } else {
                    onShowToast?.(`${topic.title} பயிற்சி திறக்கப்படுகிறது`);
                  }
                  onStartQuiz(topic.id);
                }}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-surface-container/40 rounded-xl p-space-lg border border-white/5">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-2">
                search_off
              </span>
              <p className="text-body-md text-on-surface-variant">
                பொருத்தமான தலைப்புகள் எதுவும் கிடைக்கவில்லை
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="mt-space-sm text-secondary text-label-sm font-bold underline cursor-pointer"
              >
                வடிகட்டிகளை மீட்டமை
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-space-md">
          {filteredPyqs.length > 0 ? (
            filteredPyqs.map((pyq) => (
              <PyqCard
                key={pyq.id}
                pyq={pyq}
                isBookmarked={bookmarkedIds.includes(pyq.id)}
                onToggleBookmark={(e) => handleToggleBookmark(e, pyq.id, 'pyq')}
                onTakeExam={() => {
                  if (pyq.id === 'pyq_group4_2023') {
                    onShowToast?.('Group 4 - 2023 தேர்வு திறக்கப்படுகிறது');
                  } else {
                    onShowToast?.(`${pyq.title} மாதிரித் தேர்வு தொடங்குகிறது`);
                  }
                  onStartQuiz(pyq.id);
                }}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-surface-container/40 rounded-xl p-space-lg border border-white/5">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-2">
                search_off
              </span>
              <p className="text-body-md text-on-surface-variant">
                பொருத்தமான வினாத்தாள்கள் எதுவும் கிடைக்கவில்லை
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="mt-space-sm text-secondary text-label-sm font-bold underline cursor-pointer"
              >
                வடிகட்டிகளை மீட்டமை
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. Floating Quick Practice FAB */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          type="button"
          onClick={handleQuickPractice}
          title="விரைவுப் பயிற்சி (Quick Practice)"
          aria-label="Quick Practice Test"
          className="w-14 h-14 rounded-full bg-secondary text-on-secondary shadow-xl shadow-secondary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-secondary-fixed-dim"
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
        </button>
      </div>
    </div>
  );
};

export default PracticePage;
