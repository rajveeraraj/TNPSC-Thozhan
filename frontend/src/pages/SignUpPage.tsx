import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface SignUpPageProps {
  onSuccess?: () => void;
  onNavigateToSignIn?: () => void;
  onShowToast?: (message: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateToSignIn,
  onShowToast,
}) => {
  const [fullName, setFullName] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [targetExam, setTargetExam] = useState<string>('group4');
  const [medium, setMedium] = useState<'ta' | 'en'>('ta');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const signup = useAuthStore((s) => s.signup);
  const login = useAuthStore((s) => s.login);

  const examOptions = [
    { id: 'group4', label: 'Group 4 & VAO', icon: 'military_tech' },
    { id: 'group2', label: 'Group 2 & 2A', icon: 'account_balance' },
    { id: 'group1', label: 'Group 1', icon: 'shield' },
    { id: 'police', label: 'Police / SI', icon: 'local_police' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      onShowToast?.('தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும்');
      return;
    }

    const cleanPhone = mobileNo.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      onShowToast?.('சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்');
      return;
    }

    if (password.length < 6) {
      onShowToast?.('கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் கொண்டிருக்க வேண்டும்');
      return;
    }

    if (password !== confirmPassword) {
      onShowToast?.('கடவுச்சொற்கள் பொருந்தவில்லை, மீண்டும் சரிபார்க்கவும்');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedExamLabel =
        examOptions.find((o) => o.id === targetExam)?.label || 'TNPSC Group 4 & VAO';

      await signup({
        name: fullName.trim(),
        phone: cleanPhone,
        password,
        target_exam: selectedExamLabel,
        medium,
      });

      onShowToast?.('வரவேற்கிறோம் அன்பரே! உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.');
      onSuccess?.();
    } catch {
      onShowToast?.('பதிவு செய்தல் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    try {
      await login('google-new-user@gmail.com', 'google-auth');
      onShowToast?.('Google கணக்கு வெற்றிகரமாக இணைக்கப்பட்டது! 🎉');
      onSuccess?.();
    } catch {
      onShowToast?.('Google பதிவு தோல்வியடைந்தது.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface font-body select-none">
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe">
        <div className="h-16 px-space-md flex items-center justify-between max-w-md mx-auto">
          <button
            type="button"
            aria-label="Back to Sign In"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            onClick={onNavigateToSignIn}
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex-1 text-center font-headline-sm text-on-surface font-semibold truncate px-space-sm">
            புதிய பதிவு (Sign Up)
          </div>
          <div className="w-10 h-10 flex items-center justify-end">
            <span className="material-symbols-outlined text-secondary text-[24px]">menu_book</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col relative w-full px-space-md pt-20 pb-safe bg-surface flex-1 max-w-md mx-auto">
        <div className="flex flex-col w-full pb-8">
          {/* Hero Banner */}
          <div className="relative w-full rounded-2xl overflow-hidden mb-6 bg-surface-container-low shadow-lg border border-white/5">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-tr from-secondary-container via-transparent to-tertiary" />
            <div className="relative p-5 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md self-start shadow-sm">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-medium tracking-wide">
                  வெற்றிப்பயணம் இங்கே துவங்குகிறது
                </span>
              </div>
              <h1 className="font-headline font-bold text-headline-md text-on-surface tracking-tight">
                புதிய கணக்கை தொடங்குங்கள்
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                இலவச தினசரி மாதிரி தேர்வுகள் மற்றும் தமிழ் வினா-விடைகள்
              </p>
            </div>
          </div>

          {/* 14-Day Challenge Card */}
          <div className="flex items-center gap-3 p-3.5 mb-6 rounded-xl bg-tertiary-container/40 backdrop-blur-md shadow-sm border border-tertiary/20">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-tertiary text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-tertiary-fixed leading-tight">
              <strong className="font-semibold">14-நாள் தொடர் பயிற்சி சவால்:</strong> 15,000+
              முந்தைய ஆண்டின் அதிகாரப்பூர்வ வினாக்கள் இலவசம்!
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fullName"
                className="font-label-md text-label-md text-on-surface font-medium"
              >
                முழு பெயர் (Full Name)
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                  person
                </span>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="எ.கா. அன்பழகன் (e.g. Anbazhagan)"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-high/70 backdrop-blur-sm text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-highest transition-colors shadow-inner border border-white/5"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="mobileNo"
                className="font-label-md text-label-md text-on-surface font-medium"
              >
                கைபேசி எண் (Mobile Number)
              </label>
              <div className="flex items-center gap-2">
                <div className="h-12 px-3.5 rounded-xl bg-surface-container-high/70 backdrop-blur-sm flex items-center gap-1 shrink-0 text-on-surface-variant font-label-md text-label-md shadow-inner border border-white/5">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="font-semibold text-on-surface">+91</span>
                </div>
                <div className="relative flex-1 flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                    phone_android
                  </span>
                  <input
                    id="mobileNo"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-high/70 backdrop-blur-sm text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-highest transition-colors shadow-inner border border-white/5"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="font-label-md text-label-md text-on-surface font-medium"
                >
                  கடவுச்சொல்லை உருவாக்கவும் (Create Password)
                </label>
                <span className="font-body-sm text-body-sm text-outline">குறைந்தது 6 எழுத்துக்கள்</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-surface-container-high/70 backdrop-blur-sm text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-highest transition-colors shadow-inner border border-white/5"
                />
                <button
                  type="button"
                  aria-label="Toggle password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-outline hover:text-on-surface transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="font-label-md text-label-md text-on-surface font-medium"
              >
                கடவுச்சொல் உறுதிப்படுத்தல் (Confirm Password)
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                  lock_reset
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-high/70 backdrop-blur-sm text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-highest transition-colors shadow-inner border border-white/5"
                />
              </div>
            </div>

            {/* Target Exam Selection */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-medium">
                  இலக்கு தேர்வு (Target Exam)
                </span>
                <span className="font-body-sm text-body-sm text-outline">ஒன்றைத் தேர்ந்தெடுக்கவும்</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {examOptions.map((opt) => {
                  const isSelected = targetExam === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTargetExam(opt.id)}
                      className={`group relative flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                        isSelected
                          ? 'bg-secondary-container text-on-secondary-container shadow-md font-semibold'
                          : 'bg-surface-container-high/60 backdrop-blur-sm text-on-surface-variant hover:text-on-surface border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                        <span className="font-label-md text-label-md">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Medium of Study Toggle */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface font-medium">
                பயிற்சி மொழி (Medium of Study)
              </span>
              <div className="flex rounded-xl bg-surface-container-lowest p-1 shadow-inner border border-white/5">
                <button
                  type="button"
                  onClick={() => setMedium('ta')}
                  className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-medium transition-all ${
                    medium === 'ta'
                      ? 'bg-surface-container-high text-on-surface shadow-sm font-semibold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  தமிழ் வழி (Tamil)
                </button>
                <button
                  type="button"
                  onClick={() => setMedium('en')}
                  className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-medium transition-all ${
                    medium === 'en'
                      ? 'bg-surface-container-high text-on-surface shadow-sm font-semibold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  English Medium
                </button>
              </div>
            </div>

            {/* Submit & Secondary Options */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary font-headline-sm text-headline-sm font-semibold shadow-lg hover:shadow-secondary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>பதிவு செய்து தொடங்குக</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-surface-container-highest" />
                <span className="font-body-sm text-body-sm text-outline">அல்லது</span>
                <div className="flex-1 h-px bg-surface-container-highest" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full py-3 px-4 rounded-xl bg-surface-container-high/80 backdrop-blur-md text-on-surface hover:bg-surface-container-highest active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm font-label-md text-label-md border border-white/5"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-medium">Google மூலம் உடனே இணைக</span>
              </button>
            </div>
          </form>

          {/* Footer Navigation & Terms */}
          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            <p className="font-body-sm text-body-sm text-outline px-4 leading-normal">
              தொடர்வதன் மூலம் நீங்கள் எங்கள்{' '}
              <a href="#" className="text-primary hover:underline">
                விதிமுறைகள்
              </a>{' '}
              மற்றும்{' '}
              <a href="#" className="text-primary hover:underline">
                தனியுரிமைக் கொள்கையை
              </a>{' '}
              ஏற்றுக்கொள்கிறீர்கள்.
            </p>

            <div className="p-3 w-full rounded-xl bg-surface-container-low flex items-center justify-center gap-1.5 shadow-sm border border-white/5">
              <span className="font-body-md text-body-md text-on-surface-variant">
                ஏற்கனவே கணக்கு உள்ளதா?
              </span>
              <button
                type="button"
                onClick={onNavigateToSignIn}
                className="font-label-md text-label-md text-secondary font-semibold hover:underline cursor-pointer"
              >
                உள்நுழைக (Sign In)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
