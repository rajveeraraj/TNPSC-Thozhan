<?php

namespace App\Services;

use App\Models\DailyResult;
use App\Models\Question;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DailyQuizService
{
    /**
     * Get today's 10 daily quiz questions, seeded deterministically by date in Asia/Kolkata.
     */
    public function getTodayQuiz(?User $user = null): array
    {
        $today = Carbon::now('Asia/Kolkata')->format('Y-m-d');
        $seed = crc32($today);

        // Fetch all verified questions
        $allQuestions = Question::where('review_status', 'verified')->get();

        if ($allQuestions->isEmpty()) {
            // Fallback to all questions if none explicitly marked verified
            $allQuestions = Question::all();
        }

        // Deterministic shuffle using date seed
        $shuffled = $allQuestions->sortBy(function ($question) use ($seed) {
            return crc32($seed . '_' . $question->id);
        })->values();

        $selectedQuestions = $shuffled->take(10);

        $isCompletedToday = false;
        if ($user) {
            $isCompletedToday = DailyResult::where('user_id', $user->id)
                ->where('date', $today)
                ->exists();
        }

        return [
            'quiz_id' => crc32('daily_' . $today),
            'date' => $today,
            'title' => 'நாள் #' . Carbon::now('Asia/Kolkata')->dayOfYear . ' - சிறப்பு மாதிரித் தேர்வு',
            'subtitle' => '10 கேள்விகள் • 10 நிமிடங்கள் • பொது தமிழ் & பொது அறிவு',
            'time_limit_seconds' => 600,
            'total_questions' => $selectedQuestions->count(),
            'is_completed_today' => $isCompletedToday,
            'questions' => $selectedQuestions,
        ];
    }

    /**
     * Submit today's quiz answers, record daily result, and update streak.
     */
    public function submitQuiz(User $user, array $answers, StreakService $streakService): array
    {
        $today = Carbon::now('Asia/Kolkata')->format('Y-m-d');
        $todayQuiz = $this->getTodayQuiz($user);
        /** @var Collection $questions */
        $questions = $todayQuiz['questions'];

        $score = 0;
        $total = $questions->count();
        $details = [];

        // Normalize answers input whether sent as array of objects [{question_id, selected_option}] or key-value map
        $normalizedAnswers = [];
        foreach ($answers as $key => $val) {
            if (is_array($val)) {
                $qId = $val['question_id'] ?? $key;
                $opt = $val['selected_option'] ?? $val['answer'] ?? null;
                if ($qId !== null && $opt !== null) {
                    $normalizedAnswers[(int) $qId] = is_string($opt) ? trim($opt) : (string) $opt;
                }
            } elseif (is_string($val)) {
                $normalizedAnswers[(int) $key] = trim($val);
            }
        }

        foreach ($questions as $question) {
            $userAnswer = $normalizedAnswers[$question->id] ?? null;
            $isCorrect = ($userAnswer !== null && is_string($userAnswer) && strtoupper($userAnswer) === strtoupper($question->answer));

            if ($isCorrect) {
                $score++;
            }

            // Record question attempt
            $user->attempts()->create([
                'question_id' => $question->id,
                'selected_option' => $userAnswer,
                'is_correct' => $isCorrect,
            ]);

            $details[] = [
                'question_id' => $question->id,
                'selected_option' => $userAnswer,
                'correct_option' => $question->answer,
                'is_correct' => $isCorrect,
                'explanation' => $question->explanation,
            ];
        }

        // Record or update daily result
        $dailyResult = DailyResult::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            ['score' => $score, 'total' => $total]
        );

        // Update streak
        $streak = $streakService->recordDailyQuizCompletion($user, $today);

        $accuracy = $total > 0 ? round(($score / $total) * 100) : 0;

        return [
            'score' => $score,
            'total' => $total,
            'percentage' => $accuracy,
            'accuracy_percentage' => $accuracy,
            'streak' => [
                'current' => $streak->current,
                'best' => $streak->best,
                'last_date' => $streak->last_date?->format('Y-m-d'),
                'is_completed_today' => true,
            ],
            'details' => $details,
            'results' => $details,
        ];
    }
}
