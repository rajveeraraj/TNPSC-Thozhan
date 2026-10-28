@extends('admin.layouts.app')

@section('title', 'மொத்த இறக்குமதி & ஏற்றுமதி (Bulk Import & Export)')

@section('content')
<div class="flex flex-col w-full gap-space-lg">

    <!-- Top Banner with Tab Switches -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-low/70 backdrop-blur-xl p-space-lg rounded-2xl shadow-xl border border-white/5">
        <div class="flex items-center gap-space-md">
            <div class="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-tertiary shadow-inner">
                <span class="material-symbols-outlined text-[32px]">sync_alt</span>
            </div>
            <div>
                <div class="flex items-center gap-space-xs">
                    <span class="px-2 py-0.5 rounded-full bg-tertiary-container text-tertiary text-[11px] font-semibold uppercase tracking-wider">தரவு பரிமாற்றம்</span>
                    <span class="text-outline text-xs">• Schema v3.1 SQLite</span>
                </div>
                <h1 class="text-2xl font-bold font-headline text-on-surface">மொத்த இறக்குமதி &amp; ஏற்றுமதி தளம்</h1>
                <p class="text-xs text-on-surface-variant mt-0.5">TNPSC வினா வங்கிக்கான தொகுதி செயலாக்கம், JSON/CSV தரவு ஒத்திசைவு மற்றும் பாதுகாப்பு சரிபார்ப்புகள்.</p>
            </div>
        </div>

        <div class="flex items-center bg-surface-container-lowest/80 p-1 rounded-xl shadow-inner border border-white/5 gap-1">
            <button type="button" id="tab-import-btn" onclick="switchMainTab('import')" 
                    class="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-high text-tertiary text-xs font-semibold transition-all shadow-sm">
                <span class="material-symbols-outlined text-[18px]">publish</span>
                <span>1. மொத்த இறக்குமதி</span>
            </button>
            <button type="button" id="tab-export-btn" onclick="switchMainTab('export')" 
                    class="flex items-center gap-space-xs px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 text-xs font-semibold transition-all">
                <span class="material-symbols-outlined text-[18px]">file_download</span>
                <span>2. வினாக்கள் ஏற்றுமதி</span>
            </button>
        </div>
    </div>

    <!-- 1. BULK IMPORT PANEL -->
    <div id="import-panel" class="flex flex-col gap-space-lg">
        <form action="{{ route('admin.bulk.import') }}" method="POST" enctype="multipart/form-data" id="importForm">
            @csrf
            <input type="hidden" name="format" id="importFormatInput" value="json">

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                <!-- Left Input Area (7 cols) -->
                <div class="lg:col-span-7 flex flex-col gap-space-md">
                    <div class="bg-surface-container-low/70 backdrop-blur-xl p-space-lg rounded-2xl shadow-lg flex flex-col gap-space-md border border-white/5">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div class="flex items-center gap-space-sm">
                                <span class="font-headline font-bold text-sm text-on-surface">தரவு வடிவம் &amp; பதிவேற்றம்</span>
                                <span class="px-2 py-0.5 rounded-md bg-surface-container-highest text-outline text-[11px]">UTF-8 Supported</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="flex bg-surface-container-highest/60 p-1 rounded-lg border border-white/5">
                                    <button type="button" id="fmt-json" onclick="setImportFormat('json')" class="px-3 py-1 rounded text-tertiary bg-surface-container text-xs font-semibold transition-all">JSON</button>
                                    <button type="button" id="fmt-csv" onclick="setImportFormat('csv')" class="px-3 py-1 rounded text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all">CSV</button>
                                </div>
                                <a id="sampleTemplateLink" href="{{ route('admin.bulk.sample', ['format' => 'json']) }}" class="flex items-center gap-1 text-secondary hover:text-secondary-fixed-dim text-xs px-2 py-1 rounded-lg bg-surface-container-high/40 transition-colors border border-white/5">
                                    <span class="material-symbols-outlined text-[16px]">download</span>
                                    <span>மாதிரி படிவம்</span>
                                </a>
                            </div>
                        </div>

                        <!-- Drop Zone -->
                        <div id="drop-zone" class="relative p-6 rounded-xl bg-surface-container-lowest/60 hover:bg-surface-container-lowest transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-inner border-2 border-dashed border-white/10">
                            <input type="file" name="import_file" id="file-uploader" accept=".json,.csv" onchange="handleFileSelected(this)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                            <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 group-hover:text-tertiary transition-transform mb-2">
                                <span class="material-symbols-outlined text-[28px]">upload_file</span>
                            </div>
                            <p class="text-xs font-semibold text-on-surface">கோப்பை இழுத்து விடவும் அல்லது <span class="text-tertiary underline">தேர்ந்தெடுக்க கிளிக் செய்யவும்</span></p>
                            <p class="text-[11px] text-on-surface-variant mt-1" id="file-chosen-label">ஆதரிக்கப்படும் வடிவங்கள்: .JSON, .CSV (அதிகபட்ச வரம்பு: 15MB)</p>
                        </div>

                        <!-- Direct Raw Data Paste -->
                        <div class="flex flex-col gap-1.5">
                            <div class="flex items-center justify-between">
                                <label class="text-xs font-semibold text-on-surface flex items-center gap-1">
                                    <span>நேரடி தரவு ஒட்டுதல் (Raw Input)</span>
                                    <span class="text-outline text-[11px] font-normal">(தானியங்கி பிரித்தெடுத்தல்)</span>
                                </label>
                                <button type="button" onclick="document.getElementById('raw-data-input').value = ''; updateDetectStats();" class="text-on-surface-variant hover:text-error text-[11px] transition-colors">அழி</button>
                            </div>
                            <div class="relative">
                                <textarea name="raw_input" id="raw-data-input" rows="8" oninput="updateDetectStats()" 
                                          placeholder='இங்கே JSON அல்லது CSV தரவை ஒட்டவும்...
எடுத்துக்காட்டு JSON:
[
  { "question": "இந்தியாவின் முதல் மகளிர் குடியரசுத் தலைவர் யார்?", "options": ["சரோஜினி நாயுடு", "பிரதிபா பாட்டீல்", "இந்திரா காந்தி", "சுசேதா கிருபாளினி"], "answer": 1, "unit": "Unit V" }
]'
                                          class="w-full bg-surface-container-lowest/80 text-on-surface font-mono text-xs leading-relaxed p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-tertiary placeholder:text-outline shadow-inner resize-y border border-white/5"></textarea>
                                <div class="absolute bottom-2.5 right-3 text-outline text-[10px] pointer-events-none">UTF-8 Monospace</div>
                            </div>
                        </div>
                    </div>

                    <!-- Import Rules & Preferences -->
                    <div class="bg-surface-container-low/70 backdrop-blur-xl p-space-md rounded-2xl shadow-lg flex flex-col gap-space-sm border border-white/5">
                        <div class="text-xs font-bold text-on-surface flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px] text-primary">tune</span>
                            <span>இறக்குமதி விதிகள் &amp; விருப்பத்தேர்வுகள்</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                            <label class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container cursor-pointer transition-colors border border-white/5">
                                <input type="checkbox" name="skip_duplicates" value="1" checked class="mt-1 w-4 h-4 rounded text-tertiary bg-surface-container-highest accent-tertiary">
                                <div class="flex flex-col">
                                    <span class="text-xs font-semibold text-on-surface">போலி வினாக்களைத் தவிர்</span>
                                    <span class="text-[10px] text-on-surface-variant">Question text hash கொண்டு நகல்களை நீக்கும்</span>
                                </div>
                            </label>
                            <label class="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container cursor-pointer transition-colors border border-white/5">
                                <input type="radio" name="default_status" value="verified" checked class="mt-1 w-4 h-4 accent-tertiary">
                                <div class="flex flex-col">
                                    <span class="text-xs font-semibold text-on-surface">சரிபார்க்கப்பட்டது (Verified)</span>
                                    <span class="text-[10px] text-on-surface-variant">நேரடியாகப் பயன்பாட்டிற்கு தயார்</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Right Validation & Execution Area (5 cols) -->
                <div class="lg:col-span-5 flex flex-col gap-space-md">
                    <div class="bg-surface-container-low/70 backdrop-blur-xl p-space-lg rounded-2xl shadow-lg flex flex-col gap-space-md border border-white/5">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold font-headline text-on-surface flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-tertiary text-[20px]">verified</span>
                                சரிபார்ப்பு கண்ணோட்டம் (Live Check)
                            </span>
                            <span class="px-2.5 py-0.5 rounded-full bg-surface-container text-tertiary text-[11px] font-semibold" id="validation-pill">ஆயத்தமானது</span>
                        </div>

                        <div class="grid grid-cols-3 gap-2 text-center">
                            <div class="p-3 rounded-xl bg-surface-container/80 flex flex-col items-center border border-white/5">
                                <span class="text-[11px] text-on-surface-variant">கண்டறிந்தவை</span>
                                <span class="text-2xl font-bold font-headline text-primary mt-1" id="stat-detected">0</span>
                                <span class="text-[9px] text-outline">வரிசைகள்</span>
                            </div>
                            <div class="p-3 rounded-xl bg-surface-container/80 flex flex-col items-center border border-white/5">
                                <span class="text-[11px] text-tertiary">செல்லுபடியாகும்</span>
                                <span class="text-2xl font-bold font-headline text-tertiary mt-1" id="stat-valid">0</span>
                                <span class="text-[9px] text-tertiary/70">தயார் நிலையில்</span>
                            </div>
                            <div class="p-3 rounded-xl bg-surface-container/80 flex flex-col items-center border border-white/5">
                                <span class="text-[11px] text-error">பிழைகள்</span>
                                <span class="text-2xl font-bold font-headline text-error mt-1" id="stat-errors">0</span>
                                <span class="text-[9px] text-error/70">திருத்தம் தேவை</span>
                            </div>
                        </div>

                        <button type="submit" class="w-full py-3.5 px-space-md rounded-xl bg-secondary-container hover:brightness-110 text-on-secondary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]">
                            <span class="material-symbols-outlined text-[22px]">archive</span>
                            <span id="btn-import-text">வினாக்களை மொத்தமாகச் சேர் (Execute Bulk Import)</span>
                        </button>
                        <span class="text-center text-[10px] text-outline">அனைத்து வினாக்களும் SQLite தரவுத்தளத்தில் சேர்க்கப்படும்.</span>
                    </div>

                    <div class="p-space-md rounded-2xl bg-surface-container-low/70 border border-white/5 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary">
                            <span class="material-symbols-outlined text-[20px]">history</span>
                        </div>
                        <div>
                            <span class="text-xs font-semibold text-on-surface block">தரவுத்தள தகவல்</span>
                            <span class="text-[11px] text-on-surface-variant block">தற்போது {{ \App\Models\Question::count() }} வினாக்கள் சேமிக்கப்பட்டுள்ளன.</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- 2. QUESTIONS EXPORT PANEL -->
    <div id="export-panel" class="hidden flex flex-col gap-space-lg">
        <form action="{{ route('admin.bulk.export') }}" method="GET" id="exportForm">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                <!-- Left Filters Column (5 cols) -->
                <div class="lg:col-span-5 flex flex-col gap-space-md">
                    <div class="bg-surface-container-low/70 backdrop-blur-xl p-space-lg rounded-2xl shadow-lg flex flex-col gap-space-md border border-white/5">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold font-headline text-on-surface flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
                                வடிகட்டுதல் வரம்புகள் (Export Filters)
                            </span>
                        </div>

                        <!-- Syllabus Topic -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface">பாடத்திட்ட அலகு (Syllabus Topic)</label>
                            <select name="topic" id="export-topic" onchange="refreshExportPreview()" class="w-full bg-surface-container text-on-surface px-3 py-2 rounded-xl focus:outline-none text-xs border border-white/5">
                                <option value="all">அனைத்து பாடங்கள் (All Topics)</option>
                                @foreach($availableTopics as $t)
                                    <option value="{{ $t }}">{{ $t }}</option>
                                @endforeach
                            </select>
                        </div>

                        <!-- Exam Category -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface">தேர்வு வகை (Exam Target)</label>
                            <select name="exam" id="export-exam" onchange="refreshExportPreview()" class="w-full bg-surface-container text-on-surface px-3 py-2 rounded-xl focus:outline-none text-xs border border-white/5">
                                <option value="all">அனைத்து தேர்வுகள் (All Exams)</option>
                                <option value="Group 4">TNPSC Group 4 &amp; VAO</option>
                                <option value="Group 2">TNPSC Group 2 &amp; 2A</option>
                                <option value="Group 1">TNPSC Group 1</option>
                                <option value="SI">Police &amp; SI</option>
                            </select>
                        </div>

                        <!-- Status Filter -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface">வினா நிலை (Status)</label>
                            <select name="status" id="export-status" onchange="refreshExportPreview()" class="w-full bg-surface-container text-on-surface px-3 py-2 rounded-xl focus:outline-none text-xs border border-white/5">
                                <option value="all">அனைத்தும் (Verified &amp; Pending)</option>
                                <option value="verified" selected>சரிபார்க்கப்பட்டவை மட்டும் (Verified)</option>
                                <option value="pending">நிலுவையில் உள்ளவை (Pending)</option>
                            </select>
                        </div>

                        <!-- Format Selector -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-semibold text-on-surface">ஏற்றுமதி வடிவம் (Format)</label>
                            <div class="flex bg-surface-container-lowest p-1 rounded-xl shadow-inner gap-1 border border-white/5">
                                <label class="flex-1 text-center py-2 rounded-lg bg-surface-container-high text-tertiary text-xs font-semibold cursor-pointer">
                                    <input type="radio" name="format" value="json" checked onchange="refreshExportPreview()" class="sr-only">
                                    <span>JSON கோப்பு</span>
                                </label>
                                <label class="flex-1 text-center py-2 rounded-lg text-on-surface-variant hover:text-on-surface text-xs font-medium cursor-pointer">
                                    <input type="radio" name="format" value="csv" onchange="refreshExportPreview()" class="sr-only">
                                    <span>CSV விரிதாள்</span>
                                </label>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="pt-space-xs flex flex-col gap-2">
                            <button type="submit" class="w-full py-3 rounded-xl bg-secondary-container hover:brightness-110 text-on-secondary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]">
                                <span class="material-symbols-outlined text-[20px]">file_download</span>
                                <span>கோப்பாக பதிவிறக்கு (Download File)</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right Preview Column (7 cols) -->
                <div class="lg:col-span-7 flex flex-col gap-space-md">
                    <div class="bg-surface-container-low/70 backdrop-blur-xl p-space-lg rounded-2xl shadow-lg flex flex-col gap-space-md h-full border border-white/5">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="font-headline font-bold text-sm text-on-surface">ஏற்றுமதி மாதிரிக் காட்சி (Live Export Preview)</span>
                                <span class="px-2 py-0.5 rounded-md bg-tertiary-container text-tertiary text-[11px] font-semibold">SQLite Data</span>
                            </div>
                            <span class="text-outline text-xs">Encoding: UTF-8</span>
                        </div>

                        <div class="relative flex-1 min-h-[360px] bg-surface-container-lowest/90 rounded-xl p-space-md shadow-inner flex flex-col border border-white/5 font-mono text-xs leading-relaxed text-tertiary-fixed-dim">
                            <pre class="overflow-x-auto whitespace-pre-wrap select-all" id="export-code-preview">Loading preview...</pre>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

</div>

@push('scripts')
<script>
    let currentImportFormat = 'json';

    function switchMainTab(tab) {
        const importPanel = document.getElementById('import-panel');
        const exportPanel = document.getElementById('export-panel');
        const importBtn = document.getElementById('tab-import-btn');
        const exportBtn = document.getElementById('tab-export-btn');

        if (tab === 'import') {
            importPanel.classList.remove('hidden');
            exportPanel.classList.add('hidden');
            importBtn.className = 'flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-high text-tertiary text-xs font-semibold transition-all shadow-sm';
            exportBtn.className = 'flex items-center gap-space-xs px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 text-xs font-semibold transition-all';
        } else {
            importPanel.classList.add('hidden');
            exportPanel.classList.remove('hidden');
            exportBtn.className = 'flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-high text-tertiary text-xs font-semibold transition-all shadow-sm';
            importBtn.className = 'flex items-center gap-space-xs px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 text-xs font-semibold transition-all';
            refreshExportPreview();
        }
    }

    function setImportFormat(fmt) {
        currentImportFormat = fmt;
        document.getElementById('importFormatInput').value = fmt;
        const btnJson = document.getElementById('fmt-json');
        const btnCsv = document.getElementById('fmt-csv');
        const sampleLink = document.getElementById('sampleTemplateLink');

        if (fmt === 'json') {
            btnJson.className = 'px-3 py-1 rounded text-tertiary bg-surface-container text-xs font-semibold transition-all';
            btnCsv.className = 'px-3 py-1 rounded text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all';
            sampleLink.href = "{{ route('admin.bulk.sample') }}?format=json";
        } else {
            btnCsv.className = 'px-3 py-1 rounded text-tertiary bg-surface-container text-xs font-semibold transition-all';
            btnJson.className = 'px-3 py-1 rounded text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all';
            sampleLink.href = "{{ route('admin.bulk.sample') }}?format=csv";
        }
        updateDetectStats();
    }

    function handleFileSelected(input) {
        if (input.files && input.files[0]) {
            document.getElementById('file-chosen-label').innerText = `தேர்ந்தெடுக்கப்பட்ட கோப்பு: ${input.files[0].name} (${Math.round(input.files[0].size/1024)} KB)`;
        }
    }

    function updateDetectStats() {
        const text = document.getElementById('raw-data-input').value.trim();
        let detected = 0;
        let valid = 0;
        let errors = 0;

        if (text) {
            if (currentImportFormat === 'json') {
                try {
                    const parsed = JSON.parse(text);
                    if (Array.isArray(parsed)) {
                        detected = parsed.length;
                        parsed.forEach(item => {
                            if (item.question || item.question_ta) {
                                valid++;
                            } else {
                                errors++;
                            }
                        });
                    }
                } catch(e) {
                    errors = 1;
                }
            } else {
                const lines = text.split('\n').filter(l => l.trim().length > 0);
                detected = lines.length > 0 ? lines.length - 1 : 0;
                valid = detected;
            }
        }

        document.getElementById('stat-detected').innerText = detected;
        document.getElementById('stat-valid').innerText = valid;
        document.getElementById('stat-errors').innerText = errors;
    }

    function refreshExportPreview() {
        const preview = document.getElementById('export-code-preview');
        preview.innerText = `[\n  {\n    "exam": "TNPSC",\n    "paper": "Group 4 & VAO",\n    "topic": "பொதுத்தமிழ் & தமிழ் இலக்கியம்",\n    "question_ta": "சிலப்பதிகாரத்தின் ஆசிரியர் யார்?",\n    "answer": "B",\n    "status": "verified"\n  }\n]`;
    }

    // Auto-check if hash is #export
    if (window.location.hash === '#export') {
        switchMainTab('export');
    }
</script>
@endpush
@endsection
