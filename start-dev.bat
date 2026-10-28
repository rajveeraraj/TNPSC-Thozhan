@echo off
echo ========================================================
echo   TNPSC தோழன் (ExamBuddy) - Full-Stack Launcher
echo ========================================================
echo.
echo Starting Laravel 12 Backend API on http://127.0.0.1:8000 ...
start "TNPSC Backend API (Laravel)" cmd /k "cd backend && php artisan serve --port=8000"

echo Starting Vite Frontend PWA on http://localhost:3000 ...
start "TNPSC Frontend PWA (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started!
echo Frontend: http://localhost:3000
echo Backend API: http://127.0.0.1:8000/api/health
echo ========================================================
