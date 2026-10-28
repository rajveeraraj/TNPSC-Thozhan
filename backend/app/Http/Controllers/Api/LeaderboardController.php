<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyResult;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    /**
     * GET /api/leaderboard
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type', 'daily'); // daily or weekly
        $today = Carbon::now('Asia/Kolkata')->format('Y-m-d');

        $results = DailyResult::with(['user.streak'])
            ->where('date', $today)
            ->orderByDesc('score')
            ->take(50)
            ->get();

        $rankings = [];
        $rank = 1;
        foreach ($results as $res) {
            $user = $res->user;
            $rankings[] = [
                'rank' => $rank++,
                'name' => $user->name ?? 'போட்டியாளர்',
                'aspirant_id' => $user->aspirant_id ?? 'TNPSC-2024',
                'score' => $res->score,
                'time_taken_seconds' => $res->time_taken_seconds ?? 180,
                'streak' => $user->streak?->current ?? 1,
            ];
        }

        return response()->json([
            'data' => [
                'type' => $type,
                'date' => $today,
                'rankings' => $rankings,
            ],
            'message' => 'தரவரிசை பட்டியல் பெறப்பட்டது',
        ]);
    }
}
