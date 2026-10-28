<?php

use App\Http\Controllers\Api\AttemptController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DailyQuizController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - ExamBuddy / TNPSC தோழன் REST API
| Conforms strictly to agent.md contract specifications
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => 'ExamBuddy TNPSC REST API',
        'time' => now('Asia/Kolkata')->toIso8601String(),
    ]);
});

// Authentication (Public)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Questions, Topics & PYQ papers (Public with optional auth)
Route::get('/questions', [QuestionController::class, 'index']);
Route::get('/topics', [QuestionController::class, 'topics']);
Route::get('/pyqs', [QuestionController::class, 'pyqs']);
Route::get('/leaderboard', [LeaderboardController::class, 'index']);
Route::get('/quiz/daily', [DailyQuizController::class, 'index']);

// Protected User Routes (Require Sanctum Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/quiz/daily/submit', [DailyQuizController::class, 'submit']);
    Route::post('/attempts', [AttemptController::class, 'store']);
    Route::get('/progress', [ProgressController::class, 'show']);
    Route::post('/reports', [ReportController::class, 'store']);
});
