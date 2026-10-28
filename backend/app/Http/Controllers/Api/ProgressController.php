<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyResult;
use App\Services\StreakService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function __construct(
        protected StreakService $streakService
    ) {}

    /**
     * GET /api/progress
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $streak = $this->streakService->getStreak($user);

        // Calculate real accuracy from actual user attempts
        $totalAttempts = $user->attempts()->count();
        $correctAttempts = $user->attempts()->where('is_correct', true)->count();
        $accuracy = $totalAttempts > 0 ? round(($correctAttempts / $totalAttempts) * 100) : 0;

        // 14-day activity heatmap
        $heatmap = [];
        $tamilDayNames = ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச']; // 0 = Sun, 1 = Mon, etc.

        for ($i = 13; $i >= 0; $i--) {
            $date = Carbon::now('Asia/Kolkata')->subDays($i)->format('Y-m-d');
            $cDate = Carbon::parse($date, 'Asia/Kolkata');
            $dailyResult = DailyResult::where('user_id', $user->id)->where('date', $date)->first();
            $attemptCount = $user->attempts()->whereDate('created_at', $date)->count();

            $completed = ($dailyResult !== null) || ($attemptCount > 0);
            $intensity = $completed ? min(100, max(40, $attemptCount * 10)) : 0;

            $heatmap[] = [
                'day' => 14 - $i,
                'date' => $date,
                'day_name_ta' => $tamilDayNames[$cDate->dayOfWeek],
                'day_name_en' => $cDate->format('D'),
                'is_completed' => $completed,
                'is_today' => ($i === 0),
                'score' => $dailyResult ? $dailyResult->score : 0,
                'intensity' => $intensity,
            ];
        }

        return response()->json([
            'data' => [
                'user' => $user,
                'streak' => [
                    'current' => $streak->current ?? 0,
                    'best' => $streak->best ?? 0,
                    'last_date' => $streak->last_date?->format('Y-m-d'),
                ],
                'stats' => [
                    'questions_solved' => $totalAttempts,
                    'accuracy_percentage' => $accuracy,
                    'total_days_active' => DailyResult::where('user_id', $user->id)->count(),
                ],
                'heatmap' => $heatmap,
            ],
            'message' => 'பயிற்சி முன்னேற்றம் பெறப்பட்டது',
        ]);
    }
}
