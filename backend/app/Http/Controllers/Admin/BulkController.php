<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BulkController extends Controller
{
    /**
     * Display the Bulk Import & Export Hub.
     */
    public function index(): View
    {
        $availableTopics = Question::select('topic')->distinct()->pluck('topic');

        return view('admin.bulk', compact('availableTopics'));
    }

    /**
     * Process bulk import from file upload or raw pasted text.
     */
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'import_file' => ['nullable', 'file', 'max:15360'], // 15MB max
            'raw_input' => ['nullable', 'string'],
            'format' => ['required', 'in:json,csv'],
            'default_status' => ['required', 'in:pending,verified'],
        ]);

        $content = '';
        if ($request->hasFile('import_file')) {
            $content = file_get_contents($request->file('import_file')->getRealPath());
        } elseif ($request->filled('raw_input')) {
            $content = trim($request->raw_input);
        }

        if (empty($content)) {
            return back()->withErrors(['import_file' => 'இறக்குமதி செய்ய கோப்பைத் தேர்ந்தெடுக்கவும் அல்லது தரவை ஒட்டவும்.']);
        }

        $skipDuplicates = $request->boolean('skip_duplicates', true);
        $defaultStatus = $request->input('default_status', 'pending');
        $format = $request->input('format', 'json');

        $imported = 0;
        $skipped = 0;

        try {
            if ($format === 'json') {
                $data = json_decode($content, true);
                if (!is_array($data)) {
                    throw new \Exception('செல்லுபடியாகாத JSON வடிவம்.');
                }

                foreach ($data as $item) {
                    $qTa = $item['question'] ?? $item['question_ta'] ?? null;
                    if (!$qTa) continue;

                    if ($skipDuplicates && Question::where('question_ta', trim($qTa))->exists()) {
                        $skipped++;
                        continue;
                    }

                    $options = [];
                    $rawOpts = $item['options'] ?? [];
                    $keys = ['A' => 'அ', 'B' => 'ஆ', 'C' => 'இ', 'D' => 'ஈ'];
                    $i = 0;
                    foreach ($keys as $code => $label) {
                        $optText = is_array($rawOpts) && isset($rawOpts[$i]) ? $rawOpts[$i] : '';
                        $options[] = [
                            'id' => $code,
                            'label' => $label,
                            'text_ta' => is_array($optText) ? ($optText['text_ta'] ?? '') : (string)$optText,
                            'text_en' => is_array($optText) ? ($optText['text_en'] ?? '') : '',
                        ];
                        $i++;
                    }

                    $answer = $item['answer'] ?? 'A';
                    if (is_numeric($answer)) {
                        $answerMap = [0 => 'A', 1 => 'B', 2 => 'C', 3 => 'D'];
                        $answer = $answerMap[(int)$answer] ?? 'A';
                    } else {
                        $answer = strtoupper(trim((string)$answer));
                        if (!in_array($answer, ['A', 'B', 'C', 'D'])) {
                            $answer = 'A';
                        }
                    }

                    Question::create([
                        'exam' => $item['exam'] ?? 'TNPSC',
                        'year' => isset($item['year']) ? (int)$item['year'] : 2024,
                        'paper' => $item['paper'] ?? 'Group 4 & VAO',
                        'topic' => $item['topic'] ?? $item['unit'] ?? 'பொதுத்தமிழ்',
                        'question_ta' => trim($qTa),
                        'question_en' => $item['question_en'] ?? null,
                        'options' => $options,
                        'answer' => $answer,
                        'explanation' => $item['explanation'] ?? 'விளக்கம் சேர்க்கப்படவில்லை.',
                        'source_pdf' => $item['source'] ?? $item['source_pdf'] ?? 'சமச்சீர் பாடநூல்',
                        'review_status' => $item['status'] ?? $defaultStatus,
                    ]);

                    $imported++;
                }
            } else {
                // CSV parsing
                $lines = array_filter(array_map('trim', explode("\n", $content)));
                if (count($lines) < 2) {
                    throw new \Exception('CSV கோப்பில் போதுமான வரிசைகள் இல்லை.');
                }

                $header = str_getcsv(array_shift($lines));
                foreach ($lines as $line) {
                    if (empty($line)) continue;
                    $row = str_getcsv($line);
                    if (count($row) < 5) continue;

                    $qTa = trim($row[0]);
                    if ($skipDuplicates && Question::where('question_ta', $qTa)->exists()) {
                        $skipped++;
                        continue;
                    }

                    $options = [
                        ['id' => 'A', 'label' => 'அ', 'text_ta' => $row[1] ?? '', 'text_en' => ''],
                        ['id' => 'B', 'label' => 'ஆ', 'text_ta' => $row[2] ?? '', 'text_en' => ''],
                        ['id' => 'C', 'label' => 'இ', 'text_ta' => $row[3] ?? '', 'text_en' => ''],
                        ['id' => 'D', 'label' => 'ஈ', 'text_ta' => $row[4] ?? '', 'text_en' => ''],
                    ];

                    $rawAns = strtoupper(trim($row[5] ?? 'A'));
                    $ans = in_array($rawAns, ['A', 'B', 'C', 'D']) ? $rawAns : 'A';
                    $topic = $row[6] ?? 'பொதுத்தமிழ்';

                    Question::create([
                        'exam' => 'TNPSC',
                        'year' => 2024,
                        'paper' => 'Group 4 & VAO',
                        'topic' => $topic,
                        'question_ta' => $qTa,
                        'question_en' => null,
                        'options' => $options,
                        'answer' => $ans,
                        'explanation' => $row[7] ?? 'விளக்கம் சேர்க்கப்படவில்லை.',
                        'source_pdf' => 'சமச்சீர் பாடநூல்',
                        'review_status' => $defaultStatus,
                    ]);

                    $imported++;
                }
            }
        } catch (\Throwable $e) {
            return back()->withErrors(['import_file' => 'பிழை: ' . $e->getMessage()]);
        }

        $msg = "{$imported} வினாக்கள் வெற்றிகரமாகத் தரவுத்தளத்தில் சேர்க்கப்பட்டன!";
        if ($skipped > 0) {
            $msg .= " ({$skipped} நகல்கள் தவிர்க்கப்பட்டன)";
        }

        return redirect()->route('admin.questions.index')->with('toast_success', $msg);
    }

    /**
     * Export questions to JSON or CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $query = Question::query();

        if ($request->filled('topic') && $request->topic !== 'all') {
            $query->where('topic', $request->topic);
        }

        if ($request->filled('exam') && $request->exam !== 'all') {
            $query->where('paper', 'like', "%{$request->exam}%");
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('review_status', $request->status);
        }

        $format = $request->input('format', 'json');
        $filename = 'tnpsc_questions_' . date('Y_m_d_His') . '.' . $format;

        $questions = $query->get();

        if ($format === 'json') {
            $exportData = $questions->map(function ($q) {
                return [
                    'id' => "TNPSC-{$q->id}",
                    'exam' => $q->exam,
                    'year' => $q->year,
                    'paper' => $q->paper,
                    'topic' => $q->topic,
                    'question_ta' => $q->question_ta,
                    'question_en' => $q->question_en,
                    'options' => $q->options,
                    'answer' => $q->answer,
                    'explanation' => $q->explanation,
                    'source' => $q->source_pdf,
                    'status' => $q->review_status,
                ];
            });

            return Response::stream(function () use ($exportData) {
                echo json_encode($exportData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }, 200, [
                'Content-Type' => 'application/json; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        }

        // CSV format with UTF-8 BOM
        return Response::stream(function () use ($questions) {
            $handle = fopen('php://output', 'w');
            // Write UTF-8 BOM so Excel displays Tamil correctly
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, ['ID', 'Exam', 'Year', 'Paper', 'Topic', 'Question (Tamil)', 'Question (English)', 'Option A', 'Option B', 'Option C', 'Option D', 'Answer', 'Explanation', 'Status']);

            foreach ($questions as $q) {
                $opts = $q->options ?? [];
                fputcsv($handle, [
                    $q->id,
                    $q->exam,
                    $q->year,
                    $q->paper,
                    $q->topic,
                    $q->question_ta,
                    $q->question_en ?? '',
                    $opts[0]['text_ta'] ?? '',
                    $opts[1]['text_ta'] ?? '',
                    $opts[2]['text_ta'] ?? '',
                    $opts[3]['text_ta'] ?? '',
                    $q->answer,
                    $q->explanation,
                    $q->review_status,
                ]);
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Download sample template.
     */
    public function sampleTemplate(Request $request): StreamedResponse
    {
        $format = $request->query('format', 'json');
        $filename = 'tnpsc_sample_template.' . $format;

        if ($format === 'json') {
            $sample = [
                [
                    'question' => 'சிலப்பதிகாரத்தின் ஆசிரியர் யார்?',
                    'options' => ['சீத்தலைச் சாத்தனார்', 'இளங்கோவடிகள்', 'கம்பர்', 'திருவள்ளுவர்'],
                    'answer' => 1,
                    'unit' => 'பொதுத்தமிழ்',
                    'exam' => 'TNPSC Group 4',
                    'year' => 2024,
                    'explanation' => 'சிலப்பதிகாரத்தை இயற்றியவர் இளங்கோவடிகள் ஆவார்.',
                ],
            ];

            return Response::stream(function () use ($sample) {
                echo json_encode($sample, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }, 200, [
                'Content-Type' => 'application/json; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        }

        return Response::stream(function () {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, ['question', 'option1', 'option2', 'option3', 'option4', 'answer', 'unit', 'explanation']);
            fputcsv($handle, ['இந்திய அரசியலமைப்பின் வரைவுக்குழு தலைவர் யார்?', 'ஜவஹர்லால் நேரு', 'டாக்டர் அம்பேத்கர்', 'சர்தார் படேல்', 'ராஜேந்திர பிரசாத்', 'B', 'இந்திய ஆட்சியியல்', 'வரைவுக்குழு தலைவர் டாக்டர் அம்பேத்கர்.']);
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
