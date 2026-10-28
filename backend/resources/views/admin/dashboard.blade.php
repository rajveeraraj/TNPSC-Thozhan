@extends('admin.layouts.app')

@section('title', 'வினா வங்கி மேலோட்டம் (Dashboard Overview)')

@section('content')
<div class="flex flex-col w-full gap-space-lg">

    <!-- Top Command Center Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-lg shadow-xl border border-white/5">
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-tertiary/10 blur-3xl pointer-events-none"></div>

        <div class="relative flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
            <div class="flex flex-col gap-space-xs">
                <div class="flex items-center gap-space-xs flex-wrap">
                    <span class="px-space-sm py-0.5 rounded-full bg-tertiary-container text-tertiary text-xs font-semibold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                        நேரலை தரவுத்தளம் • SQLite Live Sync
                    </span>
                    <span class="text-xs text-outline">|</span>
                    <span class="text-xs text-on-surface-variant">கடைசி புதுப்பிப்பு: {{ now('Asia/Kolkata')->format('d M, h:i A') }} IST</span>
                </div>
                <div class="flex items-baseline gap-space-sm">
                    <h1 class="text-2xl font-bold font-headline text-on-surface tracking-tight">வினா வங்கி மேலோட்டம்</h1>
                    <span class="text-xs text-outline font-medium">Question Bank Command Center</span>
                </div>
                <p class="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
                    TNPSC தொகுதி 1, 2, 4 மற்றும் இதர அரசுப் பணிக்கான வினா தொகுப்பு, மதிப்பாய்வு நிலை மற்றும் பிழை புகார்களை உடனுக்குடன் நிர்வகிக்கும் நேரலை தளம்.
                </p>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex flex-wrap items-center gap-space-sm">
                <a href="{{ route('admin.questions.create') }}" 
                   class="group relative flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-headline font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md">
                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">add_circle</span>
                    <span>புதிய வினா சேர்</span>
                    <span class="text-[11px] opacity-80">(+Add Q)</span>
                </a>
                <a href="{{ route('admin.bulk.index') }}" 
                   class="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-high/80 backdrop-blur-md text-on-surface text-xs font-semibold hover:bg-surface-bright active:scale-95 transition-all shadow-sm border border-white/5">
                    <span class="material-symbols-outlined text-[18px] text-tertiary">upload_file</span>
                    <span>மொத்த இறக்குமதி</span>
                </a>
                <a href="{{ route('admin.bulk.index') }}#export" 
                   class="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-high/80 backdrop-blur-md text-on-surface text-xs font-semibold hover:bg-surface-bright active:scale-95 transition-all shadow-sm border border-white/5">
                    <span class="material-symbols-outlined text-[18px] text-primary">download</span>
                    <span>அறிக்கை ஏற்றுமதி</span>
                </a>
            </div>
        </div>
    </div>

    <!-- 4 High Density Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <!-- 1. Total Question Pool -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container-low/70 backdrop-blur-xl p-space-md shadow-md flex flex-col justify-between group hover:bg-surface-container-low transition-all border border-white/5">
            <div class="flex items-start justify-between">
                <div class="flex flex-col">
                    <span class="text-[11px] text-outline uppercase tracking-wider font-semibold">மொத்தம் வினாக்கள்</span>
                    <span class="text-xs text-on-surface-variant">Total Question Pool</span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary shadow-inner">
                    <span class="material-symbols-outlined text-[22px]">inventory_2</span>
                </div>
            </div>
            <div class="mt-space-md flex items-baseline justify-between">
                <span class="text-3xl font-bold font-headline text-on-surface tracking-tight">{{ number_format($totalQuestions) }}</span>
                <span class="flex items-center gap-0.5 px-space-xs py-0.5 rounded-full bg-tertiary-container text-tertiary text-xs font-semibold">
                    <span class="material-symbols-outlined text-[14px]">trending_up</span>
                    நேரலை
                </span>
            </div>
            <div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant text-[11px]">
                <span>தரவுத்தள நிலை: செயலில்</span>
                <span class="text-tertiary font-bold">100% Sync</span>
            </div>
        </div>

        <!-- 2. Verified & Approved -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container-low/70 backdrop-blur-xl p-space-md shadow-md flex flex-col justify-between group hover:bg-surface-container-low transition-all border border-white/5">
            <div class="flex items-start justify-between">
                <div class="flex flex-col">
                    <span class="text-[11px] text-outline uppercase tracking-wider font-semibold">சரிபார்க்கப்பட்டவை</span>
                    <span class="text-xs text-on-surface-variant">Verified &amp; Approved</span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary shadow-inner">
                    <span class="material-symbols-outlined text-[22px]">verified</span>
                </div>
            </div>
            <div class="mt-space-md flex items-baseline justify-between">
                <span class="text-3xl font-bold font-headline text-on-surface tracking-tight">{{ number_format($verifiedQuestions) }}</span>
                <span class="px-space-xs py-0.5 rounded-full bg-tertiary-container text-tertiary-fixed text-xs font-bold font-headline">
                    {{ $verifiedPercent }}%
                </span>
            </div>
            <div class="mt-space-sm w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div class="h-full bg-tertiary rounded-full transition-all duration-500" style="width: {{ $verifiedPercent }}%"></div>
            </div>
        </div>

        <!-- 3. Pending Moderation -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container-low/70 backdrop-blur-xl p-space-md shadow-md flex flex-col justify-between group hover:bg-surface-container-low transition-all border border-white/5">
            <div class="flex items-start justify-between">
                <div class="flex flex-col">
                    <span class="text-[11px] text-outline uppercase tracking-wider font-semibold">நிலுவையில் உள்ளவை</span>
                    <span class="text-xs text-on-surface-variant">Pending Moderation</span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary-fixed-dim shadow-inner">
                    <span class="material-symbols-outlined text-[22px]">hourglass_top</span>
                </div>
            </div>
            <div class="mt-space-md flex items-baseline justify-between">
                <span class="text-3xl font-bold font-headline text-on-surface tracking-tight">{{ number_format($pendingQuestions) }}</span>
                <span class="px-space-xs py-0.5 rounded-full bg-secondary-container/20 text-secondary-fixed-dim text-xs font-bold font-headline flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim animate-pulse"></span>
                    {{ $pendingPercent }}%
                </span>
            </div>
            <div class="mt-space-sm w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div class="h-full bg-secondary-container rounded-full transition-all duration-500" style="width: {{ $pendingPercent }}%"></div>
            </div>
        </div>

        <!-- 4. Flagged by Aspirants -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container-low/70 backdrop-blur-xl p-space-md shadow-md flex flex-col justify-between group hover:bg-surface-container-low transition-all border border-white/5">
            <div class="flex items-start justify-between">
                <div class="flex flex-col">
                    <span class="text-[11px] text-outline uppercase tracking-wider font-semibold">பிழைக் கொடியிடப்பட்டவை</span>
                    <span class="text-xs text-on-surface-variant">Flagged / Reported</span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-error-container/40 flex items-center justify-center text-error shadow-inner">
                    <span class="material-symbols-outlined text-[22px]">report</span>
                </div>
            </div>
            <div class="mt-space-md flex items-baseline justify-between">
                <span class="text-3xl font-bold font-headline text-error tracking-tight">{{ number_format($flaggedQuestions) }}</span>
                <span class="px-space-xs py-0.5 rounded-full bg-error-container/60 text-on-error-container text-xs font-bold font-headline">
                    {{ $flaggedPercent }}%
                </span>
            </div>
            <div class="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant text-[11px]">
                <span class="text-error font-medium">{{ $flaggedQuestions > 0 ? 'மறுஆய்வு தேவை' : 'பிழைகள் இல்லை' }}</span>
                <a href="{{ route('admin.questions.index', ['status' => 'flagged']) }}" class="text-outline hover:text-on-surface underline">பார்வை</a>
            </div>
        </div>
    </div>

    <!-- Main Grid: Syllabus Topics & Reports vs Exam Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        
        <!-- Left Column: Topics Breakdown & Reports Table (8 Cols) -->
        <div class="lg:col-span-8 flex flex-col gap-space-lg">

            <!-- Syllabus Topic Breakdown Card -->
            <div class="rounded-2xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-white/5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <div>
                        <span class="text-xs text-tertiary uppercase tracking-wider font-semibold block">TNPSC பாடத்திட்டம் வாரியாக</span>
                        <h2 class="text-lg font-bold font-headline text-on-surface">தலைப்பு வாரியாக வினாக்கள் எண்ணிக்கை</h2>
                    </div>
                    <div class="flex items-center gap-space-xs px-space-sm py-1 rounded-lg bg-surface-container-high/60 text-on-surface-variant text-xs">
                        <span>மொத்தம் {{ count($topicsData) }} அலகுகள்</span>
                    </div>
                </div>

                <div class="flex flex-col gap-space-md mt-space-xs">
                    @forelse($topicsData as $topic)
                        <div class="flex flex-col gap-1.5 p-space-sm rounded-xl bg-surface-container/60 hover:bg-surface-container transition-all border border-white/5">
                            <div class="flex items-center justify-between text-xs">
                                <div class="flex items-center gap-space-sm">
                                    <span class="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                                    <span class="text-on-surface font-headline font-semibold text-sm">{{ $topic['topic'] }}</span>
                                </div>
                                <div class="flex items-center gap-space-sm">
                                    <span class="font-headline font-bold text-on-surface">{{ number_format($topic['count']) }}</span>
                                    <span class="text-tertiary font-semibold">{{ $topic['percentage'] }}%</span>
                                </div>
                            </div>
                            <div class="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                                <div class="h-full bg-tertiary rounded-full transition-all duration-500" style="width: {{ $topic['percentage'] }}%"></div>
                            </div>
                        </div>
                    @empty
                        <div class="p-space-lg text-center text-outline text-xs">
                            வினாக்கள் எதுவும் இல்லை. <a href="{{ route('admin.questions.create') }}" class="text-tertiary underline">முதல் வினாவைச் சேர்க்கவும்</a>.
                        </div>
                    @endforelse
                </div>
            </div>

            <!-- Aspirant Issue Reports Card -->
            <div id="recent-reports" class="rounded-2xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-white/5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <div>
                        <div class="flex items-center gap-space-xs">
                            <span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
                            <span class="text-xs text-error uppercase tracking-wider font-semibold block">உடனடி நடவடிக்கை தேவை</span>
                        </div>
                        <h2 class="text-lg font-bold font-headline text-on-surface">அண்மை வினா அறிக்கைகள் &amp; பயனாளர் புகார்கள்</h2>
                    </div>
                    <span class="text-xs text-on-surface-variant">Recent Aspirant Issue Reports</span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-surface-container-high/40 text-outline text-xs uppercase tracking-wider font-semibold">
                                <th class="py-2.5 px-space-sm rounded-l-lg">வினா எண் &amp; விவரம்</th>
                                <th class="py-2.5 px-space-sm">காரணம் / புகார்</th>
                                <th class="py-2.5 px-space-sm">அறிக்கையாளர்</th>
                                <th class="py-2.5 px-space-sm">நேரம்</th>
                                <th class="py-2.5 px-space-sm text-right rounded-r-lg">நடவடிக்கை</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-0 text-on-surface text-xs">
                            @forelse($recentReports as $report)
                                <tr class="hover:bg-surface-container/60 transition-colors">
                                    <td class="py-3 px-space-sm">
                                        <div class="flex flex-col">
                                            <a href="{{ route('admin.questions.edit', $report->question_id) }}" class="font-headline font-bold text-primary hover:underline">
                                                #TN-{{ $report->question_id }}
                                            </a>
                                            <span class="text-on-surface-variant line-clamp-1 max-w-xs">{{ $report->question->question_ta ?? 'வினா நீக்கப்பட்டுவிட்டது' }}</span>
                                        </div>
                                    </td>
                                    <td class="py-3 px-space-sm">
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container/40 text-error text-[11px]">
                                            <span class="material-symbols-outlined text-[13px]">cancel</span>
                                            {{ $report->reason }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-space-sm">
                                        <div class="flex items-center gap-1.5">
                                            <div class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] text-tertiary">
                                                {{ substr($report->user->name ?? 'A', 0, 1) }}
                                            </div>
                                            <span>{{ $report->user->name ?? 'மாணவர்' }}</span>
                                        </div>
                                    </td>
                                    <td class="py-3 px-space-sm text-on-surface-variant">
                                        {{ $report->created_at->diffForHumans() }}
                                    </td>
                                    <td class="py-3 px-space-sm text-right">
                                        <div class="inline-flex items-center gap-1">
                                            <a href="{{ route('admin.questions.edit', $report->question_id) }}" 
                                               class="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-[11px] font-semibold hover:brightness-110 active:scale-95 transition-all">
                                                மறுஆய்வு செய்
                                            </a>
                                            <form action="{{ route('admin.reports.resolve', $report->id) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" class="p-1 rounded-lg hover:bg-surface-container-high text-outline hover:text-on-surface transition-all" title="Dismiss">
                                                    <span class="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="py-6 text-center text-on-surface-variant text-xs">
                                        தற்போது புகார்கள் எதுவும் நிலுவையில் இல்லை! வினா வங்கி தரமாக பராமரிக்கப்படுகிறது.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Right Column: Exam Breakdown & Quick Info (4 Cols) -->
        <div class="lg:col-span-4 flex flex-col gap-space-lg">
            
            <!-- Exam Category Distribution Card -->
            <div class="rounded-2xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-white/5">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-xs text-secondary-fixed-dim uppercase tracking-wider font-semibold block">பிரிவு பகிர்வு</span>
                        <h2 class="text-lg font-bold font-headline text-on-surface">தேர்வு வாரியாக பகிர்வு</h2>
                    </div>
                    <span class="material-symbols-outlined text-secondary-fixed-dim text-[24px]">school</span>
                </div>
                <p class="text-xs text-on-surface-variant leading-relaxed">TNPSC பல்வேறு போட்டித் தேர்வுகளுக்கு ஒதுக்கப்பட்ட வினாக்களின் விகிதம்.</p>

                <div class="flex flex-col gap-space-sm">
                    @foreach($examGroups as $examName => $count)
                        @php $pct = $totalQuestions > 0 ? round(($count / $totalQuestions) * 100, 1) : 0; @endphp
                        <div class="p-space-sm rounded-xl bg-surface-container/70 flex items-center justify-between border border-white/5">
                            <div class="flex items-center gap-space-sm">
                                <div class="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary-container">
                                    <span class="material-symbols-outlined text-[18px]">badge</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="font-headline font-semibold text-xs text-on-surface">{{ $examName }}</span>
                                    <span class="text-[10px] text-outline">போட்டித் தேர்வு</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="font-headline font-bold text-sm text-secondary-fixed-dim block">{{ number_format($count) }}</span>
                                <span class="text-[10px] text-outline">{{ $pct }}%</span>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Reviewer Team Card -->
            <div class="relative overflow-hidden rounded-2xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-white/5">
                <div class="flex items-center justify-between">
                    <h3 class="font-headline font-bold text-sm text-on-surface">ஆய்வாளர் தகவல் (Active Admin)</h3>
                    <span class="text-xs text-tertiary font-semibold flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-tertiary"></span> Online
                    </span>
                </div>
                <div class="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container/60 border border-white/5">
                    <div class="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary font-bold">
                        {{ substr(Auth::user()->name ?? 'A', 0, 1) }}
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xs font-semibold text-on-surface">{{ Auth::user()->name ?? 'மதிப்பாய்வாளர்' }}</span>
                        <span class="text-[11px] text-on-surface-variant">{{ Auth::user()->phone ?? Auth::user()->email }}</span>
                        <span class="text-[10px] text-tertiary font-medium">பணி: முழு வினா வங்கி அணுகல் (Full Admin)</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
