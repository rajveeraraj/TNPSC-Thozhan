@echo off
echo ========================================================
echo   TNPSC தோழன் (ExamBuddy) - Full-Stack Launcher
echo ========================================================
echo.
:: Ensure MySQL is running
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo Starting MySQL Server (XAMPP)...
    start "" /b "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 2 /nobreak >nul
) else (
    echo MySQL is already running on port 3306.
)

echo Starting Laravel Backend API on http://127.0.0.1:8000 ...
start "TNPSC Backend API (Laravel)" cmd /k "cd backend && php artisan serve --host=0.0.0.0 --port=8000"

echo Starting Vite Frontend PWA on http://localhost:3000 ...
start "TNPSC Frontend PWA (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers and MySQL are active!
echo Frontend: http://localhost:3000
echo Backend API: http://127.0.0.1:8000/api/health
echo Admin: http://127.0.0.1:8000/admin
echo ========================================================
