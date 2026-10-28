import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import { useAuthStore } from '../store/authStore';

describe('Authentication Flow & Stitch Screen Integrity', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('renders SignInPage by default when unauthenticated', () => {
    render(<App initialAuthenticated={false} />);
    expect(screen.getByText('உள்நுழைவு (Sign In)')).toBeInTheDocument();
    expect(screen.getByText('வெற்றி நிச்சயம், வேத மந்திரம் விடாமுயற்சி!')).toBeInTheDocument();
    expect(screen.getByText('பதிவுசெய்த அலைபேசி எண்')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /உள்நுழைக \(Sign In\)/i })).toBeInTheDocument();
  });

  it('switches between phone and email tabs on SignInPage', () => {
    render(<SignInPage />);
    expect(screen.getByText('பதிவுசெய்த அலைபேசி எண்')).toBeInTheDocument();

    const emailTab = screen.getByRole('button', { name: /மின்னஞ்சல்/i });
    fireEvent.click(emailTab);
    expect(screen.getByText('பதிவுசெய்த மின்னஞ்சல் முகவரி')).toBeInTheDocument();

    const phoneTab = screen.getByRole('button', { name: /அலைபேசி எண்/i });
    fireEvent.click(phoneTab);
    expect(screen.getByText('பதிவுசெய்த அலைபேசி எண்')).toBeInTheDocument();
  });

  it('navigates to SignUpPage when "புதிய பதிவு செய்க" is clicked', () => {
    render(<App initialAuthenticated={false} />);
    const signUpBtn = screen.getByRole('button', { name: /புதிய பதிவு செய்க \(Sign Up\)/i });
    fireEvent.click(signUpBtn);

    expect(screen.getByText('புதிய பதிவு (Sign Up)')).toBeInTheDocument();
    expect(screen.getByText('புதிய கணக்கை தொடங்குங்கள்')).toBeInTheDocument();
    expect(screen.getByLabelText(/முழு பெயர் \(Full Name\)/i)).toBeInTheDocument();
  });

  it('navigates back to SignInPage from SignUpPage', () => {
    render(<App initialAuthenticated={false} />);
    // Go to sign up
    fireEvent.click(screen.getByRole('button', { name: /புதிய பதிவு செய்க \(Sign Up\)/i }));
    expect(screen.getByText('புதிய பதிவு (Sign Up)')).toBeInTheDocument();

    // Go back to sign in
    const signInBtn = screen.getByRole('button', { name: /உள்நுழைக \(Sign In\)/i });
    fireEvent.click(signInBtn);
    expect(screen.getByText('உள்நுழைவு (Sign In)')).toBeInTheDocument();
  });

  it('allows selecting exam pills and medium on SignUpPage', () => {
    render(<SignUpPage />);
    const group2Btn = screen.getByRole('button', { name: /Group 2 & 2A/i });
    fireEvent.click(group2Btn);
    expect(group2Btn.className).toContain('bg-secondary-container');

    const enMediumBtn = screen.getByRole('button', { name: /English Medium/i });
    fireEvent.click(enMediumBtn);
    expect(enMediumBtn.className).toContain('bg-surface-container-high');
  });

  it('logs in successfully and enters HomePage upon submitting SignInPage', async () => {
    render(<App initialAuthenticated={false} />);
    const submitBtn = screen.getByRole('button', { name: /உள்நுழைக \(Sign In\)/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
      expect(screen.getByText('TNPSC Group 4 & VAO 2024')).toBeInTheDocument();
    });
  });

  it('logs in via Google button and enters HomePage', async () => {
    render(<App initialAuthenticated={false} />);
    const googleBtn = screen.getByRole('button', { name: /Google மூலம் உள்நுழைக/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
    });
  });

  it('registers and enters HomePage upon submitting SignUpPage', async () => {
    render(<App initialAuthenticated={false} />);
    // Go to sign up
    fireEvent.click(screen.getByRole('button', { name: /புதிய பதிவு செய்க \(Sign Up\)/i }));

    // Fill form
    fireEvent.change(screen.getByLabelText(/முழு பெயர் \(Full Name\)/i), {
      target: { value: 'செல்வகுமார்' },
    });
    fireEvent.change(screen.getByLabelText(/கைபேசி எண் \(Mobile Number\)/i), {
      target: { value: '9840123456' },
    });
    fireEvent.change(screen.getByLabelText(/கடவுச்சொல்லை உருவாக்கவும்/i), {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/கடவுச்சொல் உறுதிப்படுத்தல்/i), {
      target: { value: 'secret123' },
    });

    const submitRegister = screen.getByRole('button', { name: /பதிவு செய்து தொடங்குக/i });
    fireEvent.click(submitRegister);

    await waitFor(() => {
      expect(screen.getByText('இலக்கு தேர்வு (Target Exam)')).toBeInTheDocument();
    });
  });

  it('logs out from ProfilePage and returns to SignInPage', async () => {
    render(<App initialAuthenticated={true} />);
    // Go to profile tab
    const profileTab = screen.getByRole('button', { name: /சுயவிவரம்/i });
    fireEvent.click(profileTab);
    expect(screen.getByText('அன்பழகன்')).toBeInTheDocument();

    // Click logout
    const logoutBtn = screen.getByRole('button', { name: /வெளியேறு கணக்கிலிருந்து வெளியேறுதல்/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByText('உள்நுழைவு (Sign In)')).toBeInTheDocument();
    });
  });
});
