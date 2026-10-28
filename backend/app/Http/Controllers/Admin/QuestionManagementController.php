<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class QuestionManagementController extends Controller
{
    /**
     * Display a filtered list of questions with moderation controls.
     */
    public function index(Request $request): View
    {
        $query = Question::query();

        // Search by keyword or ID
        if ($request->filled('search')) {
            $search = trim($request->search);
            // Handle ID search like #TN-123 or 123
            $idSearch = preg_replace('/[^0-9]/', '', $search);
            $query->where(function ($q) use ($search, $idSearch) {
                if (!empty($idSearch)) {
                    $q->orWhere('id', $idSearch);
                }
                $q->orWhere('question_ta', 'like', "%{$search}%")
                  ->orWhere('question_en', 'like', "%{$search}%")
                  ->orWhere('explanation', 'like', "%{$search}%");
            });
        }

        // Filter by Status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('review_status', $request->status);
        }

        // Filter by Topic
        if ($request->filled('topic') && $request->topic !== 'all') {
            $query->where('topic', $request->topic);
        }

        // Filter by Exam / Paper
        if ($request->filled('exam') && $request->exam !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('paper', 'like', "%{$request->exam}%")
                  ->orWhere('exam', 'like', "%{$request->exam}%");
            });
        }

        // Filter by Year
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year', $request->year);
        }

        $questions = $query->latest()->paginate(15)->withQueryString();

        // Top metric counts
        $totalCount = Question::count();
        $pendingCount = Question::where('review_status', 'pending')->count();
        $verifiedCount = Question::where('review_status', 'verified')->count();
        $flaggedCount = Question::whereIn('review_status', ['flagged', 'disputed'])->count();

        // Available filter dropdown options
        $availableTopics = Question::select('topic')->distinct()->pluck('topic');
        $availableYears = Question::select('year')->whereNotNull('year')->distinct()->orderByDesc('year')->pluck('year');

        return view('admin.questions.index', compact(
            'questions',
            'totalCount',
            'pendingCount',
            'verifiedCount',
            'flaggedCount',
            'availableTopics',
            'availableYears'
        ));
    }

    /**
     * Show form for creating a new question.
     */
    public function create(): View
    {
        return view('admin.questions.form', [
            'question' => new Question(),
            'isEdit' => false,
        ]);
    }

    /**
     * Store a newly created question in SQLite.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateQuestion($request);

        $options = $this->formatOptionsFromRequest($request);
        $validated['options'] = $options;

        $question = Question::create($validated);

        if ($request->has('save_and_next')) {
            return redirect()->route('admin.questions.create')
                ->with('toast_success', "வினா #TN-{$question->id} வெற்றிகரமாகச் சேர்க்கப்பட்டது! அடுத்த வினாவை உள்ளிடவும்.");
        }

        return redirect()->route('admin.questions.index')
            ->with('toast_success', "வினா #TN-{$question->id} வெற்றிகரமாகச் சேர்க்கப்பட்டது!");
    }

    /**
     * Show form for editing an existing question.
     */
    public function edit(Question $question): View
    {
        return view('admin.questions.form', [
            'question' => $question,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the question in SQLite.
     */
    public function update(Request $request, Question $question): RedirectResponse
    {
        $validated = $this->validateQuestion($request);

        $options = $this->formatOptionsFromRequest($request);
        $validated['options'] = $options;

        $question->update($validated);

        return redirect()->route('admin.questions.index')
            ->with('toast_success', "வினா #TN-{$question->id} வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது!");
    }

    /**
     * Delete a question from SQLite.
     */
    public function destroy(Question $question): RedirectResponse
    {
        $id = $question->id;
        $question->delete();

        return redirect()->back()
            ->with('toast_success', "வினா #TN-{$id} நீக்கப்பட்டது.");
    }

    /**
     * Quick status update for a question.
     */
    public function updateStatus(Request $request, Question $question): RedirectResponse
    {
        $status = $request->validate([
            'status' => ['required', 'in:verified,pending,flagged'],
        ])['status'];

        $question->update(['review_status' => $status]);

        $statusText = match ($status) {
            'verified' => 'சரிபார்க்கப்பட்டது என குறிக்கப்பட்டது',
            'flagged' => 'மறுஆய்வுக்கு கொடியிடப்பட்டது',
            'pending' => 'நிலுவை நிலைக்கு மாற்றப்பட்டது',
        };

        return redirect()->back()
            ->with('toast_success', "வினா #TN-{$question->id} {$statusText}.");
    }

    /**
     * Execute bulk actions on selected questions.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'action' => ['required', 'in:verify,flag,delete'],
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:questions,id'],
        ]);

        $ids = $data['ids'];
        $count = count($ids);

        switch ($data['action']) {
            case 'verify':
                Question::whereIn('id', $ids)->update(['review_status' => 'verified']);
                $msg = "{$count} வினாக்கள் சரிபார்க்கப்பட்டன.";
                break;
            case 'flag':
                Question::whereIn('id', $ids)->update(['review_status' => 'flagged']);
                $msg = "{$count} வினாக்கள் கொடியிடப்பட்டன.";
                break;
            case 'delete':
                Question::whereIn('id', $ids)->delete();
                $msg = "{$count} வினாக்கள் நீக்கப்பட்டன.";
                break;
            default:
                $msg = "செயல்பாடு முடிந்தது.";
        }

        return redirect()->back()->with('toast_success', $msg);
    }

    /**
     * Common validation rules.
     */
    protected function validateQuestion(Request $request): array
    {
        return $request->validate([
            'exam' => ['required', 'string', 'max:100'],
            'year' => ['nullable', 'integer'],
            'paper' => ['required', 'string', 'max:255'],
            'topic' => ['required', 'string', 'max:255'],
            'question_ta' => ['required', 'string'],
            'question_en' => ['nullable', 'string'],
            'answer' => ['required', 'in:A,B,C,D'],
            'explanation' => ['required', 'string'],
            'source_pdf' => ['nullable', 'string', 'max:255'],
            'review_status' => ['required', 'in:verified,pending,flagged'],
        ], [
            'question_ta.required' => 'வினா உரை (தமிழ்) கட்டாயமாகும்.',
            'paper.required' => 'தேர்வுத் தாளைத் தேர்ந்தெடுக்கவும்.',
            'topic.required' => 'பாடத்திட்ட அலகைத் தேர்ந்தெடுக்கவும்.',
            'answer.required' => 'சரியான விடையைத் தேர்ந்தெடுக்கவும்.',
            'explanation.required' => 'விளக்கக் குறிப்பை உள்ளிடவும்.',
        ]);
    }

    /**
     * Format options array with A, B, C, D keys and Tamil/English text.
     */
    protected function formatOptionsFromRequest(Request $request): array
    {
        $keys = ['A' => 'அ', 'B' => 'ஆ', 'C' => 'இ', 'D' => 'ஈ'];
        $options = [];

        foreach ($keys as $code => $label) {
            $textTa = $request->input("option_{$code}_ta", '');
            $textEn = $request->input("option_{$code}_en", '');

            $options[] = [
                'id' => $code,
                'label' => $label,
                'text_ta' => $textTa,
                'text_en' => $textEn,
            ];
        }

        return $options;
    }
}
