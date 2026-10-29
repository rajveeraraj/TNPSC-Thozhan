@echo off
echo ========================================================
echo   TNPSC தோழன் - Production Docker Launcher
echo ========================================================
echo.

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH!
    echo Please install or start Docker Desktop first.
    pause
    exit /b 1
)

echo Building and starting production containers in background...
docker compose up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   All Production Containers are UP and RUNNING!
    echo ========================================================
    echo   Student Web/PWA App:  http://localhost:3000 (or http://localhost)
    echo   Admin Dashboard:      http://localhost:8000/admin
    echo   REST API Health:      http://localhost:8000/api/health
    echo   MySQL Database:       localhost:3306 (DB: tnpsc_thozhan)
    echo ========================================================
    echo.
    echo To view logs:        docker compose logs -f
    echo To stop containers:  docker compose down
) else (
    echo.
    echo [ERROR] Docker compose failed to start.
    echo Make sure Docker Desktop daemon is running.
)
pause
