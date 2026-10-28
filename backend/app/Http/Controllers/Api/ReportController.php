<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * POST /api/reports
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'reason' => 'required|string|max:500',
        ]);

        $report = $request->user()->reports()->create([
            'question_id' => $validated['question_id'],
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return response()->json([
            'data' => $report,
            'message' => 'வினா பிழை புகார் பதிவு செய்யப்பட்டது. விரைவில் சரிபார்க்கப்படும்.',
        ], 201);
    }
}
