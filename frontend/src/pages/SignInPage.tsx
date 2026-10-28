import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface SignInPageProps {
  onSuccess?: () => void;
  onNavigateToSignUp?: () => void;
  onShowToast?: (message: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onShowToast,
}) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState<string>('98421 73650');
  const [email, setEmail] = useState<string>('aspirant@tnpsc.gov.in');
  const [password, setPassword] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const identifier = authMethod === 'phone' ? phone.replace(/\s+/g, '') : email;
      await login(identifier, password);
      onShowToast?.('வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்! நல்வரவு 🔥');
      onSuccess?.();
    } catch {
      onShowToast?.('உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await login('google-user@gmail.com', 'google-auth');
      onShowToast?.('Google கணக்கு மூலம் உள்நுழைந்துள்ளீர்கள்! ✨');
      onSuccess?.();
    } catch {
      onShowToast?.('Google உள்நுழைவு தோல்வியடைந்தது.');
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
            aria-label="Back"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            onClick={onNavigateToSignUp}
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex-1 text-center font-headline-sm text-on-surface font-semibold truncate px-space-sm">
            உள்நுழைவு (Sign In)
          </div>
          <div className="w-10 h-10 flex items-center justify-end">
            <span className="material-symbols-outlined text-secondary text-[24px]">menu_book</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col relative w-full px-space-md pt-20 pb-safe bg-surface flex-1 max-w-md mx-auto">
        <div className="flex flex-col w-full pb-space-lg">
          {/* Ambient Glass Glow Accents */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-24 -right-12 w-48 h-48 bg-tertiary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Brand Emblem & Identity Header */}
            <div className="relative z-10 flex flex-col items-center text-center pt-space-xs pb-space-md">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-surface-bright/40 to-surface-container-high/60 shadow-lg backdrop-blur-xl mb-space-sm">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-secondary-container/20 to-transparent" />
                <span
                  className="material-symbols-outlined text-secondary text-[36px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-tertiary" />
                </span>
              </div>

              <div className="flex items-center gap-space-xs mb-space-xs">
                <h1 className="font-headline font-bold text-headline-lg text-on-surface tracking-tight">
                  TNPSC தோழன்
                </h1>
                <span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-body-sm">
                  v2.4
                </span>
              </div>

              <p className="font-label-md text-label-md text-secondary font-medium tracking-wide">
                வெற்றி நிச்சயம், வேத மந்திரம் விடாமுயற்சி!
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 max-w-[280px]">
                Group 4 • VAO • Group 2/2A • Group 1 தேர்வு வழிகாட்டி
              </p>
            </div>

            {/* Motivational Greeting Pill */}
            <div className="relative z-10 flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low/70 backdrop-blur-md mb-space-md border border-white/5">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-tertiary text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-headline-sm text-headline-sm text-on-surface truncate">
                    மீண்டும் வருக!
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    தினசரி பயிற்சி தொடர்ச்சியை தொடருங்கள்
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1 bg-surface-container-high px-space-xs py-1 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[16px]">bolt</span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">14 நாள்</span>
              </div>
            </div>

            {/* Glassmorphic Auth Card */}
            <div className="relative z-10 p-space-md rounded-2xl bg-surface-container/60 backdrop-blur-2xl shadow-xl border border-white/10">
              {/* Segmented Method Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-lg bg-surface-container-lowest/80 mb-space-md">
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg font-label-md text-label-md transition-all ${
                    authMethod === 'phone'
                      ? 'bg-surface-bright text-on-surface shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                  <span>அலைபேசி எண்</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg font-label-md text-label-md transition-all ${
                    authMethod === 'email'
                      ? 'bg-surface-bright text-on-surface shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span>மின்னஞ்சல்</span>
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-space-md">
                {authMethod === 'phone' ? (
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
                      பதிவுசெய்த அலைபேசி எண்
                    </label>
                    <div className="flex items-center rounded-xl bg-surface-container-lowest/90 px-space-sm py-1 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-all">
                      <div className="flex items-center gap-1 pr-space-sm py-2">
                        <span className="text-[14px]">🇮🇳</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          +91
                        </span>
                      </div>
                      <div className="h-5 w-[1px] bg-surface-container-highest mr-space-sm" />
                      <input
                        id="phone-input"
                        type="tel"
                        maxLength={12}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full bg-transparent text-on-surface font-headline-sm text-headline-sm tracking-wider focus:outline-none placeholder:text-outline-variant"
                      />
                      <span
                        className="material-symbols-outlined text-tertiary text-[20px] ml-space-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
                      பதிவுசெய்த மின்னஞ்சல் முகவரி
                    </label>
                    <div className="flex items-center rounded-xl bg-surface-container-lowest/90 px-space-sm py-1 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-all">
                      <span className="material-symbols-outlined text-outline text-[20px] mr-space-sm">
                        mail
                      </span>
                      <input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full bg-transparent text-on-surface font-headline-sm text-headline-sm py-2 focus:outline-none placeholder:text-outline-variant"
                      />
                    </div>
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password-input"
                      className="block font-label-sm text-label-sm text-on-surface-variant"
                    >
                      கடவுச்சொல் (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => onShowToast?.('கடவுச்சொல் மீட்பு இணைப்பு அனுப்பப்பட்டது')}
                      className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-0.5"
                    >
                      கடவுச்சொல் மறந்துவிட்டதா?
                    </button>
                  </div>
                  <div className="flex items-center rounded-xl bg-surface-container-lowest/90 px-space-sm py-1 shadow-inner focus-within:bg-surface-container-high border border-white/5 transition-all">
                    <span className="material-symbols-outlined text-outline text-[20px] mr-space-sm">
                      lock
                    </span>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-on-surface font-headline-sm text-headline-sm tracking-wider focus:outline-none placeholder:text-outline-variant py-2"
                    />
                    <button
                      type="button"
                      aria-label="கடவுச்சொல்லைக் காட்டு"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center justify-center text-outline hover:text-on-surface ml-space-xs transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Help */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-surface-container-highest accent-secondary-container border-0 cursor-pointer"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      என்னை நினைவில் கொள்
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onShowToast?.('உதவி மையம்: support@tnpscthozhan.in')}
                    className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-0.5"
                  >
                    <span>உதவி தேவையா?</span>
                    <span className="material-symbols-outlined text-[16px]">help</span>
                  </button>
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-space-md rounded-xl bg-secondary-container text-on-secondary font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-secondary-container/25 active:scale-[0.98] hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>உள்நுழைக (Sign In)</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>

              {/* Social Divider */}
              <div className="relative my-space-md flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-[1px] bg-surface-container-highest" />
                </div>
                <span className="relative px-space-sm bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  அல்லது
                </span>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 px-space-md rounded-xl bg-surface-container-high/80 hover:bg-surface-bright text-on-surface font-label-md text-label-md flex items-center justify-center gap-3 backdrop-blur-sm shadow-sm transition-colors border border-white/5 active:scale-[0.98]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google மூலம் உள்நுழைக</span>
              </button>
            </div>

            {/* Registration Prompt Link */}
            <div className="mt-space-md text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                புதிய பயனர் கணக்கா?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="text-tertiary font-semibold hover:underline ml-1"
                >
                  புதிய பதிவு செய்க (Sign Up)
                </button>
              </p>
            </div>

            {/* Syllabus Category Micro-Badges */}
            <div className="mt-space-lg p-space-sm rounded-xl bg-surface-container-lowest/60 backdrop-blur-md border border-white/5">
              <div className="flex items-center justify-between mb-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <span>தேர்வு தயாரிப்பு களங்கள்:</span>
                <span className="text-secondary font-medium">2025 பாடத்திட்டம்</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded-md bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  பொதுத்தமிழ் & GS
                </span>
                <span className="px-2 py-1 rounded-md bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Unit VIII & IX
                </span>
                <span className="px-2 py-1 rounded-md bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  நடப்பு நிகழ்வுகள்
                </span>
              </div>
            </div>

            {/* Trust Seal */}
            <div className="mt-space-md flex items-center justify-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                verified_user
              </span>
              <span>100% பாதுகாப்பானது • TNPSC வழிகாட்டு நெறிமுறைகள்</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
