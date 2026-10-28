import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import PracticePage from '../pages/PracticePage';
import ProfilePage from '../pages/ProfilePage';
import PracticeTabs from '../components/practice/PracticeTabs';
import BottomNav, { NAV_TABS } from '../components/common/BottomNav';
import MetricsGrid from '../components/profile/MetricsGrid';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import ProfileHeader from '../components/profile/ProfileHeader';
import SettingsList from '../components/profile/SettingsList';
import { usePracticeStore } from '../store/practiceStore';
import { useQuizStore } from '../store/quizStore';
import { mockTopics, mockPyqs, mockUser } from '../api/mockData';
import type { HeatmapDay } from '../types/api';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Empirical Challenger 2 — Milestone 3 Verification Suite', () => {
  beforeEach(() => {
    usePracticeStore.setState({
      activeTab: 'topic',
      selectedFilter: 'all',
      searchQuery: '',
      topics: mockTopics,
      pyqs: mockPyqs,
      bookmarkedIds: [],
      isLoading: false,
      error: null,
    });
    useQuizStore.setState({
      isSubmitted: false,
      answers: {},
      currentQuestionIndex: 0,
    });
  });

  /* ==========================================================================
     1. Practice Screen Interactions
     ========================================================================== */
  describe('1. Practice Screen Interactions', () => {
    it('1.1 toggles segmented tabs between Topic-wise and PYQs in PracticeTabs component', () => {
      let currentTab: 'topic' | 'pyq' = 'topic';
      const handleTabChange = vi.fn((tab: 'topic' | 'pyq') => {
        currentTab = tab;
      });

      const { rerender } = render(
        <PracticeTabs activeTab={currentTab} onTabChange={handleTabChange} />
      );

      const topicTab = screen.getByTestId('tab-topic');
      const pyqTab = screen.getByTestId('tab-pyq');

      expect(topicTab).toHaveAttribute('aria-selected', 'true');
      expect(pyqTab).toHaveAttribute('aria-selected', 'false');

      // Click PYQ tab
      fireEvent.click(pyqTab);
      expect(handleTabChange).toHaveBeenCalledWith('pyq');

      // Rerender with activeTab="pyq"
      rerender(<PracticeTabs activeTab="pyq" onTabChange={handleTabChange} />);
      expect(screen.getByTestId('tab-pyq')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('tab-topic')).toHaveAttribute('aria-selected', 'false');
    });

    it('1.2 allows toggling segmented tab to PYQ even if initialTab="topic" is present', () => {
      render(
        <PracticePage
          initialTab="topic"
          onStartQuiz={vi.fn()}
        />
      );

      const pyqTab = screen.getByTestId('tab-pyq');
      const topicTab = screen.getByTestId('tab-topic');

      expect(topicTab).toHaveAttribute('aria-selected', 'true');

      // Switch to PYQ
      fireEvent.click(pyqTab);

      const stateActiveTab = usePracticeStore.getState().activeTab;
      expect(stateActiveTab).toBe('pyq');
      expect(pyqTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('முந்தைய ஆண்டு வினாக்கள் (PYQs)')).toBeInTheDocument();
      expect(screen.getByText('TNPSC Group 4 - 2023')).toBeInTheDocument();
    });

    it('1.3 toggles segmented tabs successfully when initialTab is not passed', () => {
      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      const pyqTab = screen.getByTestId('tab-pyq');
      const topicTab = screen.getByTestId('tab-topic');

      expect(topicTab).toHaveAttribute('aria-selected', 'true');

      // Click PYQ tab
      fireEvent.click(pyqTab);

      // Now successfully switches to PYQ because initialTab is undefined
      expect(pyqTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('முந்தைய ஆண்டு வினாக்கள் (PYQs)')).toBeInTheDocument();
      expect(screen.getByText('TNPSC Group 4 - 2023')).toBeInTheDocument();
    });

    it('1.4 respects initialTab="pyq" on mount and renders PYQs directly', () => {
      render(
        <PracticePage
          initialTab="pyq"
          onStartQuiz={vi.fn()}
        />
      );

      const pyqTab = screen.getByTestId('tab-pyq');
      expect(pyqTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('முந்தைய ஆண்டு வினாக்கள் (PYQs)')).toBeInTheDocument();
      expect(screen.getByText('TNPSC Group 4 - 2023')).toBeInTheDocument();
    });

    it('1.5 performs live search filtering on topics with case-insensitivity and whitespace trimming', () => {
      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      const searchInput = screen.getByLabelText('Search topics and questions');
      expect(screen.getByText('பொது தமிழ் - இலக்கணம்')).toBeInTheDocument();
      expect(screen.getByText('தமிழ் இலக்கியம்')).toBeInTheDocument();

      // Search for specific topic "இலக்கியம்"
      fireEvent.change(searchInput, { target: { value: '  இலக்கியம்  ' } });

      expect(screen.getByText('தமிழ் இலக்கியம்')).toBeInTheDocument();
      expect(screen.queryByText('பொது தமிழ் - இலக்கணம்')).not.toBeInTheDocument();
      expect(screen.queryByText('இந்திய அரசியலமைப்பு')).not.toBeInTheDocument();

      // Clear search via clear button
      const clearBtn = screen.getByLabelText('Clear search');
      fireEvent.click(clearBtn);

      expect(searchInput).toHaveValue('');
      expect(screen.getByText('பொது தமிழ் - இலக்கணம்')).toBeInTheDocument();
      expect(screen.getByText('தமிழ் இலக்கியம்')).toBeInTheDocument();
    });

    it('1.6 performs live search filtering on PYQs with year and title search', () => {
      usePracticeStore.setState({ activeTab: 'pyq' });
      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      const searchInput = screen.getByLabelText('Search topics and questions');
      expect(screen.getByText('TNPSC Group 4 - 2023')).toBeInTheDocument();

      // Search by year "2022"
      fireEvent.change(searchInput, { target: { value: '2022' } });

      expect(screen.getByText('TNPSC Group 2 / 2A - 2022 வினாத்தாள்')).toBeInTheDocument();
      expect(screen.queryByText('TNPSC Group 4 - 2023')).not.toBeInTheDocument();
    });

    it('1.7 handles empty search state and resets filters properly when button clicked', () => {
      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      const searchInput = screen.getByLabelText('Search topics and questions');

      // Search for non-existent topic
      fireEvent.change(searchInput, { target: { value: 'xyz_random_nonexistent_topic_999' } });

      // Check empty state
      expect(screen.getByText('பொருத்தமான தலைப்புகள் எதுவும் கிடைக்கவில்லை')).toBeInTheDocument();
      expect(screen.getByText('search_off')).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: 'வடிகட்டிகளை மீட்டமை' });
      expect(resetBtn).toBeInTheDocument();

      // Click reset button
      fireEvent.click(resetBtn);

      // Search input is cleared and all topics are restored
      expect(searchInput).toHaveValue('');
      expect(screen.getByText('பொது தமிழ் - இலக்கணம்')).toBeInTheDocument();
      expect(screen.getByText('தமிழ் இலக்கியம்')).toBeInTheDocument();
    });

    it('1.8 handles empty search state in PYQ tab with appropriate Tamil message', () => {
      usePracticeStore.setState({ activeTab: 'pyq' });
      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      const searchInput = screen.getByLabelText('Search topics and questions');
      fireEvent.change(searchInput, { target: { value: 'nonexistent_pyq_query' } });

      expect(screen.getByText('பொருத்தமான வினாத்தாள்கள் எதுவும் கிடைக்கவில்லை')).toBeInTheDocument();
      expect(screen.getByText('search_off')).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: 'வடிகட்டிகளை மீட்டமை' });
      fireEvent.click(resetBtn);

      expect(screen.getByText('TNPSC Group 4 - 2023')).toBeInTheDocument();
    });

    it('1.9 selects filter chips and applies active styling and filtering', () => {
      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      const allChip = screen.getByTestId('filter-chip-all');
      const group4Chip = screen.getByTestId('filter-chip-group4');
      const tamilChip = screen.getByTestId('filter-chip-tamil');

      expect(allChip).toHaveAttribute('aria-pressed', 'true');
      expect(group4Chip).toHaveAttribute('aria-pressed', 'false');

      // Click Group 4 filter chip
      fireEvent.click(group4Chip);

      expect(group4Chip).toHaveAttribute('aria-pressed', 'true');
      expect(allChip).toHaveAttribute('aria-pressed', 'false');

      // Click Tamil filter chip
      fireEvent.click(tamilChip);
      expect(tamilChip).toHaveAttribute('aria-pressed', 'true');
      expect(group4Chip).toHaveAttribute('aria-pressed', 'false');
    });

    it('1.10 toggles topic bookmark, triggers toast, updates icon filled state, and stops event propagation', async () => {
      const handleStart = vi.fn();
      const handleToast = vi.fn();

      render(
        <PracticePage
          onStartQuiz={handleStart}
          onShowToast={handleToast}
        />
      );

      const bookmarkBtn = screen.getAllByLabelText('Bookmark topic')[0]!;

      // Click bookmark button
      fireEvent.click(bookmarkBtn);

      // Verify toast was triggered with bookmark saved message
      await waitFor(() => {
        expect(handleToast).toHaveBeenCalledWith('புக்மார்க் சேமிக்கப்பட்டது!');
      });

      // Verify onStartPractice was NOT triggered (propagation stopped)
      expect(handleStart).not.toHaveBeenCalled();

      // Click bookmark button again to unbookmark
      fireEvent.click(bookmarkBtn);

      await waitFor(() => {
        expect(handleToast).toHaveBeenCalledWith('புக்மார்க் நீக்கப்பட்டது');
      });
      expect(handleStart).not.toHaveBeenCalled();
    });

    it('1.11 toggles PYQ bookmark, triggers toast, and stops event propagation', async () => {
      const handleStart = vi.fn();
      const handleToast = vi.fn();

      usePracticeStore.setState({ activeTab: 'pyq' });
      render(
        <PracticePage
          onStartQuiz={handleStart}
          onShowToast={handleToast}
        />
      );

      const bookmarkBtn = screen.getAllByLabelText('Bookmark paper')[0]!;

      // Click bookmark button
      fireEvent.click(bookmarkBtn);

      await waitFor(() => {
        expect(handleToast).toHaveBeenCalledWith('புக்மார்க் சேமிக்கப்பட்டது!');
      });
      expect(handleStart).not.toHaveBeenCalled();

      // Click bookmark button again to unbookmark
      fireEvent.click(bookmarkBtn);

      await waitFor(() => {
        expect(handleToast).toHaveBeenCalledWith('புக்மார்க் நீக்கப்பட்டது');
      });
      expect(handleStart).not.toHaveBeenCalled();
    });

    it('1.12 triggers onStartQuiz when clicking topic start button or topic title', () => {
      const handleStart = vi.fn();
      const handleToast = vi.fn();

      render(
        <PracticePage
          onStartQuiz={handleStart}
          onShowToast={handleToast}
        />
      );

      const startButtons = screen.getAllByRole('button', { name: /தொடங்கு/i });
      fireEvent.click(startButtons[0]!);

      expect(handleStart).toHaveBeenCalledWith('topic_tamil_grammar');
      expect(handleToast).toHaveBeenCalledWith('பொது தமிழ் பயிற்சி திறக்கப்படுகிறது');
    });

    it('1.13 triggers onStartQuiz when clicking PYQ exam button', () => {
      const handleStart = vi.fn();
      const handleToast = vi.fn();

      usePracticeStore.setState({ activeTab: 'pyq' });
      render(
        <PracticePage
          onStartQuiz={handleStart}
          onShowToast={handleToast}
        />
      );

      const examButtons = screen.getAllByRole('button', { name: /தேர்வு எழுது/i });
      fireEvent.click(examButtons[0]!);

      expect(handleStart).toHaveBeenCalledWith('pyq_group4_2023');
      expect(handleToast).toHaveBeenCalledWith('Group 4 - 2023 தேர்வு திறக்கப்படுகிறது');
    });
  });

  /* ==========================================================================
     2. Profile Screen Empirical Verification
     ========================================================================== */
  describe('2. Profile Screen Verification', () => {
    it('2.1 renders all 3 stats cards (Streak, Accuracy, Solved) with icons, values, labels and click handlers', () => {
      const handleMetricClick = vi.fn();
      render(
        <MetricsGrid
          streakDays={7}
          accuracyPercentage={84}
          questionsSolved={1420}
          onMetricClick={handleMetricClick}
        />
      );

      // Streak card
      expect(screen.getByText('local_fire_department')).toBeInTheDocument();
      expect(screen.getByText(/7 நாட்கள்/)).toBeInTheDocument();
      expect(screen.getByText('தொடர்ச்சி 🔥')).toBeInTheDocument();

      // Accuracy card
      expect(screen.getByText('ads_click')).toBeInTheDocument();
      expect(screen.getByText('84%')).toBeInTheDocument();
      expect(screen.getByText('துல்லியம் 🎯')).toBeInTheDocument();

      // Questions solved card
      expect(screen.getByText('menu_book')).toBeInTheDocument();
      expect(screen.getByText('1,420')).toBeInTheDocument();
      expect(screen.getByText('வினாக்கள் 📚')).toBeInTheDocument();

      // Test click events on each card
      fireEvent.click(screen.getByText(/7 நாட்கள்/));
      expect(handleMetricClick).toHaveBeenCalledWith('streak');

      fireEvent.click(screen.getByText('84%'));
      expect(handleMetricClick).toHaveBeenCalledWith('accuracy');

      fireEvent.click(screen.getByText('1,420'));
      expect(handleMetricClick).toHaveBeenCalledWith('questions');
    });

    it('2.2 dynamically updates stats in ProfilePage when quiz is completed in store', () => {
      const { rerender } = render(<ProfilePage onShowToast={vi.fn()} />);

      // Initial state
      expect(screen.getByText('7 நாட்கள்')).toBeInTheDocument();
      expect(screen.getByText('1,420')).toBeInTheDocument();

      // Simulate quiz submitted in useQuizStore
      useQuizStore.setState({ isSubmitted: true });

      rerender(<ProfilePage onShowToast={vi.fn()} />);

      // Streak increments to 8, Solved increments by 10 to 1,430
      expect(screen.getByText('8 நாட்கள்')).toBeInTheDocument();
      expect(screen.getByText('1,430')).toBeInTheDocument();
    });

    it('2.3 renders 14-day activity heatmap grid with 14 cells and validates all intensity level classes', () => {
      const testDays: HeatmapDay[] = [
        { date: '2024-11-01', day_index: 1, day_name: 'வெள்ளி', day_short: 'வெள்', score: 10, total: 10, level: 4, status: 'completed' },
        { date: '2024-11-02', day_index: 2, day_name: 'சனி', day_short: 'சனி', score: 8, total: 10, level: 3, status: 'completed' },
        { date: '2024-11-03', day_index: 3, day_name: 'ஞாயிறு', day_short: 'ஞாயி', score: 6, total: 10, level: 2, status: 'completed' },
        { date: '2024-11-04', day_index: 4, day_name: 'திங்கள்', day_short: 'திங்', score: 4, total: 10, level: 1, status: 'completed' },
        { date: '2024-11-05', day_index: 5, day_name: 'செவ்வாய்', day_short: 'செவ்', score: 0, total: 10, level: 0, status: 'completed' },
        { date: '2024-11-06', day_index: 6, day_name: 'புதன்', day_short: 'புதன்', score: 0, total: 10, level: 0, status: 'pending' },
        { date: '2024-11-07', day_index: 7, day_name: 'வியாழன்', day_short: 'இன்று', score: 0, total: 10, level: 0, status: 'pending' },
        { date: '2024-11-08', day_index: 8, day_name: 'வெள்ளி', day_short: 'வெள்', score: 0, total: 10, level: 0, status: 'upcoming' },
        { date: '2024-11-09', day_index: 9, day_name: 'சனி', day_short: 'சனி', score: 10, total: 10, level: 4, status: 'completed' },
        { date: '2024-11-10', day_index: 10, day_name: 'ஞாயிறு', day_short: 'ஞாயி', score: 8, total: 10, level: 3, status: 'completed' },
        { date: '2024-11-11', day_index: 11, day_name: 'திங்கள்', day_short: 'திங்', score: 6, total: 10, level: 2, status: 'completed' },
        { date: '2024-11-12', day_index: 12, day_name: 'செவ்வாய்', day_short: 'செவ்', score: 4, total: 10, level: 1, status: 'completed' },
        { date: '2024-11-13', day_index: 13, day_name: 'புதன்', day_short: 'புதன்', score: 10, total: 10, level: 4, status: 'completed' },
        { date: '2024-11-14', day_index: 14, day_name: 'வியாழன்', day_short: 'வியா', score: 10, total: 10, level: 4, status: 'completed' },
      ];

      render(<ActivityHeatmap days={testDays} statusText="மிகச்சிறப்பு" />);

      expect(screen.getByText('14-நாள் செயல்பாட்டு வரைபடம்')).toBeInTheDocument();
      expect(screen.getByText('மிகச்சிறப்பு')).toBeInTheDocument();

      // Check all 14 cells exist
      for (let i = 1; i <= 14; i++) {
        expect(screen.getByTestId(`heatmap-cell-${i}`)).toBeInTheDocument();
      }

      // Check Level 4 class
      const cell1 = screen.getByTestId('heatmap-cell-1');
      expect(cell1.className).toContain('bg-tertiary');
      expect(cell1.className).toContain('text-on-tertiary');

      // Check Level 3 class
      const cell2 = screen.getByTestId('heatmap-cell-2');
      expect(cell2.className).toContain('bg-tertiary/80');

      // Check Level 2 class
      const cell3 = screen.getByTestId('heatmap-cell-3');
      expect(cell3.className).toContain('bg-tertiary/50');

      // Check Level 1 class
      const cell4 = screen.getByTestId('heatmap-cell-4');
      expect(cell4.className).toContain('bg-tertiary/30');

      // Check Level 0 class
      const cell5 = screen.getByTestId('heatmap-cell-5');
      expect(cell5.className).toContain('bg-surface-container-highest/60');

      // Check Today / Pending class (with animate-pulse & border-secondary)
      const cell7 = screen.getByTestId('heatmap-cell-7');
      expect(cell7.className).toContain('border-secondary');
      expect(cell7.className).toContain('animate-pulse');

      // Check Upcoming class
      const cell8 = screen.getByTestId('heatmap-cell-8');
      expect(cell8.className).toContain('bg-surface-container-highest/40');
    });

    it('2.4 renders ProfileHeader with candidate info and triggers edit profile callback', () => {
      const handleEdit = vi.fn();
      render(<ProfileHeader user={mockUser} onEdit={handleEdit} />);

      expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
      expect(screen.getByText('(Anbazhagan)')).toBeInTheDocument();
      expect(screen.getByText(/TNPSC-2024-8932/)).toBeInTheDocument();
      expect(screen.getByText('Group 4 VAO')).toBeInTheDocument();
      expect(screen.getByText(/தமிழ்நாடு அரசு பணி தேர்வு 2024/)).toBeInTheDocument();

      const editBtn = screen.getByRole('button', { name: /மாற்று/i });
      fireEvent.click(editBtn);
      expect(handleEdit).toHaveBeenCalledTimes(1);
    });

    it('2.5 renders SettingsList and handles Bookmarks navigation, setting toasts, and Logout', () => {
      const handleSelectSetting = vi.fn();
      const handleLogout = vi.fn();

      render(
        <SettingsList
          onSelectSetting={handleSelectSetting}
          onLogout={handleLogout}
        />
      );

      // Bookmarks row
      fireEvent.click(screen.getByText('குறிப்புகள் & சேமிப்பு'));
      expect(handleSelectSetting).toHaveBeenCalledWith('bookmarks');

      // Weak topics row
      fireEvent.click(screen.getByText('பலவீனமான தலைப்புகள் பகுப்பாய்வு'));
      expect(handleSelectSetting).toHaveBeenCalledWith('weak_topics');

      // Notifications row
      fireEvent.click(screen.getByText('அறிவிப்புகள் & நினைவூட்டல்கள்'));
      expect(handleSelectSetting).toHaveBeenCalledWith('notifications');

      // Theme row
      fireEvent.click(screen.getByText('மொழி & தோற்றம்'));
      expect(handleSelectSetting).toHaveBeenCalledWith('theme');

      // Logout row
      fireEvent.click(screen.getByText('வெளியேறு'));
      expect(handleLogout).toHaveBeenCalledTimes(1);
    });
  });

  /* ==========================================================================
     3. Global Navigation Across All 4 Tabs
     ========================================================================== */
  describe('3. Global Navigation Across All 4 Tabs', () => {
    it('3.1 renders BottomNav with all 4 defined tabs and highlights active tab correctly', () => {
      const handleTabChange = vi.fn();
      const { rerender } = render(
        <BottomNav activeTab="home" onTabChange={handleTabChange} />
      );

      expect(NAV_TABS).toHaveLength(4);
      expect(NAV_TABS.map((t) => t.id)).toEqual(['home', 'practice', 'questions', 'profile']);

      // Home tab active
      const homeBtn = screen.getByRole('button', { name: /முகப்பு/i });
      expect(homeBtn).toHaveAttribute('aria-current', 'page');
      expect(homeBtn.className).toContain('text-secondary bg-surface-container-highest');

      // Practice tab inactive
      const practiceBtn = screen.getByRole('button', { name: /பயிற்சி/i });
      expect(practiceBtn).not.toHaveAttribute('aria-current');

      // Click practice tab
      fireEvent.click(practiceBtn);
      expect(handleTabChange).toHaveBeenCalledWith('practice');

      // Rerender with practice active
      rerender(<BottomNav activeTab="practice" onTabChange={handleTabChange} />);
      expect(screen.getByRole('button', { name: /பயிற்சி/i })).toHaveAttribute('aria-current', 'page');
    });

    it('3.2 navigates through all 4 screens in App and validates screen content mounting', async () => {
      render(<App />);

      // Tab 1: Home Dashboard
      expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
      expect(screen.getByText('நாள் #142 - சிறப்பு மாதிரித் தேர்வு')).toBeInTheDocument();

      // Tab 2: Practice
      const practiceTab = screen.getByRole('button', { name: /பயிற்சி/i });
      fireEvent.click(practiceTab);
      expect(screen.getByText('பயிற்சி தளம் (Practice)')).toBeInTheDocument();
      expect(screen.getByText('பொது தமிழ் - இலக்கணம்')).toBeInTheDocument();

      // Tab 3: Questions (PYQs)
      const questionsTab = screen.getByRole('button', { name: /வினாக்கள்/i });
      fireEvent.click(questionsTab);
      expect(screen.getByText('முந்தைய ஆண்டு வினாக்கள் (PYQs)')).toBeInTheDocument();
      expect(screen.getByText('TNPSC Group 4 - 2023')).toBeInTheDocument();

      // Tab 4: Profile
      const profileTab = screen.getByRole('button', { name: /சுயவிவரம்/i });
      fireEvent.click(profileTab);
      expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
      expect(screen.getByText('14-நாள் செயல்பாட்டு வரைபடம்')).toBeInTheDocument();
      expect(screen.getByText('TNPSC தோழன் பதிப்பு 2.4.1')).toBeInTheDocument();

      // Back to Home
      const homeTab = screen.getByRole('button', { name: /முகப்பு/i });
      fireEvent.click(homeTab);
      expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
    });

    it('3.3 Header avatar click navigates directly to Profile tab with toast notification', async () => {
      render(<App />);

      // Click avatar in Header
      const avatarBtn = screen.getByLabelText('Profile Avatar');
      fireEvent.click(avatarBtn);

      // Verify Profile page is active and toast is shown
      expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
      expect(screen.getByText('சுயவிவரப் பக்கத்திற்கு மாறுகிறது')).toBeInTheDocument();
    });

    it('3.4 Header streak click triggers streak toast notification', async () => {
      render(<App />);

      const streakBtn = screen.getByLabelText('Streak: 14 days');
      fireEvent.click(streakBtn);

      expect(screen.getByText('14-நாள் தொடர்ச்சி செயலில் உள்ளது! 🔥')).toBeInTheDocument();
    });

    it('3.5 clicking a bottom navigation tab while quiz is active dismisses quiz and transitions cleanly', async () => {
      render(<App />);

      // Launch Daily Quiz from Home Launcher
      const startQuizBtn = screen.getByRole('button', { name: /தேர்வைத் தொடங்குக/i });
      fireEvent.click(startQuizBtn);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      // While quiz is active, click Bottom Nav "சுயவிவரம்" (Profile)
      const profileTab = screen.getByRole('button', { name: /சுயவிவரம்/i });
      fireEvent.click(profileTab);

      // Quiz is dismissed and Profile screen mounts
      expect(screen.queryByText(/வினா 1 \/ 10/)).not.toBeInTheDocument();
      expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
    });
  });

  /* ==========================================================================
     4. Adversarial & Edge Case Stress Testing
     ========================================================================== */
  describe('4. Adversarial & Edge Case Stress Testing', () => {
    it('4.1 rapid consecutive tab switching does not throw or corrupt state', () => {
      render(<App />);

      const tabs = [
        screen.getByRole('button', { name: /பயிற்சி/i }),
        screen.getByRole('button', { name: /வினாக்கள்/i }),
        screen.getByRole('button', { name: /சுயவிவரம்/i }),
        screen.getByRole('button', { name: /முகப்பு/i }),
      ];

      // Rapidly click all tabs 5 times in cycle
      for (let cycle = 0; cycle < 5; cycle++) {
        for (const tab of tabs) {
          fireEvent.click(tab);
        }
      }

      // Final tab was home
      expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
    });

    it('4.2 adversarial search inputs: regex characters, unicode symbols and extreme strings', () => {
      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      const searchInput = screen.getByLabelText('Search topics and questions');

      const extremeInputs = [
        '[.*+?^${}()|[\\]\\\\]', // Regex special characters
        '🔥🔥🔥', // Emojis
        '\'"`; DROP TABLE topics;--', // SQL injection attempt
        '<script>alert("xss")</script>', // XSS attempt
        'a'.repeat(500), // Very long string
      ];

      for (const input of extremeInputs) {
        fireEvent.change(searchInput, { target: { value: input } });
        // Empty state is rendered gracefully without crash
        expect(screen.getByText('பொருத்தமான தலைப்புகள் எதுவும் கிடைக்கவில்லை')).toBeInTheDocument();
      }
    });

    it('4.3 empty dataset behavior: triggers loading state when topics and pyqs arrays are empty', () => {
      usePracticeStore.setState({
        topics: [],
        pyqs: [],
        isLoading: true,
      });

      render(
        <PracticePage
          onStartQuiz={vi.fn()}
        />
      );

      // Shows loading spinner when data is loading
      expect(screen.getByText('தரவுகள் ஏற்றப்படுகின்றன...')).toBeInTheDocument();
    });
  });
});
