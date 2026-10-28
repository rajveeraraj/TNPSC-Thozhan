import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../components/common/Header';
import BottomNav, { NAV_TABS } from '../components/common/BottomNav';
import GlassCard from '../components/common/GlassCard';
import Toast from '../components/common/Toast';
import App from '../App';

describe('Header Component', () => {
  it('renders brand title and streak count correctly', () => {
    render(<Header title="TNPSC தோழன்" streakCount={14} />);
    expect(screen.getByText('TNPSC தோழன்')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('triggers onStreakClick when streak badge is clicked', () => {
    const handleStreak = vi.fn();
    render(<Header streakCount={21} onStreakClick={handleStreak} />);
    const streakBtn = screen.getByRole('button', { name: /Streak: 21 days/i });
    fireEvent.click(streakBtn);
    expect(handleStreak).toHaveBeenCalledTimes(1);
  });

  it('triggers onAvatarClick when avatar button is clicked', () => {
    const handleAvatar = vi.fn();
    render(<Header onAvatarClick={handleAvatar} />);
    const avatarBtn = screen.getByRole('button', { name: /Profile Avatar/i });
    fireEvent.click(avatarBtn);
    expect(handleAvatar).toHaveBeenCalledTimes(1);
  });
});

describe('BottomNav Component', () => {
  it('renders all 4 navigation tabs with correct labels', () => {
    render(<BottomNav activeTab="home" onTabChange={() => {}} />);
    NAV_TABS.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('applies active styling to the currently active tab', () => {
    render(<BottomNav activeTab="practice" onTabChange={() => {}} />);
    const activeBtn = screen.getByRole('button', { name: /பயிற்சி/i });
    expect(activeBtn).toHaveAttribute('aria-current', 'page');
    expect(activeBtn.className).toContain('text-secondary');
  });

  it('calls onTabChange when a tab is clicked', () => {
    const handleTabChange = vi.fn();
    render(<BottomNav activeTab="home" onTabChange={handleTabChange} />);
    const profileBtn = screen.getByRole('button', { name: /சுயவிவரம்/i });
    fireEvent.click(profileBtn);
    expect(handleTabChange).toHaveBeenCalledWith('profile');
  });
});

describe('GlassCard Component', () => {
  it('renders children with glassmorphic styles', () => {
    render(
      <GlassCard variant="high" glow="gold" data-testid="card">
        <span>Test Content</span>
      </GlassCard>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    const card = screen.getByTestId('card');
    expect(card.className).toContain('backdrop-blur-xl');
  });
});

describe('Toast Component', () => {
  it('renders message when visible and auto-dismisses after duration', () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    render(
      <Toast
        message="புக்மார்க் சேமிக்கப்பட்டது!"
        isVisible={true}
        onClose={handleClose}
        duration={1000}
      />
    );
    expect(screen.getByText('புக்மார்க் சேமிக்கப்பட்டது!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('does not render when isVisible is false', () => {
    render(<Toast message="Hidden toast" isVisible={false} />);
    expect(screen.queryByText('Hidden toast')).not.toBeInTheDocument();
  });
});

describe('App Shell Integration', () => {
  it('switches tabs seamlessly when bottom nav is clicked', () => {
    render(<App />);
    expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();

    // Click on Practice tab
    const practiceTab = screen.getByRole('button', { name: /பயிற்சி/i });
    fireEvent.click(practiceTab);
    expect(screen.getByText('பயிற்சி தளம் (Practice)')).toBeInTheDocument();

    // Click on Questions tab
    const questionsTab = screen.getByRole('button', { name: /வினாக்கள்/i });
    fireEvent.click(questionsTab);
    expect(screen.getByText('முந்தைய ஆண்டு வினாக்கள் (PYQs)')).toBeInTheDocument();

    // Click on Profile tab
    const profileTab = screen.getByRole('button', { name: /சுயவிவரம்/i });
    fireEvent.click(profileTab);
    expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
  });
});
