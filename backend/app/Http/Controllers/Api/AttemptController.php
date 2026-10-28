<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttemptController extends Controller
{
    /**
     * POST /api/attempts
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_option' => 'required|string|size:1',
        ]);

        $question = Question::findOrFail($validated['question_id']);
        $isCorrect = (strtoupper($validated['selected_option']) === strtoupper($question->answer));

        $attempt = $request->user()->attempts()->create([
            'question_id' => $question->id,
            'selected_option' => $validated['selected_option'],
            'is_correct' => $isCorrect,
        ]);

        return response()->json([
            'data' => [
                'attempt_id' => $attempt->id,
                'is_correct' => $isCorrect,
                'correct_answer' => $question->answer,
                'explanation' => $question->explanation,
            ],
            'message' => $isCorrect ? 'சரியான விடை! 🎉' : 'தவறான விடை. சரியான விடையை கவனிக்கவும்.',
        ]);
    }
}
