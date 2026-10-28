<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Resolve or dismiss an aspirant report.
     */
    public function resolve(Request $request, Report $report): RedirectResponse
    {
        $status = $request->input('status', 'resolved');
        $report->update(['status' => $status]);

        return redirect()->back()->with('toast_success', 'புகார் அறிக்கை வெற்றிகரமாகத் தீர்க்கப்பட்டது.');
    }
}
