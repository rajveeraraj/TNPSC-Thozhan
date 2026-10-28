import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../components/common/Header';
import BottomNav, { NAV_TABS, type NavTabId } from '../components/common/BottomNav';
import GlassCard from '../components/common/GlassCard';
import Toast from '../components/common/Toast';
import App from '../App';
import { THEME_COLORS, TYPOGRAPHY, GLASS_STYLES } from '../styles/tokens';

describe('Adversarial & Stress Tests — Theme Tokens & WCAG Contrast', () => {
  it('validates all theme color tokens are valid 7-character hex codes', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    Object.entries(THEME_COLORS).forEach(([key, hexValue]) => {
      expect(hexValue, `Token ${key} (${hexValue}) must be a valid 6-digit hex color`).toMatch(hexRegex);
    });
  });

  it('validates typography and glass style constants', () => {
    expect(TYPOGRAPHY.headlineFont).toContain('Plus Jakarta Sans');
    expect(TYPOGRAPHY.bodyFont).toContain('Be Vietnam Pro');
    expect(TYPOGRAPHY.tamilFont).toContain('Noto Sans Tamil');
    expect(GLASS_STYLES.cardBlur).toBe('16px');
    expect(GLASS_STYLES.cardBorder).toContain('rgba(255, 255, 255, 0.12)');
  });

  // Calculate relative luminance for WCAG contrast
  function getLuminance(hex: string): number {
    const rgb = [1, 3, 5].map((offset) => parseInt(hex.substring(offset, offset + 2), 16) / 255);
    const a = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    const r = a[0] ?? 0;
    const g = a[1] ?? 0;
    const b = a[2] ?? 0;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function getContrastRatio(hex1: string, hex2: string): number {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  it('verifies primary text on surface canvas exceeds WCAG AAA contrast ratio (>= 7:1)', () => {
    const contrast = getContrastRatio(THEME_COLORS.onSurface, THEME_COLORS.surface);
    // #d4e4fa on #051424
    expect(contrast).toBeGreaterThanOrEqual(7.0);
  });

  it('verifies secondary saffron text exceeds WCAG AA contrast ratio (>= 4.5:1) for readable labels', () => {
    const contrast = getContrastRatio(THEME_COLORS.secondary, THEME_COLORS.surface);
    // #ffb77d on #051424
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  it('verifies tertiary emerald text exceeds WCAG AA contrast ratio (>= 4.5:1) for streak/correct badges', () => {
    const contrast = getContrastRatio(THEME_COLORS.tertiary, THEME_COLORS.surface);
    // #4edea3 on #051424
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Adversarial & Stress Tests — Header Component', () => {
  it('handles extremely long title gracefully without crashing', () => {
    const longTitle = 'TNPSC ஒருங்கிணைந்த குடிமைப் பணிகள் தேர்வு - மாதிரி வினாவிடைத் தொகுப்பு மற்றும் வழிகாட்டி பயிலகம்'.repeat(2);
    render(<Header title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('handles empty string title', () => {
    const { container } = render(<Header title="" />);
    expect(container).toBeInTheDocument();
  });

  it('handles edge streak count values (0, negative, extremely large)', () => {
    const { rerender } = render(<Header streakCount={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();

    rerender(<Header streakCount={-5} />);
    expect(screen.getByText('-5')).toBeInTheDocument();

    rerender(<Header streakCount={99999} />);
    expect(screen.getByText('99999')).toBeInTheDocument();
  });

  it('safely handles click events when handler callbacks are undefined', () => {
    render(<Header onStreakClick={undefined} onAvatarClick={undefined} />);
    const streakBtn = screen.getByRole('button', { name: /Streak:/i });
    const avatarBtn = screen.getByRole('button', { name: /Profile Avatar/i });

    expect(() => fireEvent.click(streakBtn)).not.toThrow();
    expect(() => fireEvent.click(avatarBtn)).not.toThrow();
  });
});

describe('Adversarial & Stress Tests — BottomNav Component', () => {
  it('handles invalid/unknown activeTab gracefully without crashing', () => {
    render(<BottomNav activeTab={'unknown_tab' as NavTabId} onTabChange={() => {}} />);
    NAV_TABS.forEach((tab) => {
      const btn = screen.getByRole('button', { name: new RegExp(tab.label, 'i') });
      expect(btn).not.toHaveAttribute('aria-current');
      expect(btn.className).not.toContain('text-secondary bg-surface-container-highest');
    });
  });

  it('fires onTabChange for every tab button when clicked', () => {
    const handleTabChange = vi.fn();
    render(<BottomNav activeTab="home" onTabChange={handleTabChange} />);

    NAV_TABS.forEach((tab) => {
      const btn = screen.getByRole('button', { name: new RegExp(tab.label, 'i') });
      fireEvent.click(btn);
      expect(handleTabChange).toHaveBeenCalledWith(tab.id);
    });
    expect(handleTabChange).toHaveBeenCalledTimes(5);
  });
});

describe('Adversarial & Stress Tests — GlassCard Component', () => {
  it('renders all 4 surface variants correctly', () => {
    const variants = ['default', 'high', 'highest', 'low'] as const;
    variants.forEach((v) => {
      const { unmount } = render(
        <GlassCard variant={v} data-testid={`card-${v}`}>
          <span>Content {v}</span>
        </GlassCard>
      );
      const card = screen.getByTestId(`card-${v}`);
      expect(card).toBeInTheDocument();
      expect(card.className).toContain('backdrop-blur-xl');
      unmount();
    });
  });

  it('renders all ambient glow overlays', () => {
    const glows = ['none', 'gold', 'emerald', 'dual'] as const;
    glows.forEach((g) => {
      const { unmount, container } = render(
        <GlassCard glow={g}>
          <span>Glow {g}</span>
        </GlassCard>
      );
      if (g === 'none') {
        expect(container.querySelectorAll('.blur-2xl').length).toBe(0);
      } else if (g === 'gold' || g === 'emerald') {
        expect(container.querySelectorAll('.blur-2xl').length).toBe(1);
      } else if (g === 'dual') {
        expect(container.querySelectorAll('.blur-2xl').length).toBe(2);
      }
      unmount();
    });
  });

  it('applies interactive hover/active states and handles click events', () => {
    const handleClick = vi.fn();
    render(
      <GlassCard interactive onClick={handleClick} data-testid="interactive-card">
        Clickable Card
      </GlassCard>
    );
    const card = screen.getByTestId('interactive-card');
    expect(card.className).toContain('cursor-pointer');
    expect(card.className).toContain('hover:border-white/20');

    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Adversarial & Stress Tests — Toast Component', () => {
  it('handles empty message safely when isVisible is true', () => {
    render(<Toast message="" isVisible={true} />);
    const toast = screen.getByRole('status');
    expect(toast).toBeInTheDocument();
  });

  it('handles very long toast message without overflowing component structure', () => {
    const longMsg = 'வெற்றி நிச்சயம்! கடின உழைப்பு மற்றும் தினசரி மாதிரித் தேர்வு பயிற்சி உங்களை தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணைய தேர்வில் முதல் இடத்தில் நிலைநிறுத்தும்!';
    render(<Toast message={longMsg} isVisible={true} />);
    expect(screen.getByText(longMsg)).toBeInTheDocument();
  });

  it('handles rapid mount and unmount without timer memory leak', () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    const { rerender } = render(
      <Toast message="Quick dismiss" isVisible={true} onClose={handleClose} duration={2000} />
    );

    // Toggle off before timer finishes
    rerender(<Toast message="Quick dismiss" isVisible={false} onClose={handleClose} duration={2000} />);
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(handleClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('handles missing onClose callback safely when timer expires', () => {
    vi.useFakeTimers();
    render(<Toast message="No callback" isVisible={true} duration={1000} />);
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(1500);
      });
    }).not.toThrow();
    vi.useRealTimers();
  });
});

describe('Adversarial & Stress Tests — Full App Shell Integration', () => {
  it('handles fast tab switching back-and-forth across all tabs', () => {
    render(<App />);

    const tabs = [
      { name: /பயிற்சி/i, expected: 'பயிற்சி தளம் (Practice)' },
      { name: /வினாக்கள்/i, expected: 'முந்தைய ஆண்டு வினாக்கள் (PYQs)' },
      { name: /சுயவிவரம்/i, expected: 'அன்பழகன்' },
      { name: /முகப்பு/i, expected: 'இலக்கு தேர்வு (Target Exam)' },
    ];

    // Cycle through multiple times
    for (let i = 0; i < 3; i++) {
      for (const tab of tabs) {
        fireEvent.click(screen.getByRole('button', { name: tab.name }));
        expect(screen.getByText(tab.expected)).toBeInTheDocument();
      }
    }
  });

  it('interacts with Header streak button and triggers Toast notification', () => {
    vi.useFakeTimers();
    render(<App />);

    const streakBtn = screen.getByRole('button', { name: /Streak: \d+ days/i });
    fireEvent.click(streakBtn);

    expect(screen.getByText(/நாள் தொடர்ச்சி.*🔥/i)).toBeInTheDocument();

    // Fast-forward toast duration
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(screen.queryByText(/நாள் தொடர்ச்சி.*🔥/i)).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('interacts with Header avatar button and switches to profile tab with Toast', () => {
    render(<App />);

    const avatarBtn = screen.getByRole('button', { name: /Profile Avatar/i });
    fireEvent.click(avatarBtn);

    expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();
    expect(screen.getByText(/சுயவிவரப் பக்கத்திற்கு மாறுகிறது/i)).toBeInTheDocument();
  });

  it('triggers toast notifications from practice and questions cards', () => {
    render(<App />);

    // Go to Practice tab
    fireEvent.click(screen.getByRole('button', { name: /பயிற்சி/i }));
    fireEvent.click(screen.getByText('பொது தமிழ் - இலக்கணம்'));
    expect(screen.getByText('பொது தமிழ் பயிற்சி திறக்கப்படுகிறது')).toBeInTheDocument();

    // Go to Questions tab
    fireEvent.click(screen.getByRole('button', { name: /வினாக்கள்/i }));
    fireEvent.click(screen.getByText('TNPSC Group 4 - 2023'));
    expect(screen.getByText('Group 4 - 2023 தேர்வு திறக்கப்படுகிறது')).toBeInTheDocument();
  });
});
