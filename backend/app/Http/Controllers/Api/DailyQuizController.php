<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DailyQuizService;
use App\Services\StreakService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyQuizController extends Controller
{
    public function __construct(
        protected DailyQuizService $dailyQuizService,
        protected StreakService $streakService
    ) {}

    /**
     * GET /api/quiz/daily
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $quizData = $this->dailyQuizService->getTodayQuiz($user);

        return response()->json([
            'data' => $quizData,
            'message' => 'இன்றைய மாதிரித் தேர்வு வினாக்கள் பெறப்பட்டன',
        ]);
    }

    /**
     * POST /api/quiz/daily/submit
     */
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'time_taken_seconds' => 'nullable|integer',
        ]);

        $user = $request->user();
        $result = $this->dailyQuizService->submitQuiz(
            $user,
            $validated['answers'],
            $this->streakService
        );

        return response()->json([
            'data' => $result,
            'message' => 'தேர்வு சமர்ப்பிக்கப்பட்டது! உங்கள் தொடர்ச்சி புதுப்பிக்கப்பட்டது.',
        ]);
    }
}
