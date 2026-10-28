@extends('admin.layouts.app')

@section('title', $isEdit ? "வினா திருத்தம் #TN-{$question->id}" : 'புதிய வினா சேர்த்தல்')

@section('content')
<div class="flex flex-col w-full gap-space-lg">

    @php
        $formAction = $isEdit ? route('admin.questions.update', $question->id) : route('admin.questions.store');
        $opts = $question->options ?? [];
        $optA_ta = old('option_A_ta', $opts[0]['text_ta'] ?? '');
        $optA_en = old('option_A_en', $opts[0]['text_en'] ?? '');
        $optB_ta = old('option_B_ta', $opts[1]['text_ta'] ?? '');
        $optB_en = old('option_B_en', $opts[1]['text_en'] ?? '');
        $optC_ta = old('option_C_ta', $opts[2]['text_ta'] ?? '');
        $optC_en = old('option_C_en', $opts[2]['text_en'] ?? '');
        $optD_ta = old('option_D_ta', $opts[3]['text_ta'] ?? '');
        $optD_en = old('option_D_en', $opts[3]['text_en'] ?? '');
        $currentAns = old('answer', $question->answer ?? 'A');
        $currentStatus = old('review_status', $question->review_status ?? 'verified');
    @endphp

    <form action="{{ $formAction }}" method="POST" id="questionForm">
        @csrf
        @if($isEdit)
            @method('PUT')
        @endif

        <!-- Top Control Bar / Page Header -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md sm:p-space-lg shadow-xl border border-white/5 mb-space-lg">
            <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
            <div class="absolute right-1/3 -bottom-12 w-48 h-48 rounded-full bg-tertiary/10 blur-2xl pointer-events-none"></div>

            <div class="relative flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <!-- Breadcrumb and Title -->
                <div class="flex flex-col gap-space-xs">
                    <div class="flex items-center gap-space-xs text-on-surface-variant text-xs">
                        <a href="{{ route('admin.questions.index') }}" class="hover:underline">வினா வங்கி</a>
                        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span>பாடத்திட்டம் 2024-25</span>
                        <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span class="text-tertiary font-semibold font-mono">
                            {{ $isEdit ? "#TN-{$question->id}" : 'புதிய பதிவு' }}
                        </span>
                    </div>
                    <div class="flex items-center gap-space-md flex-wrap">
                        <h1 class="text-2xl font-bold font-headline text-on-surface tracking-tight">
                            {{ $isEdit ? 'வினா திருத்தம் (Edit Question)' : 'புதிய வினா சேர்த்தல் (Add Question)' }}
                        </h1>
                        <span class="px-space-sm py-0.5 rounded-full {{ $isEdit ? 'bg-surface-container-high text-secondary-fixed-dim' : 'bg-tertiary-container text-tertiary' }} text-xs font-semibold">
                            {{ $isEdit ? 'திருத்தம் முறைமை (Edit Mode)' : 'புதிய உருவாக்கம் (Create Mode)' }}
                        </span>
                    </div>
                </div>

                <!-- Action Buttons in Header -->
                <div class="flex items-center gap-space-sm flex-wrap">
                    <a href="{{ route('admin.questions.index') }}" class="px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-bright transition-all text-xs font-semibold">
                        ரத்து செய்
                    </a>
                    @if(!$isEdit)
                        <button type="submit" name="save_and_next" value="1" class="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-all shadow-sm text-xs font-semibold">
                            <span class="material-symbols-outlined text-[18px]">add_task</span>
                            <span>சேமி &amp; அடுத்தது</span>
                        </button>
                    @endif
                    <button type="submit" class="flex items-center gap-space-xs px-space-lg py-2.5 rounded-xl bg-secondary-container text-on-secondary font-headline font-bold text-sm hover:brightness-110 shadow-md active:scale-95 transition-all">
                        <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">save</span>
                        <span>சேமி (Save)</span>
                    </button>
                </div>
            </div>
        </div>

        @if($errors->any())
            <div class="mb-space-md p-space-sm rounded-xl bg-error-container/30 border border-error/30 text-error flex items-start gap-2 text-xs">
                <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span>{{ $errors->first() }}</span>
            </div>
        @endif

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">

            <!-- LEFT / PRIMARY FORM COLUMN (8 cols on XL) -->
            <div class="xl:col-span-8 flex flex-col gap-space-lg">

                <!-- SECTION 1: EXAM METADATA -->
                <section class="rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col gap-space-md border border-white/5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-space-sm">
                            <span class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
                                <span class="material-symbols-outlined text-[20px]">tune</span>
                            </span>
                            <div>
                                <h2 class="text-base font-bold font-headline text-on-surface">மெட்டாடேட்டா &amp; வகைப்பாடு</h2>
                                <span class="text-xs text-on-surface-variant">தேர்வு நிலை, ஆண்டு மற்றும் பாடத்திட்ட அலகு விவரங்கள்</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs">
                        <!-- Exam Selector -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface-variant">தேர்வு (Exam)</label>
                            <div class="relative">
                                <select name="exam" required class="w-full appearance-none rounded-xl bg-surface-container-high/80 text-on-surface px-space-md py-2.5 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                    <option value="TNPSC" {{ old('exam', $question->exam) == 'TNPSC' ? 'selected' : '' }}>TNPSC</option>
                                    <option value="TNUSRB" {{ old('exam', $question->exam) == 'TNUSRB' ? 'selected' : '' }}>TNUSRB (Police)</option>
                                    <option value="TNFUSRC" {{ old('exam', $question->exam) == 'TNFUSRC' ? 'selected' : '' }}>TNFUSRC (Forest)</option>
                                </select>
                                <span class="material-symbols-outlined text-[18px] text-outline absolute right-2.5 top-3 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <!-- Year Selector -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface-variant">ஆண்டு (Year)</label>
                            <div class="relative">
                                <select name="year" class="w-full appearance-none rounded-xl bg-surface-container-high/80 text-on-surface px-space-md py-2.5 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                    <option value="2024" {{ old('year', $question->year) == 2024 ? 'selected' : '' }}>2024 (Latest)</option>
                                    <option value="2023" {{ old('year', $question->year) == 2023 ? 'selected' : '' }}>2023</option>
                                    <option value="2022" {{ old('year', $question->year) == 2022 ? 'selected' : '' }}>2022</option>
                                    <option value="2021" {{ old('year', $question->year) == 2021 ? 'selected' : '' }}>2021</option>
                                    <option value="2019" {{ old('year', $question->year) == 2019 ? 'selected' : '' }}>2019</option>
                                </select>
                                <span class="material-symbols-outlined text-[18px] text-outline absolute right-2.5 top-3 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <!-- Paper / Section -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface-variant">தாள் / பிரிவு (Paper)</label>
                            <div class="relative">
                                <select name="paper" required class="w-full appearance-none rounded-xl bg-surface-container-high/80 text-on-surface px-space-md py-2.5 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                    <option value="Group 4 & VAO" {{ old('paper', $question->paper) == 'Group 4 & VAO' ? 'selected' : '' }}>Group 4 &amp; VAO</option>
                                    <option value="Group 2 & 2A" {{ old('paper', $question->paper) == 'Group 2 & 2A' ? 'selected' : '' }}>Group 2 &amp; 2A</option>
                                    <option value="Group 1 (Prelims)" {{ old('paper', $question->paper) == 'Group 1 (Prelims)' ? 'selected' : '' }}>Group 1 (Prelims)</option>
                                    <option value="SI & Police" {{ old('paper', $question->paper) == 'SI & Police' ? 'selected' : '' }}>SI &amp; Police</option>
                                </select>
                                <span class="material-symbols-outlined text-[18px] text-outline absolute right-2.5 top-3 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <!-- Topic Selector -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface-variant">தலைப்பு (Syllabus Unit)</label>
                            <div class="relative">
                                <input type="text" name="topic" list="topics_datalist" required 
                                       value="{{ old('topic', $question->topic ?? 'பொதுத்தமிழ் & தமிழ் இலக்கியம்') }}" 
                                       class="w-full rounded-xl bg-surface-container-high/80 text-on-surface px-space-md py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                <datalist id="topics_datalist">
                                    <option value="பொதுத்தமிழ் & தமிழ் இலக்கியம்">
                                    <option value="தமிழ்நாடு வரலாறு, மரபு & பண்பாடு (Unit 8 & 9)">
                                    <option value="இந்திய ஆட்சியியல் & அரசியலமைப்பு">
                                    <option value="திறனறிவு & கணிதம்">
                                    <option value="புவியியல் & சுற்றுச்சூழல்">
                                    <option value="நடப்பு நிகழ்வுகள் & பொது அறிவு">
                                    <option value="பொது அறிவியல்">
                                </datalist>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- SECTION 2: BILINGUAL QUESTION FORM -->
                <section class="rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col gap-space-md border border-white/5">
                    <div class="flex items-center justify-between flex-wrap gap-space-sm">
                        <div class="flex items-center gap-space-sm">
                            <span class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary">
                                <span class="material-symbols-outlined text-[20px]">translate</span>
                            </span>
                            <div>
                                <h2 class="text-base font-bold font-headline text-on-surface">இருமொழி வினா உரை (Bilingual Question)</h2>
                                <span class="text-xs text-on-surface-variant">தமிழ் மற்றும் ஆங்கில வினா வாசகங்கள்</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tamil Rich Editor Box -->
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <label class="text-xs font-semibold text-tertiary flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-[16px]">edit_note</span>
                                வினா உரை (தமிழ்) - முதன்மை
                            </label>
                        </div>
                        <textarea name="question_ta" required rows="4" 
                                  placeholder="வினா வாசகத்தை தமிழில் தட்டச்சு செய்க..." 
                                  class="w-full rounded-xl bg-surface-container-lowest/80 text-on-surface px-space-md py-space-sm text-sm focus:outline-none focus:ring-1 focus:ring-tertiary resize-y border border-white/5 leading-relaxed font-body">{{ old('question_ta', $question->question_ta) }}</textarea>
                    </div>

                    <!-- English Translation Box -->
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <label class="text-xs font-semibold text-primary flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-[16px]">language</span>
                                Question Text (English Translation - விருப்பத்தேர்வு)
                            </label>
                        </div>
                        <textarea name="question_en" rows="3" 
                                  placeholder="Enter corresponding English question text here..." 
                                  class="w-full rounded-xl bg-surface-container-lowest/80 text-on-surface px-space-md py-space-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-y border border-white/5 leading-relaxed">{{ old('question_en', $question->question_en) }}</textarea>
                    </div>
                </section>

                <!-- SECTION 3: 4 OPTIONS SELECTOR -->
                <section class="rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col gap-space-md border border-white/5">
                    <div class="flex items-center justify-between flex-wrap gap-space-sm">
                        <div class="flex items-center gap-space-sm">
                            <span class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary-fixed-dim">
                                <span class="material-symbols-outlined text-[20px]">checklist</span>
                            </span>
                            <div>
                                <h2 class="text-base font-bold font-headline text-on-surface">4 மாற்று விடைகள் (Multiple Choice Options)</h2>
                                <span class="text-xs text-on-surface-variant">சரியான விடையைத் தேர்ந்தெடுக்க அதற்கான வட்டத்தை சொடுக்கவும்</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-space-md pt-space-xs">
                        <!-- Option A (அ) -->
                        <div class="rounded-xl p-space-md bg-surface-container-low border border-white/5">
                            <div class="flex items-start gap-space-md">
                                <label class="flex items-center gap-space-sm cursor-pointer pt-1" title="விடை (A) சரியானதாக குறிக்கவும்">
                                    <input type="radio" name="answer" value="A" {{ $currentAns === 'A' ? 'checked' : '' }} class="w-5 h-5 accent-tertiary">
                                    <span class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface font-headline font-bold text-sm flex items-center justify-center">அ</span>
                                </label>
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">விடை உரை (தமிழ்) - A</label>
                                        <input type="text" name="option_A_ta" required value="{{ $optA_ta }}" placeholder="விடை ஆப்ஷன் A தமிழில்..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">Option in English</label>
                                        <input type="text" name="option_A_en" value="{{ $optA_en }}" placeholder="Option A in English..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-outline border border-white/5">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Option B (ஆ) -->
                        <div class="rounded-xl p-space-md bg-surface-container-low border border-white/5">
                            <div class="flex items-start gap-space-md">
                                <label class="flex items-center gap-space-sm cursor-pointer pt-1" title="விடை (B) சரியானதாக குறிக்கவும்">
                                    <input type="radio" name="answer" value="B" {{ $currentAns === 'B' ? 'checked' : '' }} class="w-5 h-5 accent-tertiary">
                                    <span class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface font-headline font-bold text-sm flex items-center justify-center">ஆ</span>
                                </label>
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">விடை உரை (தமிழ்) - B</label>
                                        <input type="text" name="option_B_ta" required value="{{ $optB_ta }}" placeholder="விடை ஆப்ஷன் B தமிழில்..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">Option in English</label>
                                        <input type="text" name="option_B_en" value="{{ $optB_en }}" placeholder="Option B in English..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-outline border border-white/5">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Option C (இ) -->
                        <div class="rounded-xl p-space-md bg-surface-container-low border border-white/5">
                            <div class="flex items-start gap-space-md">
                                <label class="flex items-center gap-space-sm cursor-pointer pt-1" title="விடை (C) சரியானதாக குறிக்கவும்">
                                    <input type="radio" name="answer" value="C" {{ $currentAns === 'C' ? 'checked' : '' }} class="w-5 h-5 accent-tertiary">
                                    <span class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface font-headline font-bold text-sm flex items-center justify-center">இ</span>
                                </label>
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">விடை உரை (தமிழ்) - C</label>
                                        <input type="text" name="option_C_ta" required value="{{ $optC_ta }}" placeholder="விடை ஆப்ஷன் C தமிழில்..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">Option in English</label>
                                        <input type="text" name="option_C_en" value="{{ $optC_en }}" placeholder="Option C in English..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-outline border border-white/5">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Option D (ஈ) -->
                        <div class="rounded-xl p-space-md bg-surface-container-low border border-white/5">
                            <div class="flex items-start gap-space-md">
                                <label class="flex items-center gap-space-sm cursor-pointer pt-1" title="விடை (D) சரியானதாக குறிக்கவும்">
                                    <input type="radio" name="answer" value="D" {{ $currentAns === 'D' ? 'checked' : '' }} class="w-5 h-5 accent-tertiary">
                                    <span class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface font-headline font-bold text-sm flex items-center justify-center">ஈ</span>
                                </label>
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">விடை உரை (தமிழ்) - D</label>
                                        <input type="text" name="option_D_ta" required value="{{ $optD_ta }}" placeholder="விடை ஆப்ஷன் D தமிழில்..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-tertiary border border-white/5">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] text-on-surface-variant mb-1 font-medium">Option in English</label>
                                        <input type="text" name="option_D_en" value="{{ $optD_en }}" placeholder="Option D in English..." class="w-full rounded-lg bg-surface-container-highest/70 text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-outline border border-white/5">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- SECTION 4: DETAILED EXPLANATION & REFERENCE -->
                <section class="rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col gap-space-md border border-white/5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-space-sm">
                            <span class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-fixed">
                                <span class="material-symbols-outlined text-[20px]">menu_book</span>
                            </span>
                            <div>
                                <h2 class="text-base font-bold font-headline text-on-surface">விரிவான விளக்கம் &amp; சான்றாதாரம்</h2>
                                <span class="text-xs text-on-surface-variant">மாணவர்கள் சுலபமாகப் புரிந்து கொள்ளும் குறிப்புகள் மற்றும் சமச்சீர் பாடநூல் தகவல்</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-on-surface-variant">தமிழ் விளக்கம் (Explanation in Tamil) *</label>
                        <textarea name="explanation" required rows="4" 
                                  placeholder="விளக்கக் குறிப்புகளை உள்ளிடவும்..." 
                                  class="w-full rounded-xl bg-surface-container-lowest/80 text-on-surface px-space-md py-space-sm text-xs focus:outline-none focus:ring-1 focus:ring-tertiary resize-y border border-white/5 leading-relaxed">{{ old('explanation', $question->explanation) }}</textarea>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-on-surface-variant">சமச்சீர் பாடநூல் ஆதாரம் (Source / Reference)</label>
                        <input type="text" name="source_pdf" value="{{ old('source_pdf', $question->source_pdf ?? '10-ஆம் வகுப்பு சமச்சீர் கல்வி') }}" 
                               placeholder="எ.கா: 10-ஆம் வகுப்பு இயல் 3, பக்கம் 48" 
                               class="w-full rounded-xl bg-surface-container-high text-on-surface px-space-md py-2 text-xs focus:outline-none focus:ring-1 focus:ring-secondary border border-white/5">
                    </div>
                </section>

            </div>

            <!-- RIGHT / SIDEBAR COLUMN (4 cols on XL) -->
            <div class="xl:col-span-4 flex flex-col gap-space-lg">

                <!-- MODERATION & APPROVAL STATUS -->
                <section class="rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col gap-space-md border border-white/5">
                    <div class="flex items-center gap-space-sm">
                        <span class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary">
                            <span class="material-symbols-outlined text-[20px]">verified_user</span>
                        </span>
                        <div>
                            <h3 class="text-base font-bold font-headline text-on-surface">ஒப்புதல் நிலை (Moderation)</h3>
                            <span class="text-xs text-on-surface-variant">சரிபார்ப்பு நிலை மற்றும் மதிப்பாய்வு</span>
                        </div>
                    </div>

                    <!-- Moderation Radio Cards -->
                    <div class="grid grid-cols-3 gap-1 p-1 bg-surface-container-lowest rounded-xl border border-white/5">
                        <label class="flex flex-col items-center justify-center py-2 px-1 rounded-lg cursor-pointer transition-all hover:bg-surface-container-high">
                            <input type="radio" name="review_status" value="pending" {{ $currentStatus === 'pending' ? 'checked' : '' }} class="sr-only">
                            <span class="material-symbols-outlined text-[18px] mb-0.5 text-secondary">hourglass_top</span>
                            <span class="text-[11px] font-semibold text-center">நிலுவை</span>
                        </label>
                        <label class="flex flex-col items-center justify-center py-2 px-1 rounded-lg cursor-pointer transition-all hover:bg-surface-container-high">
                            <input type="radio" name="review_status" value="verified" {{ $currentStatus === 'verified' ? 'checked' : '' }} class="sr-only">
                            <span class="material-symbols-outlined text-[18px] mb-0.5 text-tertiary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                            <span class="text-[11px] font-semibold text-center">சரிபார்க்கப்பட்டது</span>
                        </label>
                        <label class="flex flex-col items-center justify-center py-2 px-1 rounded-lg cursor-pointer transition-all hover:bg-surface-container-high">
                            <input type="radio" name="review_status" value="flagged" {{ $currentStatus === 'flagged' ? 'checked' : '' }} class="sr-only">
                            <span class="material-symbols-outlined text-[18px] mb-0.5 text-error">flag</span>
                            <span class="text-[11px] font-semibold text-center">கொடியிடு</span>
                        </label>
                    </div>

                    <!-- Submit Actions Box -->
                    <div class="pt-space-md border-t border-white/5 flex flex-col gap-2">
                        <button type="submit" class="w-full py-3 px-space-md rounded-xl bg-secondary-container text-on-secondary font-headline font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">save</span>
                            <span>{{ $isEdit ? 'மாற்றங்களை சேமி (Update)' : 'வினாவை சேமி (Save Question)' }}</span>
                        </button>
                        <a href="{{ route('admin.questions.index') }}" class="w-full py-2 rounded-xl bg-surface-container text-on-surface text-center text-xs font-semibold hover:bg-surface-container-high transition-colors">
                            பட்டியலுக்குத் திரும்பு
                        </a>
                    </div>
                </section>

                <!-- Help Guide Card -->
                <div class="p-space-md rounded-2xl bg-surface-container-low/70 border border-white/5 flex flex-col gap-2 text-xs text-on-surface-variant">
                    <span class="text-secondary font-semibold flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">info</span>
                        வழிகாட்டுதல் குறிப்பு:
                    </span>
                    <p>1. வினா உரை மற்றும் 4 விருப்பத்தெரிவுகளை தமிழில் கட்டாயமாக உள்ளிட வேண்டும்.</p>
                    <p>2. சரியான விடைக்குரிய வட்டத்தை (Radio) தேர்ந்தெடுத்து உறுதிப்படுத்தவும்.</p>
                    <p>3. சமச்சீர் கல்வி பாடநூல் பக்க எண்ணைக் குறிப்பிடுவது மாணவர்களுக்குப் பேருதவியாக இருக்கும்.</p>
                </div>

            </div>
        </div>
    </form>
</div>
@endsection
