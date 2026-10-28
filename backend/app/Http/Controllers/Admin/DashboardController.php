<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Report;
use App\Models\User;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Display the main Admin Command Center Overview.
     */
    public function index(): View
    {
        $totalQuestions = Question::count();
        $verifiedQuestions = Question::where('review_status', 'verified')->count();
        $pendingQuestions = Question::where('review_status', 'pending')->count();
        $flaggedQuestions = Question::whereIn('review_status', ['flagged', 'disputed'])->count()
            + Report::where('status', 'pending')->count();

        // Calculate percentages
        $verifiedPercent = $totalQuestions > 0 ? round(($verifiedQuestions / $totalQuestions) * 100, 1) : 0;
        $pendingPercent = $totalQuestions > 0 ? round(($pendingQuestions / $totalQuestions) * 100, 1) : 0;
        $flaggedPercent = $totalQuestions > 0 ? round(($flaggedQuestions / $totalQuestions) * 100, 1) : 0;

        // Topics breakdown from real questions
        $topicsData = Question::selectRaw('topic, count(*) as count')
            ->groupBy('topic')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) use ($totalQuestions) {
                $percentage = $totalQuestions > 0 ? round(($item->count / $totalQuestions) * 100, 1) : 0;
                return [
                    'topic' => $item->topic,
                    'count' => $item->count,
                    'percentage' => $percentage,
                ];
            });

        // Exam distribution
        $examGroups = [
            'Group 4 & VAO' => Question::where(function ($q) {
                $q->where('paper', 'like', '%Group 4%')->orWhere('paper', 'like', '%VAO%');
            })->count(),
            'Group 2 & 2A' => Question::where('paper', 'like', '%Group 2%')->count(),
            'Group 1 (Prelims)' => Question::where('paper', 'like', '%Group 1%')->count(),
            'Police / SI (TNUSRB)' => Question::where(function ($q) {
                $q->where('paper', 'like', '%SI%')->orWhere('paper', 'like', '%Police%');
            })->count(),
        ];

        // Fill other questions if any
        $categorizedCount = array_sum($examGroups);
        if ($categorizedCount < $totalQuestions) {
            $examGroups['Group 4 & VAO'] += ($totalQuestions - $categorizedCount);
        }

        // Recent reports / complaints from aspirants
        $recentReports = Report::with(['user', 'question'])
            ->where('status', 'pending')
            ->latest()
            ->take(8)
            ->get();

        return view('admin.dashboard', compact(
            'totalQuestions',
            'verifiedQuestions',
            'pendingQuestions',
            'flaggedQuestions',
            'verifiedPercent',
            'pendingPercent',
            'flaggedPercent',
            'topicsData',
            'examGroups',
            'recentReports'
        ));
    }
}
