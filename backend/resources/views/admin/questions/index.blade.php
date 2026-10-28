@extends('admin.layouts.app')

@section('title', 'வினாக்கள் மேலாண்மை (Question Management & Moderation)')

@section('content')
<div class="flex flex-col w-full gap-space-lg">

    <!-- Top Stat Highlights with Frosted Depth -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
        <!-- Total -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container/60 backdrop-blur-xl p-space-md shadow-md flex items-center justify-between border border-white/5">
            <div class="flex flex-col gap-space-xs">
                <span class="text-[11px] text-outline uppercase tracking-wider font-semibold">மொத்த வினாக்கள்</span>
                <span class="text-2xl font-bold font-headline text-on-surface">{{ number_format($totalCount) }}</span>
                <div class="flex items-center gap-space-xs text-tertiary text-xs">
                    <span class="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>நேரலை தரவுத்தளம்</span>
                </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-surface-container-high/80 flex items-center justify-center text-primary shadow-inner">
                <span class="material-symbols-outlined text-[26px]">quiz</span>
            </div>
        </div>

        <!-- Pending -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container/60 backdrop-blur-xl p-space-md shadow-md flex items-center justify-between border border-white/5">
            <div class="flex flex-col gap-space-xs">
                <span class="text-[11px] text-secondary-fixed-dim uppercase tracking-wider font-semibold">நிலுவை மதிப்பாய்வு</span>
                <span class="text-2xl font-bold font-headline text-secondary">{{ number_format($pendingCount) }}</span>
                <span class="text-[11px] text-outline">அவசர நடவடிக்கை தேவை</span>
            </div>
            <div class="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shadow-inner">
                <span class="material-symbols-outlined text-[26px]">pending_actions</span>
            </div>
        </div>

        <!-- Verified -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container/60 backdrop-blur-xl p-space-md shadow-md flex items-center justify-between border border-white/5">
            <div class="flex flex-col gap-space-xs">
                <span class="text-[11px] text-tertiary uppercase tracking-wider font-semibold">சரிபார்க்கப்பட்டவை</span>
                <span class="text-2xl font-bold font-headline text-tertiary-fixed-dim">{{ number_format($verifiedCount) }}</span>
                <span class="text-[11px] text-outline">தரம் உறுதி செய்யப்பட்டது</span>
            </div>
            <div class="w-12 h-12 rounded-xl bg-tertiary-container/30 flex items-center justify-center text-tertiary shadow-inner">
                <span class="material-symbols-outlined text-[26px]">verified</span>
            </div>
        </div>

        <!-- Flagged -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container/60 backdrop-blur-xl p-space-md shadow-md flex items-center justify-between border border-white/5">
            <div class="flex flex-col gap-space-xs">
                <span class="text-[11px] text-error uppercase tracking-wider font-semibold">கொடியிடப்பட்ட பிழைகள்</span>
                <span class="text-2xl font-bold font-headline text-error">{{ number_format($flaggedCount) }}</span>
                <span class="text-[11px] text-outline">மாணவர் முறைப்பாடு</span>
            </div>
            <div class="w-12 h-12 rounded-xl bg-error-container/30 flex items-center justify-center text-error shadow-inner">
                <span class="material-symbols-outlined text-[26px]">flag</span>
            </div>
        </div>
    </div>

    <!-- Filter & Search Command Bar -->
    <div class="rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-md flex flex-col gap-space-md border border-white/5">
        
        <form action="{{ route('admin.questions.index') }}" method="GET" id="filterForm">
            <!-- Top Row: Search & Fast Buttons -->
            <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
                <div class="relative flex-1 max-w-2xl flex items-center">
                    <span class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">search</span>
                    <input type="text" name="search" id="questionSearchInput" value="{{ request('search') }}"
                           placeholder="வினா உரை, எண் (#TN-...) அல்லது சொல் தேடுக..." 
                           class="w-full pl-11 pr-24 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-xs focus:outline-none focus:ring-1 focus:ring-tertiary transition-all shadow-inner border border-white/5">
                    <div class="absolute right-3 flex items-center gap-1">
                        <kbd class="px-2 py-0.5 rounded bg-surface-container-high text-outline text-[10px] font-mono">CTRL + K</kbd>
                    </div>
                </div>

                <div class="flex items-center gap-space-sm flex-wrap">
                    <a href="{{ route('admin.bulk.index') }}#export" 
                       class="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors shadow-sm text-xs font-semibold border border-white/5">
                        <span class="material-symbols-outlined text-[18px] text-secondary">file_download</span>
                        <span>CSV / JSON ஏற்றுமதி</span>
                    </a>
                    <a href="{{ route('admin.questions.create') }}" 
                       class="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-headline font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md">
                        <span class="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>புதிய வினா சேர்க்க</span>
                    </a>
                </div>
            </div>

            <!-- Filter Dropdowns Row -->
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-space-sm pt-space-md border-t border-white/5 mt-space-sm">
                <!-- Status Filter -->
                <div class="flex flex-col gap-1">
                    <label class="text-[11px] font-semibold text-outline">நிலை / Status</label>
                    <div class="relative">
                        <select name="status" onchange="document.getElementById('filterForm').submit()" 
                                class="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-surface-container text-on-surface text-xs focus:outline-none cursor-pointer shadow-inner border border-white/5">
                            <option value="all" {{ request('status') === 'all' || !request('status') ? 'selected' : '' }}>அனைத்தும் (All Status)</option>
                            <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>நிலுவை (Pending)</option>
                            <option value="verified" {{ request('status') === 'verified' ? 'selected' : '' }}>சரிபார்க்கப்பட்டது (Verified)</option>
                            <option value="flagged" {{ request('status') === 'flagged' ? 'selected' : '' }}>கொடியிடப்பட்டது (Flagged)</option>
                        </select>
                        <span class="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-outline text-[18px]">expand_more</span>
                    </div>
                </div>

                <!-- Subject / Topic Filter -->
                <div class="flex flex-col gap-1">
                    <label class="text-[11px] font-semibold text-outline">பாடம் / தலைப்பு</label>
                    <div class="relative">
                        <select name="topic" onchange="document.getElementById('filterForm').submit()" 
                                class="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-surface-container text-on-surface text-xs focus:outline-none cursor-pointer shadow-inner border border-white/5">
                            <option value="all">அனைத்து தலைப்புகள் (All)</option>
                            @foreach($availableTopics as $topic)
                                <option value="{{ $topic }}" {{ request('topic') === $topic ? 'selected' : '' }}>{{ $topic }}</option>
                            @endforeach
                        </select>
                        <span class="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-outline text-[18px]">expand_more</span>
                    </div>
                </div>

                <!-- Exam Category Filter -->
                <div class="flex flex-col gap-1">
                    <label class="text-[11px] font-semibold text-outline">தேர்வு / Exam Level</label>
                    <div class="relative">
                        <select name="exam" onchange="document.getElementById('filterForm').submit()" 
                                class="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-surface-container text-on-surface text-xs focus:outline-none cursor-pointer shadow-inner border border-white/5">
                            <option value="all">அனைத்து தேர்வுகள்</option>
                            <option value="Group 4" {{ request('exam') === 'Group 4' ? 'selected' : '' }}>TNPSC Group 4 &amp; VAO</option>
                            <option value="Group 2" {{ request('exam') === 'Group 2' ? 'selected' : '' }}>TNPSC Group 2 &amp; 2A</option>
                            <option value="Group 1" {{ request('exam') === 'Group 1' ? 'selected' : '' }}>TNPSC Group 1</option>
                            <option value="SI" {{ request('exam') === 'SI' ? 'selected' : '' }}>TNUSRB SI &amp; Police</option>
                        </select>
                        <span class="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-outline text-[18px]">expand_more</span>
                    </div>
                </div>

                <!-- Year Filter -->
                <div class="flex flex-col gap-1">
                    <label class="text-[11px] font-semibold text-outline">வினாத்தாள் ஆண்டு / Year</label>
                    <div class="relative">
                        <select name="year" onchange="document.getElementById('filterForm').submit()" 
                                class="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-surface-container text-on-surface text-xs focus:outline-none cursor-pointer shadow-inner border border-white/5">
                            <option value="all">அனைத்து ஆண்டுகள்</option>
                            @foreach($availableYears as $year)
                                <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>{{ $year }}</option>
                            @endforeach
                        </select>
                        <span class="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-outline text-[18px]">expand_more</span>
                    </div>
                </div>
            </div>

            <!-- Active Filter Badges -->
            @if(request()->hasAny(['search', 'status', 'topic', 'exam', 'year']))
                <div class="flex items-center gap-space-xs flex-wrap pt-space-xs">
                    <span class="text-[11px] text-outline font-medium">தேர்ந்தெடுக்கப்பட்டவை:</span>
                    @if(request('status') && request('status') !== 'all')
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px]">
                            <span>நிலை: {{ request('status') }}</span>
                        </span>
                    @endif
                    @if(request('topic') && request('topic') !== 'all')
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px]">
                            <span>தலைப்பு: {{ request('topic') }}</span>
                        </span>
                    @endif
                    @if(request('search'))
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px]">
                            <span>தேடல்: "{{ request('search') }}"</span>
                        </span>
                    @endif
                    <a href="{{ route('admin.questions.index') }}" class="text-tertiary hover:underline text-[11px] font-semibold ml-2">
                        அனைத்தையும் அழி (Clear All)
                    </a>
                </div>
            @endif
        </form>
    </div>

    <!-- Bulk Actions Bar Form -->
    <form id="bulkActionForm" action="{{ route('admin.questions.bulkAction') }}" method="POST">
        @csrf
        <div id="bulkActionBar" class="w-full px-space-md py-space-sm rounded-xl bg-surface-container-highest/90 backdrop-blur-xl shadow-lg flex flex-wrap items-center justify-between gap-space-md mb-space-sm hidden border border-white/10">
            <div class="flex items-center gap-space-sm">
                <span id="selectedCountBadge" class="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">0</span>
                <span class="text-xs font-semibold text-on-surface">வினாக்கள் தேர்ந்தெடுக்கப்பட்டுள்ளன</span>
            </div>
            <div class="flex items-center gap-space-xs flex-wrap">
                <button type="submit" name="action" value="verify" class="flex items-center gap-1 px-space-md py-1.5 rounded-lg bg-tertiary-container text-tertiary hover:bg-tertiary-container/80 transition-colors text-xs font-semibold">
                    <span class="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>சரிபார்க்கப்பட்டது என குறி</span>
                </button>
                <button type="submit" name="action" value="flag" class="flex items-center gap-1 px-space-md py-1.5 rounded-lg bg-surface-container-high text-secondary-fixed-dim hover:bg-surface-container-highest transition-colors text-xs font-semibold">
                    <span class="material-symbols-outlined text-[16px]">flag</span>
                    <span>கொடியிடு</span>
                </button>
                <button type="submit" name="action" value="delete" onclick="return confirm('தேர்ந்தெடுத்த வினாக்களை நிரந்தரமாக நீக்கவா?')" class="flex items-center gap-1 px-space-md py-1.5 rounded-lg bg-error-container text-on-error-container hover:brightness-110 transition-all text-xs font-semibold">
                    <span class="material-symbols-outlined text-[16px]">delete</span>
                    <span>நீக்கு (Delete)</span>
                </button>
            </div>
        </div>

        <!-- High Density Glassmorphic Data Table -->
        <div class="overflow-x-auto rounded-2xl bg-surface-container-low/70 backdrop-blur-xl shadow-xl border border-white/5">
            <table class="w-full text-left border-collapse">
                <thead class="bg-surface-container-lowest/90 text-outline uppercase text-[11px] font-semibold sticky top-0 z-20 border-b border-white/5">
                    <tr>
                        <th class="p-space-md w-12 text-center" scope="col">
                            <input type="checkbox" id="selectAllCheckbox" onchange="toggleSelectAll(this)" class="w-4 h-4 rounded bg-surface-container accent-secondary-container cursor-pointer">
                        </th>
                        <th class="py-space-md px-space-sm tracking-wider">ID / காலம்</th>
                        <th class="py-space-md px-space-md tracking-wider min-w-[340px]">வினா விவரம் (Tamil &amp; English)</th>
                        <th class="py-space-md px-space-sm tracking-wider">தேர்வு &amp; தாள்</th>
                        <th class="py-space-md px-space-sm tracking-wider">பாடம் / தலைப்பு</th>
                        <th class="py-space-md px-space-sm tracking-wider">சரியான விடை</th>
                        <th class="py-space-md px-space-sm tracking-wider text-center">நிலை</th>
                        <th class="py-space-md px-space-md tracking-wider text-right">நடவடிக்கைகள்</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5 text-xs">
                    @forelse($questions as $q)
                        <tr class="hover:bg-surface-container-high/40 transition-colors {{ $q->review_status === 'flagged' ? 'bg-error-container/5' : '' }}">
                            <!-- Checkbox -->
                            <td class="p-space-md text-center">
                                <input type="checkbox" name="ids[]" value="{{ $q->id }}" onchange="updateSelectedCount()" class="row-checkbox w-4 h-4 rounded bg-surface-container accent-secondary-container cursor-pointer">
                            </td>

                            <!-- ID & Time -->
                            <td class="py-space-md px-space-sm">
                                <span class="font-mono text-tertiary font-bold block">#TN-{{ $q->id }}</span>
                                <span class="text-outline text-[10px] block">{{ $q->created_at->format('d M, h:i A') }}</span>
                            </td>

                            <!-- Question Content -->
                            <td class="py-space-md px-space-md">
                                <div class="flex flex-col gap-0.5">
                                    <span class="font-headline font-semibold text-xs text-on-surface line-clamp-2">{{ $q->question_ta }}</span>
                                    @if($q->question_en)
                                        <span class="text-outline text-[11px] line-clamp-1 italic">{{ $q->question_en }}</span>
                                    @endif
                                    @if($q->source_pdf)
                                        <div class="flex items-center gap-space-xs mt-1 text-[10px] text-on-surface-variant">
                                            <span class="material-symbols-outlined text-[13px] text-primary">menu_book</span>
                                            <span>சான்று: {{ $q->source_pdf }}</span>
                                        </div>
                                    @endif
                                </div>
                            </td>

                            <!-- Exam & Paper -->
                            <td class="py-space-md px-space-sm">
                                <div class="flex flex-col">
                                    <span class="font-semibold text-on-surface text-xs">{{ $q->paper ?? $q->exam }}</span>
                                    <span class="text-outline text-[10px]">ஆண்டு: {{ $q->year ?? '2024' }}</span>
                                </div>
                            </td>

                            <!-- Topic -->
                            <td class="py-space-md px-space-sm">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-highest text-primary text-[11px] font-medium">
                                    {{ $q->topic }}
                                </span>
                            </td>

                            <!-- Answer Key -->
                            <td class="py-space-md px-space-sm">
                                @php
                                    $labelMap = ['A' => 'அ', 'B' => 'ஆ', 'C' => 'இ', 'D' => 'ஈ'];
                                    $ansLabel = $labelMap[$q->answer] ?? $q->answer;
                                    $ansText = '';
                                    if(is_array($q->options)) {
                                        foreach($q->options as $opt) {
                                            if(($opt['id'] ?? '') === $q->answer) {
                                                $ansText = $opt['text_ta'] ?? '';
                                                break;
                                            }
                                        }
                                    }
                                @endphp
                                <div class="flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-full bg-tertiary-container text-tertiary flex items-center justify-center font-bold text-[10px]">
                                        {{ $ansLabel }}
                                    </span>
                                    <span class="text-on-surface text-xs truncate max-w-[120px]" title="{{ $ansText }}">{{ $ansText ?: $q->answer }}</span>
                                </div>
                            </td>

                            <!-- Status Badge -->
                            <td class="py-space-md px-space-sm text-center">
                                @if($q->review_status === 'verified')
                                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container text-tertiary text-[11px] font-semibold">
                                        <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                        <span>சரிபார்க்கப்பட்டது</span>
                                    </span>
                                @elseif($q->review_status === 'flagged' || $q->review_status === 'disputed')
                                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container/40 text-error text-[11px] font-semibold">
                                        <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
                                        <span>கொடியிடப்பட்டது</span>
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[11px] font-semibold">
                                        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                        <span>நிலுவை (Pending)</span>
                                    </span>
                                @endif
                            </td>

                            <!-- Row Action Buttons -->
                            <td class="py-space-md px-space-md text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <!-- Quick Verify Button -->
                                    <button type="submit" form="quickVerifyForm_{{ $q->id }}" class="p-1.5 rounded-lg bg-surface-container text-tertiary hover:bg-tertiary hover:text-on-tertiary transition-colors" title="சரிபார் (Mark Reviewed)">
                                        <span class="material-symbols-outlined text-[18px]">check</span>
                                    </button>

                                    <!-- Edit Button -->
                                    <a href="{{ route('admin.questions.edit', $q->id) }}" class="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors" title="திருத்து (Edit)">
                                        <span class="material-symbols-outlined text-[18px]">edit</span>
                                    </a>

                                    <!-- Flag Button -->
                                    <button type="submit" form="quickFlagForm_{{ $q->id }}" class="p-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary-container hover:text-on-secondary-container transition-colors" title="கொடியிடு (Flag)">
                                        <span class="material-symbols-outlined text-[18px]">flag</span>
                                    </button>

                                    <!-- Delete Button -->
                                    <button type="submit" form="quickDeleteForm_{{ $q->id }}" onclick="return confirm('வினா #TN-{{ $q->id }} ஐ நிரந்தரமாக நீக்கவா?')" class="p-1.5 rounded-lg bg-surface-container text-error hover:bg-error-container hover:text-on-error transition-colors" title="நீக்கு (Delete)">
                                        <span class="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="py-12 text-center text-outline">
                                <div class="flex flex-col items-center gap-2">
                                    <span class="material-symbols-outlined text-4xl text-outline">search_off</span>
                                    <span class="text-sm">வினாக்கள் எதுவும் கிடைக்கவில்லை.</span>
                                    <a href="{{ route('admin.questions.create') }}" class="text-tertiary underline text-xs font-semibold">புதிய வினாவைச் சேர்க்கவும்</a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </form>

    <!-- Hidden Individual Action Forms -->
    @foreach($questions as $q)
        <form id="quickVerifyForm_{{ $q->id }}" action="{{ route('admin.questions.status', $q->id) }}" method="POST" class="hidden">
            @csrf
            <input type="hidden" name="status" value="verified">
        </form>
        <form id="quickFlagForm_{{ $q->id }}" action="{{ route('admin.questions.status', $q->id) }}" method="POST" class="hidden">
            @csrf
            <input type="hidden" name="status" value="flagged">
        </form>
        <form id="quickDeleteForm_{{ $q->id }}" action="{{ route('admin.questions.destroy', $q->id) }}" method="POST" class="hidden">
            @csrf
            @method('DELETE')
        </form>
    @endforeach

    <!-- Pagination -->
    <div class="mt-space-md">
        {{ $questions->links() }}
    </div>

</div>

@push('scripts')
<script>
    function toggleSelectAll(masterCheckbox) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
        updateSelectedCount();
    }

    function updateSelectedCount() {
        const checkboxes = document.querySelectorAll('.row-checkbox:checked');
        const count = checkboxes.length;
        const bar = document.getElementById('bulkActionBar');
        const badge = document.getElementById('selectedCountBadge');

        badge.innerText = count;
        if (count > 0) {
            bar.classList.remove('hidden');
        } else {
            bar.classList.add('hidden');
        }
    }

    // Keyboard shortcut '/' and 'Ctrl+K' for search focus
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
            e.preventDefault();
            const searchInput = document.getElementById('questionSearchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });
</script>
@endpush
@endsection
