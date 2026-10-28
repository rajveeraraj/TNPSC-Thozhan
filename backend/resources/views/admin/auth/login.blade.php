<!DOCTYPE html>
<html class="dark" lang="ta">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta content="mobile_stack" name="shell-type"/>
    <title>உள்நுழைவு (Admin Sign In) - TNPSC தோழன்</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>

    <style>
        @layer base {
            html, body { width: 100vw; margin: 0; padding: 0; font-family: 'Be Vietnam Pro', 'Noto Sans Tamil', sans-serif; }
            body { overscroll-behavior: none; min-height: 100vh; }
        }
        ::-webkit-scrollbar { display: none; }
    </style>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "surface": "#051424",
                        "surface-dim": "#051424",
                        "surface-bright": "#2c3a4c",
                        "surface-variant": "#273647",
                        "surface-container-lowest": "#010f1f",
                        "surface-container-low": "#0d1c2d",
                        "surface-container": "#122131",
                        "surface-container-high": "#1c2b3c",
                        "surface-container-highest": "#273647",
                        "on-surface": "#d4e4fa",
                        "on-surface-variant": "#c6c6cd",
                        "on-background": "#d4e4fa",
                        "background": "#051424",
                        "primary": "#bec6e0",
                        "on-primary": "#283044",
                        "primary-container": "#0f172a",
                        "on-primary-container": "#798098",
                        "primary-fixed": "#dae2fd",
                        "secondary": "#ffb77d",
                        "secondary-container": "#d97707",
                        "on-secondary": "#4d2600",
                        "on-secondary-container": "#432100",
                        "secondary-fixed": "#ffdcc3",
                        "secondary-fixed-dim": "#ffb77d",
                        "tertiary": "#4edea3",
                        "tertiary-container": "#001c10",
                        "on-tertiary": "#003824",
                        "on-tertiary-container": "#009365",
                        "tertiary-fixed": "#6ffbbe",
                        "error": "#ffb4ab",
                        "error-container": "#93000a",
                        "on-error": "#690005",
                        "outline": "#909097",
                    },
                    spacing: {
                        "space-xs": "0.25rem",
                        "space-sm": "0.5rem",
                        "space-md": "1rem",
                        "space-lg": "1.5rem",
                        "space-xl": "2rem",
                    }
                }
            }
        };
    </script>
</head>
<body class="bg-surface text-on-surface flex flex-col justify-center items-center min-h-screen px-space-md py-space-xl relative overflow-x-hidden">

    <!-- Ambient Glow Accents -->
    <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 -right-24 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Centered Card Shell -->
    <div class="w-full max-w-md relative z-10 flex flex-col gap-space-md">

        <!-- Brand Emblem & Identity Header -->
        <div class="flex flex-col items-center text-center">
            <div class="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-surface-bright/40 to-surface-container-high/60 shadow-xl backdrop-blur-xl mb-space-sm border border-white/10">
                <span class="material-symbols-outlined text-secondary text-[36px]" style="font-variation-settings: 'FILL' 1;">account_balance</span>
                <span class="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-4 w-4 bg-tertiary"></span>
                </span>
            </div>
            
            <div class="flex items-center gap-space-xs mb-1">
                <h1 class="text-2xl font-bold font-headline text-on-surface tracking-tight">TNPSC தோழன்</h1>
                <span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary text-xs font-semibold">Admin v2.4</span>
            </div>
            <p class="text-xs text-secondary font-medium tracking-wide">
                வெற்றி நிச்சயம், வேத மந்திரம் விடாமுயற்சி!
            </p>
            <p class="text-[11px] text-on-surface-variant mt-0.5">
                வினா வங்கி &amp; ஆய்வு கட்டுப்பாட்டு தளம் (Management Command)
            </p>
        </div>

        <!-- Greeting Pill -->
        <div class="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low/70 backdrop-blur-md border border-white/5 shadow-md">
            <div class="flex items-center gap-space-sm min-w-0">
                <div class="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-tertiary text-[20px]" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
                </div>
                <div class="min-w-0">
                    <div class="text-sm font-semibold text-on-surface truncate">நிர்வாக உள்நுழைவு</div>
                    <div class="text-[11px] text-on-surface-variant truncate">வினாக்கள் &amp; பாடத்திட்ட மேலாண்மை</div>
                </div>
            </div>
            <div class="shrink-0 flex items-center gap-1 bg-surface-container-high px-space-xs py-1 rounded-lg">
                <span class="material-symbols-outlined text-tertiary text-[16px]">verified_user</span>
                <span class="text-[11px] text-tertiary font-bold">Live DB</span>
            </div>
        </div>

        <!-- Glassmorphic Auth Form Card -->
        <div class="p-space-md sm:p-space-lg rounded-2xl bg-surface-container/70 backdrop-blur-2xl shadow-2xl border border-white/10">

            @if($errors->any())
                <div class="mb-space-md p-space-sm rounded-xl bg-error-container/30 border border-error/30 text-error flex items-start gap-2 text-xs">
                    <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                    <span>{{ $errors->first() }}</span>
                </div>
            @endif

            <!-- Segmented Method Tabs -->
            <div class="grid grid-cols-2 p-1 rounded-xl bg-surface-container-lowest/80 mb-space-md border border-white/5">
                <button type="button" id="tab-phone" onclick="switchLoginMethod('phone')" 
                        class="flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg bg-surface-bright text-on-surface text-xs font-semibold shadow-sm transition-all">
                    <span class="material-symbols-outlined text-[16px]">smartphone</span>
                    <span>அலைபேசி எண்</span>
                </button>
                <button type="button" id="tab-email" onclick="switchLoginMethod('email')" 
                        class="flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all">
                    <span class="material-symbols-outlined text-[16px]">mail</span>
                    <span>மின்னஞ்சல்</span>
                </button>
            </div>

            <!-- Login Form -->
            <form action="{{ route('admin.login') }}" method="POST" class="space-y-space-md">
                @csrf

                <!-- Phone / Email Input Block -->
                <div>
                    <label id="input-label" class="block text-xs font-medium text-on-surface-variant mb-1.5">
                        பதிவுசெய்த அலைபேசி எண்
                    </label>
                    <div class="flex items-center rounded-xl bg-surface-container-lowest/90 px-space-sm py-1 shadow-inner border border-white/5 focus-within:border-tertiary/60 transition-all">
                        <!-- Country Badge (Hidden when email is selected) -->
                        <div id="phone-badge" class="flex items-center gap-1 pr-space-sm py-1.5">
                            <span class="text-[14px]">🇮🇳</span>
                            <span class="text-xs font-bold text-on-surface">+91</span>
                            <div class="h-4 w-[1px] bg-surface-container-highest ml-2"></div>
                        </div>

                        <!-- Main Input -->
                        <input type="text" name="login" id="login-input" required 
                               value="{{ old('login', '8525897626') }}"
                               placeholder="98765 43210"
                               class="w-full bg-transparent text-on-surface text-sm font-semibold tracking-wider focus:outline-none placeholder:text-outline px-2 py-1.5">
                    </div>
                </div>

                <!-- Password Input Block -->
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-xs font-medium text-on-surface-variant" for="password-input">
                            கடவுச்சொல் (Password)
                        </label>
                    </div>
                    <div class="flex items-center rounded-xl bg-surface-container-lowest/90 px-space-sm py-1 shadow-inner border border-white/5 focus-within:border-tertiary/60 transition-all">
                        <span class="material-symbols-outlined text-outline text-[18px] mr-1">lock</span>
                        <input type="password" name="password" id="password-input" required placeholder="••••••••"
                               class="w-full bg-transparent text-on-surface text-sm font-semibold tracking-wider focus:outline-none placeholder:text-outline py-1.5 px-2">
                        <button type="button" aria-label="கடவுச்சொல்லைக் காட்டு" 
                                onclick="togglePasswordVisibility()" 
                                class="flex items-center justify-center text-outline hover:text-on-surface p-1 transition-colors">
                            <span id="pass-eye-icon" class="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                    </div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between pt-1">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" name="remember" value="1" checked class="w-4 h-4 rounded bg-surface-container-highest accent-secondary-container border-0 cursor-pointer">
                        <span class="text-xs text-on-surface-variant">என்னை நினைவில் கொள்</span>
                    </label>
                    <span class="text-xs text-secondary-fixed-dim">பாதுகாப்பான அமர்வு</span>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="w-full py-3.5 px-space-md rounded-xl bg-secondary-container text-on-secondary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-secondary-container/25 hover:brightness-110 active:scale-[0.98] transition-all">
                    <span>உள்நுழைக (Sign In to Dashboard)</span>
                    <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
            </form>

            <!-- Test Credentials Quick Helper Card -->
            <div class="mt-space-md p-space-sm rounded-xl bg-surface-container-lowest/70 border border-white/5 flex flex-col gap-1 text-[11px] text-on-surface-variant">
                <div class="flex items-center gap-1 text-tertiary font-semibold">
                    <span class="material-symbols-outlined text-[15px]">key</span>
                    <span>சோதனை நிர்வாக கணக்கு விவரங்கள்:</span>
                </div>
                <div class="flex items-center justify-between">
                    <span>அலைபேசி எண் (Phone): <strong class="text-on-surface font-mono">8525897626</strong> அல்லது <strong class="text-on-surface font-mono">9842173650</strong></span>
                    <button type="button" onclick="fillCredentials('8525897626', 'password123')" class="text-tertiary underline hover:opacity-80">தானாக நிரப்பு</button>
                </div>
                <div>மின்னஞ்சல்: <strong class="text-on-surface font-mono">admin@tnpsc.local</strong> • கடவுச்சொல்: <strong class="text-on-surface font-mono">password123</strong></div>
            </div>
        </div>

        <!-- Footer Trust Badge -->
        <div class="text-center text-xs text-on-surface-variant flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
            <span>100% பாதுகாப்பானது • TNPSC வினா வங்கி நேரலை தளம்</span>
        </div>
    </div>

    <script>
        function switchLoginMethod(method) {
            const tabPhone = document.getElementById('tab-phone');
            const tabEmail = document.getElementById('tab-email');
            const phoneBadge = document.getElementById('phone-badge');
            const inputLabel = document.getElementById('input-label');
            const loginInput = document.getElementById('login-input');

            if (method === 'phone') {
                tabPhone.className = 'flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg bg-surface-bright text-on-surface text-xs font-semibold shadow-sm transition-all';
                tabEmail.className = 'flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all';
                phoneBadge.style.display = 'flex';
                inputLabel.innerText = 'பதிவுசெய்த அலைபேசி எண்';
                loginInput.placeholder = '98765 43210';
                if (!loginInput.value || loginInput.value.includes('@')) {
                    loginInput.value = '8525897626';
                }
            } else {
                tabEmail.className = 'flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg bg-surface-bright text-on-surface text-xs font-semibold shadow-sm transition-all';
                tabPhone.className = 'flex items-center justify-center gap-1.5 py-2 px-space-sm rounded-lg text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all';
                phoneBadge.style.display = 'none';
                inputLabel.innerText = 'பதிவுசெய்த மின்னஞ்சல் முகவரி';
                loginInput.placeholder = 'admin@tnpsc.local';
                if (!loginInput.value || !loginInput.value.includes('@')) {
                    loginInput.value = 'admin@tnpsc.local';
                }
            }
        }

        function togglePasswordVisibility() {
            const inp = document.getElementById('password-input');
            const icon = document.getElementById('pass-eye-icon');
            if (inp.type === 'password') {
                inp.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                inp.type = 'password';
                icon.textContent = 'visibility';
            }
        }

        function fillCredentials(login, pass) {
            document.getElementById('login-input').value = login;
            document.getElementById('password-input').value = pass;
        }
    </script>
</body>
</html>
