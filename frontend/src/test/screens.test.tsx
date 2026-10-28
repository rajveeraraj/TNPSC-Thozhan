import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import HomePage from '../pages/HomePage';
import QuizPage from '../pages/QuizPage';
import PracticePage from '../pages/PracticePage';
import ProfilePage from '../pages/ProfilePage';
import TargetExamBanner from '../components/home/TargetExamBanner';
import StreakCard from '../components/home/StreakCard';
import DailyQuizLauncher from '../components/home/DailyQuizLauncher';
import SyllabusGrid from '../components/home/SyllabusGrid';
import MockTestBanner from '../components/home/MockTestBanner';
import QuizHeader from '../components/quiz/QuizHeader';
import QuestionCard from '../components/quiz/QuestionCard';
import OptionButton from '../components/quiz/OptionButton';
import ExplanationCard from '../components/quiz/ExplanationCard';
import QuizSummaryModal from '../components/quiz/QuizSummaryModal';
import PracticeTabs from '../components/practice/PracticeTabs';
import SearchBar from '../components/practice/SearchBar';
import FilterChips from '../components/practice/FilterChips';
import TopicCard from '../components/practice/TopicCard';
import PyqCard from '../components/practice/PyqCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import MetricsGrid from '../components/profile/MetricsGrid';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import SettingsList from '../components/profile/SettingsList';
import { useQuizStore } from '../store/quizStore';
import { usePracticeStore } from '../store/practiceStore';
import { mockQuestions, mockUser, mockTopics, mockPyqs, mockProgress } from '../api/mockData';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Screen 1: முகப்பு (Home Dashboard)', () => {
  it('renders TargetExamBanner with exam title, countdown days and progress bar', () => {
    render(
      <TargetExamBanner
        targetExam="TNPSC Group 4 & VAO 2024"
        daysRemaining={45}
        completionPercentage={64}
      />
    );

    expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
    expect(screen.getByText('TNPSC Group 4 & VAO 2024')).toBeInTheDocument();
    expect(screen.getByText(/45 நாட்கள் மட்டுமே உள்ளது/)).toBeInTheDocument();
    expect(screen.getAllByText('64%').length).toBeGreaterThan(0);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '64');
  });

  it('renders StreakCard with streak count, personal best record and 14-day activity dots', () => {
    const handleCardClick = vi.fn();
    render(
      <StreakCard
        currentStreak={7}
        bestStreak={21}
        onCardClick={handleCardClick}
      />
    );

    expect(screen.getByText(/7 நாள் தொடர்ச்சி/)).toBeInTheDocument();
    expect(screen.getByText(/அதிகபட்சம் 21 நாட்கள்/)).toBeInTheDocument();
    expect(screen.getByText('தொடர்க!')).toBeInTheDocument();

    // Verify 14 activity dot indicators
    for (let i = 0; i < 14; i++) {
      expect(screen.getByTestId(`activity-dot-${i}`)).toBeInTheDocument();
    }

    // Card click
    fireEvent.click(screen.getByText(/7 நாள் தொடர்ச்சி/));
    expect(handleCardClick).toHaveBeenCalledTimes(1);
  });

  it('renders DailyQuizLauncher with watermark, day number, and calls onStartQuiz on CTA tap', () => {
    const handleStart = vi.fn();
    render(
      <DailyQuizLauncher
        dayNumber={142}
        questionCount={10}
        durationMinutes={10}
        onStartQuiz={handleStart}
      />
    );

    expect(screen.getByText('இன்றைய மாதிரித் தேர்வு')).toBeInTheDocument();
    expect(screen.getByText('நாள் #142 - சிறப்பு மாதிரித் தேர்வு')).toBeInTheDocument();
    expect(screen.getByText(/10 கேள்விகள் • 10 நிமிடங்கள்/)).toBeInTheDocument();

    const startBtn = screen.getByRole('button', { name: /தேர்வைத் தொடங்குக/i });
    fireEvent.click(startBtn);
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  it('renders SyllabusGrid with 6 core subjects and triggers selection callback', () => {
    const handleSelect = vi.fn();
    render(<SyllabusGrid onSelectSubject={handleSelect} />);

    expect(screen.getByText('பாடப் பிரிவுகள் (Syllabus)')).toBeInTheDocument();
    expect(screen.getByText('தமிழ் இலக்கியம்')).toBeInTheDocument();
    expect(screen.getByText('இந்திய அரசியல்')).toBeInTheDocument();
    expect(screen.getByText('வரலாறு')).toBeInTheDocument();
    expect(screen.getByText('புவியியல்')).toBeInTheDocument();
    expect(screen.getByText('கணிதம்')).toBeInTheDocument();
    expect(screen.getByText('பொது அறிவு')).toBeInTheDocument();

    fireEvent.click(screen.getByText('தமிழ் இலக்கியம்'));
    expect(handleSelect).toHaveBeenCalledWith('tamil_literature');
  });

  it('renders MockTestBanner with timer and toggles registration status on click', () => {
    const handleRegister = vi.fn();
    render(
      <MockTestBanner
        title="அடுத்த மெகா மாதிரித் தேர்வு"
        initialTimeText="02 மணி 14 நிமி"
        onRegister={handleRegister}
      />
    );

    expect(screen.getByText('அடுத்த மெகா மாதிரித் தேர்வு')).toBeInTheDocument();
    expect(screen.getByText(/02 மணி 14 நிமி/)).toBeInTheDocument();

    const regBtn = screen.getByRole('button', { name: 'பதிவு' });
    fireEvent.click(regBtn);
    expect(handleRegister).toHaveBeenCalledTimes(1);
    expect(screen.getByText('பதிவு முடிந்தது ✓')).toBeInTheDocument();
  });

  it('composes complete HomePage with all 5 sections and connects callbacks', () => {
    const handleStartQuiz = vi.fn();
    const handleToast = vi.fn();

    render(
      <HomePage
        onStartQuiz={handleStartQuiz}
        onShowToast={handleToast}
      />
    );

    expect(screen.getByText('TNPSC Group 4 & VAO 2024')).toBeInTheDocument();
    expect(screen.getByText(/7 நாள் தொடர்ச்சி/)).toBeInTheDocument();
    expect(screen.getByText('நாள் #142 - சிறப்பு மாதிரித் தேர்வு')).toBeInTheDocument();
    expect(screen.getByText('பாடப் பிரிவுகள் (Syllabus)')).toBeInTheDocument();
    expect(screen.getByText('அடுத்த மெகா மாதிரித் தேர்வு')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /தேர்வைத் தொடங்குக/i }));
    expect(handleStartQuiz).toHaveBeenCalledTimes(1);
  });
});

describe('Screen 2: தினசரி தேர்வு (Daily Quiz Player)', () => {
  beforeEach(() => {
    useQuizStore.getState().resetQuiz();
  });

  it('renders QuizHeader with live timer and close button triggering confirmation modal', () => {
    const handleExit = vi.fn();
    render(
      <QuizHeader
        currentQuestion={3}
        totalQuestions={10}
        timeRemaining={525} // 08:45
        onExit={handleExit}
      />
    );

    expect(screen.getByText('வினா 3 / 10')).toBeInTheDocument();
    expect(screen.getByText(/08:45 மீதம்/)).toBeInTheDocument();

    // Click close button
    const closeBtn = screen.getByLabelText('Close quiz');
    fireEvent.click(closeBtn);

    // Confirmation modal should appear
    expect(screen.getByText('தேர்விலிருந்து வெளியேற வேண்டுமா?')).toBeInTheDocument();
    expect(screen.getByText('இப்போது வெளியேறினால் உங்கள் விடைகள் சேமிக்கப்படாது.')).toBeInTheDocument();

    // Cancel exit
    fireEvent.click(screen.getByRole('button', { name: 'ரத்து' }));
    expect(screen.queryByText('தேர்விலிருந்து வெளியேற வேண்டுமா?')).not.toBeInTheDocument();
    expect(handleExit).not.toHaveBeenCalled();

    // Open again and confirm exit
    fireEvent.click(closeBtn);
    fireEvent.click(screen.getByRole('button', { name: 'வெளியேறு' }));
    expect(handleExit).toHaveBeenCalledTimes(1);
  });

  it('renders QuestionCard with category badge, bold Tamil question, English subtext, and TTS audio button', () => {
    const mockSpeak = vi.fn();
    window.speechSynthesis = {
      speak: mockSpeak,
      cancel: vi.fn(),
      paused: false,
      pending: false,
      speaking: false,
      onvoiceschanged: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      pause: vi.fn(),
      resume: vi.fn(),
    } as unknown as SpeechSynthesis;

    window.SpeechSynthesisUtterance = vi.fn().mockImplementation((text: string) => ({
      text,
      lang: '',
      rate: 1,
    })) as unknown as typeof SpeechSynthesisUtterance;

    const sampleQ = mockQuestions[0]!;
    render(<QuestionCard question={sampleQ} />);

    expect(screen.getByText(sampleQ.category)).toBeInTheDocument();
    expect(screen.getByText(sampleQ.question_ta)).toBeInTheDocument();
    expect(screen.getByText(sampleQ.question_en!)).toBeInTheDocument();

    const ttsBtn = screen.getByLabelText('கேள்வியைக் கேட்கவும்');
    fireEvent.click(ttsBtn);
    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it('handles OptionButton states: unselected, correct emerald state, incorrect error state, and disabled lock', () => {
    const sampleOpt = mockQuestions[0]!.options[0]!;
    const handleSelect = vi.fn();

    // 1. Unanswered state
    const { rerender } = render(
      <OptionButton
        option={sampleOpt}
        selectedOptionId={undefined}
        correctAnswerId="A"
        isAnswered={false}
        onSelect={handleSelect}
      />
    );

    const btn = screen.getByTestId('option-A');
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(handleSelect).toHaveBeenCalledWith('A');

    // 2. Answered & Correct state
    rerender(
      <OptionButton
        option={sampleOpt}
        selectedOptionId="A"
        correctAnswerId="A"
        isAnswered={true}
        onSelect={handleSelect}
      />
    );
    expect(btn).toBeDisabled();
    expect(btn.getAttribute('data-correct')).toBe('true');

    // 3. Answered & Incorrect state
    const wrongOpt = mockQuestions[0]!.options[1]!; // Option B
    rerender(
      <OptionButton
        option={wrongOpt}
        selectedOptionId="B"
        correctAnswerId="A"
        isAnswered={true}
        onSelect={handleSelect}
      />
    );
    const btnB = screen.getByTestId('option-B');
    expect(btnB).toBeDisabled();
    expect(btnB.getAttribute('data-correct')).toBe('false');
  });

  it('renders ExplanationCard with lightbulb icon and detailed educational explanation', () => {
    const expText =
      "ஈறுபோதல் விதிப்படி 'மை' விகுதி கெட்டு 'செம் + கோல்' என்றாகி, மகர மெய் ஙகர மெய்யாகத் திரிந்து 'செங்கோல்' எனப் புணர்ந்தது.";
    render(<ExplanationCard explanation={expText} />);

    expect(screen.getByText('விளக்கம் (Explanation)')).toBeInTheDocument();
    expect(screen.getByText(expText)).toBeInTheDocument();
  });

  it('renders QuizSummaryModal with score, accuracy %, motivational message and home button', () => {
    const handleGoHome = vi.fn();
    render(
      <QuizSummaryModal
        isOpen={true}
        score={8}
        total={10}
        submissionResult={{
          score: 8,
          total: 10,
          accuracy_percentage: 80,
          streak: { current: 8, best: 21, last_date: '2024-11-15', is_completed_today: true },
          results: [],
        }}
        onGoHome={handleGoHome}
      />
    );

    expect(screen.getByText('தேர்வு முடிவுகள்')).toBeInTheDocument();
    expect(screen.getByText('8 / 10')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText(/உங்கள் தொடர்ச்சி 8 நாட்களாக உயர்ந்துள்ளது!/)).toBeInTheDocument();

    const homeBtn = screen.getByRole('button', { name: /முகப்புக்குச் செல்/i });
    fireEvent.click(homeBtn);
    expect(handleGoHome).toHaveBeenCalledTimes(1);
  });

  it('executes full interactive Daily Quiz flow: load -> answer question -> reveal explanation -> navigate -> submit -> view summary', async () => {
    const handleClose = vi.fn();
    render(<QuizPage onClose={handleClose} />);

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
    });

    // Check Question 1 options are present
    expect(screen.getByTestId('option-A')).toBeInTheDocument();
    expect(screen.getByTestId('option-B')).toBeInTheDocument();

    // Prior to answering, explanation is hidden
    expect(screen.queryByText('விளக்கம் (Explanation)')).not.toBeInTheDocument();

    // Select Option A
    fireEvent.click(screen.getByTestId('option-A'));

    // Explanation should now appear
    expect(screen.getByText('விளக்கம் (Explanation)')).toBeInTheDocument();

    // Options should now be locked
    expect(screen.getByTestId('option-A')).toBeDisabled();
    expect(screen.getByTestId('option-B')).toBeDisabled();

    // Navigate to Question 2
    const nextBtn = screen.getByRole('button', { name: /அடுத்து/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/வினா 2 \/ 10/)).toBeInTheDocument();

    // Previous button should now be enabled
    const prevBtn = screen.getByRole('button', { name: /முந்தைய/i });
    expect(prevBtn).not.toBeDisabled();
    fireEvent.click(prevBtn);
    expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
  });
});

describe('Screen 3: பயிற்சி (Practice & PYQs)', () => {
  beforeEach(async () => {
    usePracticeStore.setState({
      activeTab: 'topic',
      selectedFilter: 'all',
      searchQuery: '',
      topics: mockTopics,
      pyqs: mockPyqs,
      bookmarkedIds: [],
    });
  });

  it('switches between Topic-wise and PYQs tabs smoothly', () => {
    const handleTabChange = vi.fn();
    render(<PracticeTabs activeTab="topic" onTabChange={handleTabChange} />);

    const pyqTab = screen.getByTestId('tab-pyq');
    fireEvent.click(pyqTab);
    expect(handleTabChange).toHaveBeenCalledWith('pyq');
  });

  it('filters topics by search query in real-time and clears query with clear button', () => {
    const handleChange = vi.fn();
    const handleClear = vi.fn();
    render(
      <SearchBar
        value="இலக்கியம்"
        onChange={handleChange}
        onClear={handleClear}
      />
    );

    const input = screen.getByLabelText('Search topics and questions');
    expect(input).toHaveValue('இலக்கியம்');

    const clearBtn = screen.getByLabelText('Clear search');
    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith('');
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders filter chips and updates selected filter on chip click', () => {
    const handleSelectFilter = vi.fn();
    render(
      <FilterChips
        selectedFilter="all"
        onSelectFilter={handleSelectFilter}
      />
    );

    const group4Chip = screen.getByTestId('filter-chip-group4');
    fireEvent.click(group4Chip);
    expect(handleSelectFilter).toHaveBeenCalledWith('group4');
  });

  it('renders TopicCard with completion percentage, category tag and toggles bookmark', () => {
    const sampleTopic = { ...mockTopics[0]!, completed_percentage: 75 };
    const handleBookmark = vi.fn();
    const handleStart = vi.fn();

    render(
      <TopicCard
        topic={sampleTopic}
        isBookmarked={false}
        onToggleBookmark={handleBookmark}
        onStartPractice={handleStart}
      />
    );

    expect(screen.getByText('பொது தமிழ் - இலக்கணம்')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Group 4 சிறப்புப் பகுதி')).toBeInTheDocument();

    const bookmarkBtn = screen.getByLabelText('Bookmark topic');
    fireEvent.click(bookmarkBtn);
    expect(handleBookmark).toHaveBeenCalledTimes(1);

    const startBtn = screen.getByRole('button', { name: /தொடங்கு/i });
    fireEvent.click(startBtn);
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  it('renders PyqCard with verified solutions badge and triggers exam action', () => {
    const samplePyq = mockPyqs[0]!;
    const handleBookmark = vi.fn();
    const handleTakeExam = vi.fn();

    render(
      <PyqCard
        pyq={samplePyq}
        isBookmarked={true}
        onToggleBookmark={handleBookmark}
        onTakeExam={handleTakeExam}
      />
    );

    expect(screen.getByText('TNPSC Group 4 - 2023')).toBeInTheDocument();
    expect(screen.getByText(/200 கேள்விகள்/)).toBeInTheDocument();

    const examBtn = screen.getByRole('button', { name: /தேர்வு எழுது/i });
    fireEvent.click(examBtn);
    expect(handleTakeExam).toHaveBeenCalledTimes(1);
  });

  it('renders PracticePage, handles search filtering, filter chips and quick practice FAB', async () => {
    const handleStartQuiz = vi.fn();
    const handleToast = vi.fn();

    render(
      <PracticePage
        initialTab="topic"
        onStartQuiz={handleStartQuiz}
        onShowToast={handleToast}
      />
    );

    // Initial topic cards should be visible
    expect(screen.getByText('பயிற்சி தளம் (Practice)')).toBeInTheDocument();
    expect(screen.getByText('பொது தமிழ் - இலக்கணம்')).toBeInTheDocument();

    // Click quick practice FAB
    const fabBtn = screen.getByLabelText('Quick Practice Test');
    fireEvent.click(fabBtn);
    expect(handleStartQuiz).toHaveBeenCalledWith('quick_practice');
    expect(handleToast).toHaveBeenCalledWith(expect.stringContaining('விரைவுப் பயிற்சி'));
  });
});

describe('Screen 4: சுயவிவரம் (Profile & Progress)', () => {
  it('renders ProfileHeader with candidate name, registration id, target badge and edit link', () => {
    const handleEdit = vi.fn();
    render(<ProfileHeader user={mockUser} onEdit={handleEdit} />);

    expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
    expect(screen.getByText(/TNPSC-2024-8932/)).toBeInTheDocument();
    expect(screen.getByText('Group 4 VAO')).toBeInTheDocument();
    expect(screen.getByText(/தமிழ்நாடு அரசு பணி தேர்வு 2024/)).toBeInTheDocument();

    const editBtn = screen.getByRole('button', { name: /மாற்று/i });
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('renders MetricsGrid with streak, accuracy and questions solved stats', () => {
    const handleMetric = vi.fn();
    render(
      <MetricsGrid
        streakDays={7}
        accuracyPercentage={84}
        questionsSolved={1420}
        onMetricClick={handleMetric}
      />
    );

    expect(screen.getByText(/7/)).toBeInTheDocument();
    expect(screen.getByText('தொடர்ச்சி 🔥')).toBeInTheDocument();
    expect(screen.getByText('84%')).toBeInTheDocument();
    expect(screen.getByText('துல்லியம் 🎯')).toBeInTheDocument();
    expect(screen.getByText('1,420')).toBeInTheDocument();
    expect(screen.getByText('வினாக்கள் 📚')).toBeInTheDocument();

    fireEvent.click(screen.getByText('84%'));
    expect(handleMetric).toHaveBeenCalledWith('accuracy');
  });

  it('renders ActivityHeatmap with 14 day cells, status badge, and today indicator', () => {
    render(<ActivityHeatmap days={mockProgress.heatmap} />);

    expect(screen.getByText('14-நாள் செயல்பாட்டு வரைபடம்')).toBeInTheDocument();
    expect(screen.getByText('மிகச்சிறப்பு')).toBeInTheDocument();

    // Check cells 1 to 14
    for (let dayIndex = 1; dayIndex <= 14; dayIndex++) {
      expect(screen.getByTestId(`heatmap-cell-${dayIndex}`)).toBeInTheDocument();
    }
  });

  it('renders SettingsList with preferences and triggers item actions', () => {
    const handleSelectSetting = vi.fn();
    const handleLogout = vi.fn();

    render(
      <SettingsList
        onSelectSetting={handleSelectSetting}
        onLogout={handleLogout}
      />
    );

    expect(screen.getByText('அமைப்புகள் & விருப்பங்கள்')).toBeInTheDocument();
    expect(screen.getByText('குறிப்புகள் & சேமிப்பு')).toBeInTheDocument();
    expect(screen.getByText('பலவீனமான தலைப்புகள் பகுப்பாய்வு')).toBeInTheDocument();
    expect(screen.getByText('அறிவிப்புகள் & நினைவூட்டல்கள்')).toBeInTheDocument();
    expect(screen.getByText('மொழி & தோற்றம்')).toBeInTheDocument();
    expect(screen.getByText('வெளியேறு')).toBeInTheDocument();

    fireEvent.click(screen.getByText('குறிப்புகள் & சேமிப்பு'));
    expect(handleSelectSetting).toHaveBeenCalledWith('bookmarks');

    fireEvent.click(screen.getByText('வெளியேறு'));
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('renders ProfilePage composing header, metrics, heatmap, settings, and version footer', () => {
    const handleToast = vi.fn();
    const handleLogout = vi.fn();

    render(<ProfilePage onShowToast={handleToast} onLogout={handleLogout} />);

    expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
    expect(screen.getByText('14-நாள் செயல்பாட்டு வரைபடம்')).toBeInTheDocument();
    expect(screen.getByText('அமைப்புகள் & விருப்பங்கள்')).toBeInTheDocument();
    expect(screen.getByText('TNPSC தோழன் பதிப்பு 2.4.1')).toBeInTheDocument();
    expect(screen.getByText('வெற்றி நிச்சயம், விடாமுயற்சி!')).toBeInTheDocument();
  });
});

describe('Full App Interactive Navigation & Transitions', () => {
  it('switches between all 4 tabs and supports opening daily quiz from Home launcher', async () => {
    render(<App />);

    // 1. Initial Home Dashboard
    expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
    expect(screen.getByText('நாள் #142 - சிறப்பு மாதிரித் தேர்வு')).toBeInTheDocument();

    // 2. Start Daily Quiz from Home Launcher card
    const startQuizBtn = screen.getByRole('button', { name: /தேர்வைத் தொடங்குக/i });
    fireEvent.click(startQuizBtn);

    // Quiz page should be open
    await waitFor(() => {
      expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
    });

    // 3. Exit quiz using quiz header close button
    const closeBtn = screen.getByLabelText('Close quiz');
    fireEvent.click(closeBtn);
    fireEvent.click(screen.getByRole('button', { name: 'வெளியேறு' }));

    // Should return back to Home
    expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();

    // 4. Switch to Practice tab
    const practiceTab = screen.getByRole('button', { name: /பயிற்சி/i });
    fireEvent.click(practiceTab);
    expect(screen.getByText('பயிற்சி தளம் (Practice)')).toBeInTheDocument();

    // 5. Switch to Questions tab
    const questionsTab = screen.getByRole('button', { name: /வினாக்கள்/i });
    fireEvent.click(questionsTab);
    expect(screen.getByText('முந்தைய ஆண்டு வினாக்கள் (PYQs)')).toBeInTheDocument();

    // 6. Switch to Profile tab
    const profileTab = screen.getByRole('button', { name: /சுயவிவரம்/i });
    fireEvent.click(profileTab);
    expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
  });
});
