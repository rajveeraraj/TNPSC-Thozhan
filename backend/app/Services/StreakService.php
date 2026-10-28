<?php

namespace App\Services;

use App\Models\Streak;
use App\Models\User;
use Carbon\Carbon;

class StreakService
{
    /**
     * Get or calculate user streak based on last active date in Asia/Kolkata.
     */
    public function getStreak(User $user): Streak
    {
        $streak = $user->streak()->firstOrCreate(
            ['user_id' => $user->id],
            ['current' => 0, 'best' => 0, 'last_date' => null]
        );

        $today = Carbon::now('Asia/Kolkata')->startOfDay();

        if ($streak->last_date) {
            $lastDate = Carbon::parse($streak->last_date, 'Asia/Kolkata')->startOfDay();
            $diffDays = $lastDate->diffInDays($today, false);

            // If more than 1 day has passed without activity, streak resets to 0
            if ($diffDays > 1) {
                $streak->current = 0;
                $streak->save();
            }
        }

        return $streak;
    }

    /**
     * Record daily quiz completion and increment streak.
     */
    public function recordDailyQuizCompletion(User $user, string $completedDate): Streak
    {
        $streak = $this->getStreak($user);
        $date = Carbon::parse($completedDate, 'Asia/Kolkata')->startOfDay();

        if (!$streak->last_date) {
            // First ever completion
            $streak->current = 1;
            $streak->best = max($streak->best, 1);
            $streak->last_date = $date->format('Y-m-d');
        } else {
            $lastDate = Carbon::parse($streak->last_date, 'Asia/Kolkata')->startOfDay();

            if ($date->equalTo($lastDate)) {
                // Already completed today, do not increment again
                return $streak;
            }

            $diffDays = $lastDate->diffInDays($date, false);

            if ($diffDays === 1) {
                // Consecutive day: increment streak
                $streak->current += 1;
            } else {
                // Missed a day: start new streak
                $streak->current = 1;
            }

            $streak->best = max($streak->best, $streak->current);
            $streak->last_date = $date->format('Y-m-d');
        }

        $streak->save();
        return $streak;
    }
}
