<!DOCTYPE html>
<html class="dark" lang="ta">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta content="web_dashboard" name="shell-type"/>
    <title>@yield('title', 'நிர்வாக முகப்பு') - TNPSC தோழன்</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>

    <style>
        @layer base {
            html, body { margin: 0; padding: 0; font-family: 'Be Vietnam Pro', 'Noto Sans Tamil', sans-serif; }
            body { overscroll-behavior: none; }
            main > :first-child { margin-top: 0 !important; }
            main > :last-child { margin-bottom: 0 !important; }
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
                        "primary-fixed-dim": "#bec6e0",
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
                        "tertiary-fixed-dim": "#4edea3",
                        "error": "#ffb4ab",
                        "error-container": "#93000a",
                        "on-error": "#690005",
                        "on-error-container": "#ffdad6",
                        "outline": "#909097",
                        "outline-variant": "#45464d",
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "full": "9999px"
                    },
                    spacing: {
                        "space-xs": "0.25rem",
                        "space-sm": "0.5rem",
                        "space-md": "1rem",
                        "space-lg": "1.5rem",
                        "space-xl": "2rem",
                        "gutter": "1rem",
                    },
                    fontFamily: {
                        "headline": ["Plus Jakarta Sans", "Noto Sans Tamil", "sans-serif"],
                        "body": ["Be Vietnam Pro", "Noto Sans Tamil", "sans-serif"],
                    }
                }
            }
        };
    </script>
    @stack('styles')
</head>
<body class="bg-background font-body text-body-md text-on-surface antialiased">

    <!-- Sticky Header -->
    <header class="fixed top-0 left-0 right-0 h-16 z-50 bg-surface-container-low/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.35)] border-b border-white/5">
        <div class="w-full px-gutter h-16 flex items-center justify-between gap-space-md">
            <div class="flex items-center gap-space-md">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-space-sm hover:opacity-90 transition-opacity">
                    <div class="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary shadow-inner">
                        <span class="material-symbols-outlined text-[22px]">account_balance</span>
                    </div>
                    <div>
                        <span class="font-headline font-bold text-headline-sm text-on-surface tracking-tight block">TNPSC தோழன்</span>
                        <span class="text-[11px] text-tertiary font-medium block">நிர்வாக தளம் (Admin Command)</span>
                    </div>
                </a>
                <div class="hidden sm:flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container-highest/60 text-tertiary text-[11px]">
                    <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    <span>Live SQLite v2.4</span>
                </div>
            </div>

            <div class="flex items-center gap-space-md">
                <!-- Live Stats Counters -->
                <div class="hidden lg:flex items-center gap-space-md px-space-md py-1 rounded-xl bg-surface-container/70 border border-white/5">
                    <div class="flex items-center gap-space-xs">
                        <span class="text-[12px] text-on-surface-variant">மொத்த வினாக்கள்:</span>
                        <span class="font-headline font-bold text-tertiary text-sm">{{ \App\Models\Question::count() }}</span>
                    </div>
                    <div class="w-px h-4 bg-outline-variant/40"></div>
                    <div class="flex items-center gap-space-xs">
                        <span class="text-[12px] text-on-surface-variant">சரிபார்ப்பு நிலுவை:</span>
                        <span class="font-headline font-bold text-secondary-fixed-dim text-sm">{{ \App\Models\Question::where('review_status', 'pending')->count() }}</span>
                    </div>
                </div>

                <!-- Global Search Form -->
                <form action="{{ route('admin.questions.index') }}" method="GET" class="relative hidden md:flex items-center">
                    <div class="flex items-center gap-space-sm px-space-md py-1.5 rounded-xl bg-surface-container text-on-surface-variant w-64 shadow-inner border border-white/5 focus-within:border-tertiary/50">
                        <span class="material-symbols-outlined text-[18px]">search</span>
                        <input type="text" name="search" placeholder="வினா எண் / சொல் தேடுக..." value="{{ request('search') }}" class="bg-transparent border-0 outline-none text-xs text-on-surface placeholder:text-outline w-full">
                        <kbd class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">Ctrl+K</kbd>
                    </div>
                </form>

                <!-- Notifications Pill -->
                <a href="{{ route('admin.dashboard') }}#recent-reports" class="relative p-2 rounded-xl bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="மாணவர் புகார்கள் & அறிவிப்புகள்">
                    <span class="material-symbols-outlined text-[20px]">notifications</span>
                    @php $pendingReportsCount = \App\Models\Report::where('status', 'pending')->count(); @endphp
                    @if($pendingReportsCount > 0)
                        <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping"></span>
                        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container"></span>
                    @endif
                </a>

                <!-- User Profile & Logout -->
                <div class="flex items-center gap-space-sm pl-space-xs border-l border-white/5">
                    <div class="text-right hidden xl:block">
                        <span class="block text-xs font-semibold text-on-surface">{{ Auth::user()->name ?? 'மதிப்பாய்வாளர்' }}</span>
                        <span class="block text-[10px] text-on-surface-variant">Admin #{{ Auth::user()->aspirant_id ?? '04' }}</span>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <span class="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <!-- Logout form -->
                    <form action="{{ route('admin.logout') }}" method="POST" class="inline">
                        @csrf
                        <button type="submit" class="p-1.5 rounded-lg text-outline hover:text-error hover:bg-surface-container-high transition-colors ml-1" title="வெளியேறு (Logout)">
                            <span class="material-symbols-outlined text-[18px]">logout</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </header>

    <!-- Sidebar Navigation -->
    <aside class="fixed left-0 top-16 bottom-0 w-64 z-40 bg-surface-container-lowest/90 backdrop-blur-xl flex flex-col justify-between p-space-md border-r border-white/5">
        <div class="flex flex-col gap-space-md">
            <div class="px-space-sm">
                <span class="text-[11px] text-outline uppercase tracking-wider block font-semibold">முதன்மை வழிகாட்டி</span>
            </div>
            <nav class="flex flex-col gap-space-xs">
                <!-- 1. Dashboard -->
                <a href="{{ route('admin.dashboard') }}" 
                   class="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl transition-all {{ request()->routeIs('admin.dashboard') ? 'bg-primary-container text-on-surface font-semibold shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface' }}">
                    <span class="material-symbols-outlined text-[20px] text-tertiary">analytics</span>
                    <span class="text-sm">முகப்பு &amp; கண்ணோட்டம்</span>
                </a>

                <!-- 2. Question Management -->
                <a href="{{ route('admin.questions.index') }}" 
                   class="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl transition-all {{ request()->routeIs('admin.questions.index') ? 'bg-primary-container text-on-surface font-semibold shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface' }}">
                    <span class="material-symbols-outlined text-[20px] text-primary">rule</span>
                    <span class="text-sm">வினாக்கள் மேலாண்மை</span>
                </a>

                <!-- 3. Add Question -->
                <a href="{{ route('admin.questions.create') }}" 
                   class="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl transition-all {{ request()->routeIs('admin.questions.create') ? 'bg-primary-container text-on-surface font-semibold shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface' }}">
                    <span class="material-symbols-outlined text-[20px] text-secondary">edit_square</span>
                    <span class="text-sm">வினா சேர்த்தல் / திருத்தம்</span>
                </a>

                <!-- 4. Bulk Import & Export -->
                <a href="{{ route('admin.bulk.index') }}" 
                   class="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl transition-all {{ request()->routeIs('admin.bulk.*') ? 'bg-primary-container text-on-surface font-semibold shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface' }}">
                    <span class="material-symbols-outlined text-[20px] text-primary-fixed">cloud_sync</span>
                    <span class="text-sm">மொத்த இறக்குமதி / ஏற்றுமதி</span>
                </a>
            </nav>
        </div>

        <!-- Syllabus Quick Widget -->
        <div class="p-space-sm rounded-xl bg-surface-container-low/70 border border-white/5 flex flex-col gap-space-xs">
            <div class="flex items-center justify-between text-on-surface-variant text-xs">
                <span>TNPSC பாடத்திட்டம்</span>
                <span class="text-tertiary font-semibold">Unit I - X</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div class="w-4/5 h-full bg-tertiary rounded-full"></div>
            </div>
            <span class="text-[11px] text-outline block">தேர்வு தொகுதி: Group 1, 2, 4 &amp; VAO</span>
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="pl-64">
        <main class="relative pt-16 min-h-screen bg-background w-full px-gutter py-space-lg">
            @yield('content')
        </main>
    </div>

    <!-- Toast Notification Overlay -->
    <div id="toast-notification" class="fixed bottom-6 right-6 transform translate-y-24 opacity-0 transition-all duration-300 z-50 flex items-center gap-space-sm bg-surface-container-high text-on-surface px-space-md py-3 rounded-xl shadow-2xl border border-white/10">
        <span id="toast-icon" class="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
        <span id="toast-msg" class="text-sm font-medium">செயல்பாடு வெற்றிகரமாக முடிந்தது!</span>
    </div>

    <script>
        function showAdminToast(message, isError = false) {
            const toast = document.getElementById('toast-notification');
            const toastMsg = document.getElementById('toast-msg');
            const toastIcon = document.getElementById('toast-icon');
            if (!toast || !toastMsg) return;

            toastMsg.innerText = message;
            if (isError) {
                toastIcon.innerText = 'error';
                toastIcon.className = 'material-symbols-outlined text-error text-[20px]';
            } else {
                toastIcon.innerText = 'check_circle';
                toastIcon.className = 'material-symbols-outlined text-tertiary text-[20px]';
            }

            toast.classList.remove('translate-y-24', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.add('translate-y-24', 'opacity-0');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 3500);
        }

        // Auto trigger session toasts
        @if(session('toast_success'))
            showAdminToast("{{ session('toast_success') }}", false);
        @elseif(session('toast_error'))
            showAdminToast("{{ session('toast_error') }}", true);
        @elseif($errors->any())
            showAdminToast("{{ $errors->first() }}", true);
        @endif
    </script>
    @stack('scripts')
</body>
</html>
