<?php

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\BulkController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\QuestionManagementController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - ExamBuddy / TNPSC தோழன் Admin Dashboard Suite
|--------------------------------------------------------------------------
*/

// Root redirect
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('admin.login');
});

// Authentication Routes
Route::get('/admin/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

// Protected Admin Portal
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Questions Management & Moderation
    Route::get('/questions', [QuestionManagementController::class, 'index'])->name('questions.index');
    Route::get('/questions/create', [QuestionManagementController::class, 'create'])->name('questions.create');
    Route::post('/questions', [QuestionManagementController::class, 'store'])->name('questions.store');
    Route::get('/questions/{question}/edit', [QuestionManagementController::class, 'edit'])->name('questions.edit');
    Route::put('/questions/{question}', [QuestionManagementController::class, 'update'])->name('questions.update');
    Route::delete('/questions/{question}', [QuestionManagementController::class, 'destroy'])->name('questions.destroy');
    Route::post('/questions/{question}/status', [QuestionManagementController::class, 'updateStatus'])->name('questions.status');
    Route::post('/questions/bulk-action', [QuestionManagementController::class, 'bulkAction'])->name('questions.bulkAction');

    // Bulk Import & Export Hub
    Route::get('/bulk', [BulkController::class, 'index'])->name('bulk.index');
    Route::post('/bulk/import', [BulkController::class, 'import'])->name('bulk.import');
    Route::get('/bulk/export', [BulkController::class, 'export'])->name('bulk.export');
    Route::get('/bulk/sample', [BulkController::class, 'sampleTemplate'])->name('bulk.sample');

    // Aspirant Reports Moderation
    Route::post('/reports/{report}/resolve', [AdminReportController::class, 'resolve'])->name('reports.resolve');
});
