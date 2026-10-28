import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';
import QuizPage from '../pages/QuizPage';
import QuizHeader from '../components/quiz/QuizHeader';
import QuestionCard from '../components/quiz/QuestionCard';
import OptionButton from '../components/quiz/OptionButton';
import ExplanationCard from '../components/quiz/ExplanationCard';
import QuizSummaryModal from '../components/quiz/QuizSummaryModal';
import DailyQuizLauncher from '../components/home/DailyQuizLauncher';
import { useQuizStore } from '../store/quizStore';
import { mockQuestions } from '../api/mockData';
import type { OptionId } from '../types/api';

// Mock canvas-confetti
const mockConfetti = vi.fn();
vi.mock('canvas-confetti', () => ({
  default: (...args: unknown[]) => mockConfetti(...args),
}));

describe('Milestone 3 Challenger: Daily Quiz & Home Empirical Stress Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useQuizStore.getState().resetQuiz();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('1. Immediate Option Validation & Lock Integrity', () => {
    it('verifies 4 options exist with letters அ, ஆ, இ, ஈ', () => {
      const q = mockQuestions[0]!;
      const handleSelect = vi.fn();

      render(
        <div role="radiogroup">
          {q.options.map((opt) => (
            <OptionButton
              key={opt.id}
              option={opt}
              selectedOptionId={undefined}
              correctAnswerId={q.answer}
              isAnswered={false}
              onSelect={handleSelect}
            />
          ))}
        </div>
      );

      expect(screen.getByText('அ')).toBeInTheDocument();
      expect(screen.getByText('ஆ')).toBeInTheDocument();
      expect(screen.getByText('இ')).toBeInTheDocument();
      expect(screen.getByText('ஈ')).toBeInTheDocument();
    });

    it('immediately applies emerald styling and checkmark icon on selecting correct answer, locking all options', () => {
      const q = mockQuestions[0]!;
      const correctOptId = q.answer; // "A"
      const handleSelect = vi.fn();

      const { rerender } = render(
        <div role="radiogroup">
          {q.options.map((opt) => (
            <OptionButton
              key={opt.id}
              option={opt}
              selectedOptionId={undefined}
              correctAnswerId={q.answer}
              isAnswered={false}
              onSelect={handleSelect}
            />
          ))}
        </div>
      );

      // Select correct option A
      const optA = screen.getByTestId(`option-${correctOptId}`);
      expect(optA).not.toBeDisabled();
      fireEvent.click(optA);
      expect(handleSelect).toHaveBeenCalledWith(correctOptId);

      // Rerender as answered
      rerender(
        <div role="radiogroup">
          {q.options.map((opt) => (
            <OptionButton
              key={opt.id}
              option={opt}
              selectedOptionId={correctOptId}
              correctAnswerId={q.answer}
              isAnswered={true}
              onSelect={handleSelect}
            />
          ))}
        </div>
      );

      // Correct option has emerald attributes
      const updatedA = screen.getByTestId(`option-${correctOptId}`);
      expect(updatedA).toBeDisabled();
      expect(updatedA).toHaveAttribute('data-correct', 'true');
      expect(updatedA).toHaveAttribute('data-selected', 'true');
      expect(updatedA.className).toContain('border-tertiary');
      expect(updatedA.querySelector('.material-symbols-outlined')?.textContent).toBe('check');

      // Other options are also locked (disabled)
      q.options.forEach((opt) => {
        const btn = screen.getByTestId(`option-${opt.id}`);
        expect(btn).toBeDisabled();
      });
    });

    it('immediately applies error red styling on selecting wrong answer, while highlighting correct answer in emerald and locking', () => {
      const q = mockQuestions[0]!;
      const wrongOptId: OptionId = q.answer === 'A' ? 'B' : 'A';
      const correctOptId = q.answer;
      const handleSelect = vi.fn();

      render(
        <div role="radiogroup">
          {q.options.map((opt) => (
            <OptionButton
              key={opt.id}
              option={opt}
              selectedOptionId={wrongOptId}
              correctAnswerId={correctOptId}
              isAnswered={true}
              onSelect={handleSelect}
            />
          ))}
        </div>
      );

      // Wrong option has red error styling
      const wrongBtn = screen.getByTestId(`option-${wrongOptId}`);
      expect(wrongBtn).toBeDisabled();
      expect(wrongBtn).toHaveAttribute('data-correct', 'false');
      expect(wrongBtn).toHaveAttribute('data-selected', 'true');
      expect(wrongBtn.className).toContain('border-error');
      expect(wrongBtn.querySelector('.material-symbols-outlined')?.textContent).toBe('close');

      // Correct option is revealed in emerald
      const correctBtn = screen.getByTestId(`option-${correctOptId}`);
      expect(correctBtn).toBeDisabled();
      expect(correctBtn).toHaveAttribute('data-correct', 'true');
      expect(correctBtn.className).toContain('border-tertiary');
      expect(correctBtn.querySelector('.material-symbols-outlined')?.textContent).toBe('check');
    });

    it('prevents modifying answer if user repeatedly clicks or clicks another option after selection', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByTestId('option-A')).toBeInTheDocument();
      });

      // Tapping option A
      fireEvent.click(screen.getByTestId('option-A'));

      // Both option A and option B should now be disabled
      expect(screen.getByTestId('option-A')).toBeDisabled();
      expect(screen.getByTestId('option-B')).toBeDisabled();

      // Attempting to click option B
      fireEvent.click(screen.getByTestId('option-B'));

      // The store state must retain option A
      const currentAnswers = useQuizStore.getState().answers;
      const q1 = useQuizStore.getState().dailyQuiz!.questions[0]!;
      expect(currentAnswers[q1.id]).toBe('A');
    });
  });

  describe('2. Explanation Card Rendering', () => {
    it('does not render explanation before an option is selected', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      expect(screen.queryByText('விளக்கம் (Explanation)')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Explanation')).not.toBeInTheDocument();
    });

    it('renders explanation card with lightbulb icon and detailed text immediately upon answer', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByTestId('option-A')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('option-A'));

      const explanationRegion = screen.getByLabelText('Explanation');
      expect(explanationRegion).toBeInTheDocument();
      expect(screen.getByText('விளக்கம் (Explanation)')).toBeInTheDocument();

      // Check lightbulb icon
      const icon = explanationRegion.querySelector('.material-symbols-outlined');
      expect(icon?.textContent).toBe('lightbulb');

      // Check detailed Tamil explanation text
      const q1 = useQuizStore.getState().dailyQuiz!.questions[0]!;
      expect(screen.getByText(q1.explanation)).toBeInTheDocument();
    });

    it('renders ExplanationCard standalone component properly and gracefully handles empty string', () => {
      const { rerender } = render(<ExplanationCard explanation="விளக்க உரை சோதனை" />);
      expect(screen.getByText('விளக்க உரை சோதனை')).toBeInTheDocument();
      expect(screen.getByText('விளக்கம் (Explanation)')).toBeInTheDocument();

      rerender(<ExplanationCard explanation="" />);
      expect(screen.queryByLabelText('Explanation')).not.toBeInTheDocument();
    });
  });

  describe('3. Next / Previous Navigation Bounds', () => {
    it('disables Previous button on Question 1 (index 0)', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      const prevBtn = screen.getByRole('button', { name: /முந்தைய/i });
      expect(prevBtn).toBeDisabled();
      expect(prevBtn.className).toContain('disabled:opacity-40');
    });

    it('enables Previous button when navigating to Question 2 and allows stepping back to Question 1', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      const nextBtn = screen.getByRole('button', { name: /அடுத்து/i });
      fireEvent.click(nextBtn);

      expect(screen.getByText(/வினா 2 \/ 10/)).toBeInTheDocument();

      const prevBtn = screen.getByRole('button', { name: /முந்தைய/i });
      expect(prevBtn).not.toBeDisabled();

      // Click Previous
      fireEvent.click(prevBtn);
      expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /முந்தைய/i })).toBeDisabled();
    });

    it('replaces Next button with Finish/Submit button ("சமர்ப்பிக்கவும்") on Question 10', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      // Jump to Question 10 (index 9)
      act(() => {
        useQuizStore.getState().goToQuestion(9);
      });

      expect(screen.getByText(/வினா 10 \/ 10/)).toBeInTheDocument();

      // Next button should NOT exist on Q10
      expect(screen.queryByRole('button', { name: /அடுத்து/i })).not.toBeInTheDocument();

      // Finish / Submit button should be present
      const submitBtn = screen.getByRole('button', { name: /சமர்ப்பிக்கவும்/i });
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();

      // Stepping back to Q9 brings back Next button
      const prevBtn = screen.getByRole('button', { name: /முந்தைய/i });
      fireEvent.click(prevBtn);

      expect(screen.getByText(/வினா 9 \/ 10/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /அடுத்து/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /சமர்ப்பிக்கவும்/i })).not.toBeInTheDocument();
    });

    it('verifies progress bar reflects question index accurately (10% on Q1, 100% on Q10)', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '10');

      act(() => {
        useQuizStore.getState().goToQuestion(9);
      });

      expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    });
  });

  describe('4. Score Calculation & Quiz Summary Modal', () => {
    it('calculates score accurately and shows confetti celebration upon quiz completion', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      const questions = useQuizStore.getState().dailyQuiz!.questions;

      // Answer 10 questions: 8 correctly, 2 incorrectly
      for (let i = 0; i < 10; i++) {
        act(() => {
          useQuizStore.getState().goToQuestion(i);
        });
        const currentQ = questions[i]!;
        const selectedOpt = i < 8 ? currentQ.answer : (currentQ.answer === 'A' ? 'B' : 'A');
        act(() => {
          useQuizStore.getState().selectOption(currentQ.id, selectedOpt as OptionId);
        });
      }

      // Finish Quiz on Q10
      const submitBtn = screen.getByRole('button', { name: /சமர்ப்பிக்கவும்/i });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // Verify Summary Modal renders
      await waitFor(() => {
        expect(screen.getByText('தேர்வு முடிவுகள்')).toBeInTheDocument();
      });

      // Assert Score is 8 / 10
      expect(screen.getByText('8 / 10')).toBeInTheDocument();
      // Assert Accuracy is 80%
      expect(screen.getByText('80%')).toBeInTheDocument();
      // Assert Trophy icon
      expect(screen.getByText('emoji_events')).toBeInTheDocument();
      // Assert Confetti was triggered
      expect(mockConfetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 100,
          spread: 70,
        })
      );
    });

    it('navigates back to home and cleans up store when clicking "முகப்புக்குச் செல்" on summary modal', async () => {
      const handleClose = vi.fn();
      render(<QuizPage onClose={handleClose} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      // Jump to Q10 and submit
      act(() => {
        useQuizStore.getState().goToQuestion(9);
      });

      const submitBtn = screen.getByRole('button', { name: /சமர்ப்பிக்கவும்/i });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(screen.getByText('தேர்வு முடிவுகள்')).toBeInTheDocument();
      });

      const homeBtn = screen.getByRole('button', { name: /முகப்புக்குச் செல்/i });
      act(() => {
        fireEvent.click(homeBtn);
      });

      expect(handleClose).toHaveBeenCalledTimes(1);

      // Verify store was reset
      const state = useQuizStore.getState();
      expect(state.isQuizActive).toBe(false);
      expect(state.currentQuestionIndex).toBe(0);
      expect(Object.keys(state.answers).length).toBe(0);
      expect(state.isSubmitted).toBe(false);
    });

    it('handles perfect score 100% and zero score 0% feedback properly', () => {
      const handleGoHome = vi.fn();

      // Zero score
      const { rerender } = render(
        <QuizSummaryModal
          isOpen={true}
          score={0}
          total={10}
          submissionResult={{
            score: 0,
            total: 10,
            accuracy_percentage: 0,
            streak: { current: 1, best: 21, last_date: '2024-11-15', is_completed_today: true },
            results: [],
          }}
          onGoHome={handleGoHome}
        />
      );

      expect(screen.getByText('0 / 10')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText(/தொடர்ந்து பயிற்சி செய்யுங்கள்/)).toBeInTheDocument();

      // Perfect score 10 / 10
      rerender(
        <QuizSummaryModal
          isOpen={true}
          score={10}
          total={10}
          submissionResult={{
            score: 10,
            total: 10,
            accuracy_percentage: 100,
            streak: { current: 8, best: 21, last_date: '2024-11-15', is_completed_today: true },
            results: [],
          }}
          onGoHome={handleGoHome}
        />
      );

      expect(screen.getByText('10 / 10')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText(/அற்புதம்! உங்கள் தேர்வு தயாரிப்பு மிகச்சிறப்பாக உள்ளது/)).toBeInTheDocument();
    });
  });

  describe('5. Close Button Confirmation Dialog', () => {
    it('prevents accidental exit: clicking cancel stays in quiz with progress preserved', async () => {
      const handleClose = vi.fn();
      render(<QuizPage onClose={handleClose} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      // Answer Q1
      fireEvent.click(screen.getByTestId('option-A'));

      // Click Close (X) button
      const closeBtn = screen.getByLabelText('Close quiz');
      fireEvent.click(closeBtn);

      // Confirmation modal appears
      expect(screen.getByText('தேர்விலிருந்து வெளியேற வேண்டுமா?')).toBeInTheDocument();
      expect(screen.getByText('இப்போது வெளியேறினால் உங்கள் விடைகள் சேமிக்கப்படாது.')).toBeInTheDocument();

      // Click Cancel
      const cancelBtn = screen.getByRole('button', { name: 'ரத்து' });
      fireEvent.click(cancelBtn);

      // Modal disappears
      expect(screen.queryByText('தேர்விலிருந்து வெளியேற வேண்டுமா?')).not.toBeInTheDocument();

      // Quiz is still on Q1, not closed, option A still selected
      expect(handleClose).not.toHaveBeenCalled();
      expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      expect(screen.getByTestId('option-A')).toBeDisabled();
    });

    it('exits quiz when user confirms exit in confirmation modal', async () => {
      const handleClose = vi.fn();
      render(<QuizPage onClose={handleClose} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      const closeBtn = screen.getByLabelText('Close quiz');
      fireEvent.click(closeBtn);

      const exitConfirmBtn = screen.getByRole('button', { name: 'வெளியேறு' });
      fireEvent.click(exitConfirmBtn);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('formats timeRemaining MM:SS accurately in QuizHeader', () => {
      const { rerender } = render(
        <QuizHeader
          currentQuestion={1}
          totalQuestions={10}
          timeRemaining={525} // 8 mins 45 secs
          onExit={vi.fn()}
        />
      );

      expect(screen.getByText(/08:45 மீதம்/)).toBeInTheDocument();

      rerender(
        <QuizHeader
          currentQuestion={1}
          totalQuestions={10}
          timeRemaining={65} // 1 min 05 secs
          onExit={vi.fn()}
        />
      );

      expect(screen.getByText(/01:05 மீதம்/)).toBeInTheDocument();

      rerender(
        <QuizHeader
          currentQuestion={1}
          totalQuestions={10}
          timeRemaining={9} // 0 mins 09 secs
          onExit={vi.fn()}
        />
      );

      expect(screen.getByText(/00:09 மீதம்/)).toBeInTheDocument();
    });
  });

  describe('6. Timer Auto-Submission Stress Test', () => {
    it('automatically finishes quiz when timer drops to 0 seconds', async () => {
      render(<QuizPage onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      // Set timeRemaining to 1 second
      act(() => {
        useQuizStore.getState().setTimeRemaining(1);
      });

      // Wait for timer tick to trigger auto submit
      await waitFor(
        () => {
          expect(useQuizStore.getState().isSubmitted).toBe(true);
        },
        { timeout: 2500 }
      );

      expect(screen.getByText('தேர்வு முடிவுகள்')).toBeInTheDocument();
    });
  });

  describe('7. End-to-End App Shell Flow: Home -> Launch Quiz -> Complete -> Return Home', () => {
    it('seamlessly transitions from Home dashboard to Daily Quiz and back to Home', async () => {
      render(<App />);

      // Starts at Home page
      expect(screen.getByText('TNPSC Group 4 & VAO 2024')).toBeInTheDocument();
      expect(screen.getByText('நாள் #142 - சிறப்பு மாதிரித் தேர்வு')).toBeInTheDocument();

      // Launch Daily Quiz
      const startQuizBtn = screen.getByRole('button', { name: /தேர்வைத் தொடங்குக/i });
      fireEvent.click(startQuizBtn);

      // Quiz page mounts
      await waitFor(() => {
        expect(screen.getByText(/வினா 1 \/ 10/)).toBeInTheDocument();
      });

      // Select an option
      fireEvent.click(screen.getByTestId('option-A'));
      expect(screen.getByText('விளக்கம் (Explanation)')).toBeInTheDocument();

      // Close via header confirmation
      const closeBtn = screen.getByLabelText('Close quiz');
      fireEvent.click(closeBtn);
      fireEvent.click(screen.getByRole('button', { name: 'வெளியேறு' }));

      // Returned back to Home page
      await waitFor(() => {
        expect(screen.getByText('TNPSC Group 4 & VAO 2024')).toBeInTheDocument();
      });
      expect(screen.queryByText(/வினா 1 \/ 10/)).not.toBeInTheDocument();
    });

    it('DailyQuizLauncher renders completed button state when quiz is completed', () => {
      const handleStart = vi.fn();
      render(
        <DailyQuizLauncher
          dayNumber={142}
          questionCount={10}
          durationMinutes={10}
          isCompleted={true}
          onStartQuiz={handleStart}
        />
      );

      expect(screen.getByText('முடிவுகளைக் காண்க')).toBeInTheDocument();
    });
  });

  describe('8. Audio TTS SpeechSynthesis Graceful Handling', () => {
    it('handles missing SpeechSynthesis gracefully without crashing', () => {
      const originalSpeech = window.speechSynthesis;
      // Temporarily remove speechSynthesis
      delete (window as unknown as { speechSynthesis?: SpeechSynthesis }).speechSynthesis;

      const sampleQ = mockQuestions[0]!;
      expect(() => {
        render(<QuestionCard question={sampleQ} />);
        const ttsBtn = screen.getByLabelText('கேள்வியைக் கேட்கவும்');
        fireEvent.click(ttsBtn);
      }).not.toThrow();

      // Restore
      window.speechSynthesis = originalSpeech;
    });

    it('handles speechSynthesis.speak throwing an error gracefully', () => {
      const handleToast = vi.fn();
      window.speechSynthesis = {
        speak: vi.fn().mockImplementation(() => {
          throw new Error('Audio engine unavailable');
        }),
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

      const sampleQ = mockQuestions[0]!;
      render(<QuestionCard question={sampleQ} onAudioError={handleToast} />);

      const ttsBtn = screen.getByLabelText('கேள்வியைக் கேட்கவும்');
      fireEvent.click(ttsBtn);

      expect(handleToast).toHaveBeenCalledWith('ஒலி எழுப்ப முடியவில்லை');
    });
  });
});
