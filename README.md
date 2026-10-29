# TNPSC தோழன் (ExamBuddy) — Full-Stack Application

**TNPSC தோழன்** is a high-performance, dark glassmorphic Progressive Web Application (PWA) tailored specifically for TNPSC aspirants (Group 4, Group 2, Group 1, and VAO). It implements the exact design system from Google Stitch project `1469633910251393858` and connects a React 18 / Vite / Tailwind frontend with a robust Laravel 12 / SQLite / Sanctum backend API.

---

## 📂 Project Architecture

```
TNPSC தோழன்/
├── backend/                       # Laravel 12 REST API Server (PHP 8.2+)
│   ├── app/
│   │   ├── Http/Controllers/Api/  # Auth, DailyQuiz, Question, Progress, Leaderboard, Report
│   │   ├── Models/                # User, Question, Attempt, DailyResult, Streak, Report, Subscription
│   │   └── Services/              # DailyQuizService (Asia/Kolkata deterministic PRNG), StreakService, OtpService
│   ├── database/
│   │   ├── database.sqlite        # Active SQLite database
│   │   ├── migrations/            # 8 database migrations
│   │   └── seeders/               # QuestionSeeder (Real Tamil questions & demo user)
│   ├── routes/
│   │   └── api.php                # REST API Routes (/api/*)
│   ├── config/
│   │   ├── cors.php               # Cross-Origin Resource Sharing config
│   │   └── sanctum.php            # Laravel Sanctum token auth config
│   └── tests/Feature/             # 12 passing backend tests (160 assertions)
│
├── frontend/                      # React 18 + Vite + TypeScript PWA
│   ├── src/
│   │   ├── api/                   # apiClient, quizService, questionService, progressService
│   │   ├── components/            # Header, BottomNav, OfflineBanner, ToastContainer
│   │   ├── pages/                 # SignInPage, SignUpPage, HomePage, QuizPage, PracticePage, ProfilePage
│   │   ├── store/                 # authStore, quizStore, practiceStore
│   │   └── tokens.ts              # Stitch theme tokens (#051424 canvas, Saffron Gold, Emerald Green)
│   ├── vite.config.ts             # Vite dev server + proxy (/api -> http://127.0.0.1:8000)
│   └── src/test/                  # 212 passing unit & integration tests
│
└── start-dev.bat                  # One-click dual-server launcher
```

---

## 🔌 Connecting Frontend to Backend

1. **Proxy Configuration**:
   - `frontend/vite.config.ts` proxies all `/api` requests to `http://127.0.0.1:8000`.
   - In production or custom hosts, configure `VITE_API_BASE_URL` in `frontend/.env`.

2. **Authentication Flow (Sanctum Tokens)**:
   - **Initial Load**: If unauthenticated, user is presented with the **உள்நுழைவு (Sign In)** page.
   - **New User**: Click link to navigate to **புதிய பதிவு (Sign Up)**.
   - On login or register, Laravel issues a Bearer token via `createToken('auth-token')`.
   - The token is saved in `localStorage` (`tnpsc_auth_token`) and attached to every API request via `Authorization: Bearer <token>`.
   - After authentication, the user is navigated directly into **முகப்பு (Home)**.

## 🔌 Fresh User Workflow (No Sample Data)

1. **Clean State**:
   - Database has **0 users**, **0 streaks**, **0 attempts**, and **0 fake results**.
   - Only the syllabus question papers and verified exam questions exist in the study bank.

2. **First-Time Sign Up**:
   - Open `http://localhost:3000`.
   - The app opens directly to **உள்நுழைவு (Sign In)**.
   - Click **"புதிய பயனர் கணக்கா? புதிய பதிவு செய்க (Sign Up)"**.
   - Enter your name, mobile number (+91), password, target exam (e.g., Group 4 & VAO), and medium.
   - Click **"பதிவு செய்து தொடங்குக"**.
   - A real account is registered in SQLite with a unique aspirant ID (`TNPSC-2026-XXXX`).

3. **Real Profile & Analytics**:
   - Solved count starts from **0**.
   - Streak starts from **0** (increments to 1 after completing today's daily quiz).
   - Accuracy is computed live from your actual question attempts.
   - 14-day heatmap shows your real activity.

---

## 🚀 How to Run the Application

### Option A: One-Click Launcher (Windows)
Double-click `start-dev.bat` or run:
```cmd
.\start-dev.bat
```

### Option B: Manual Execution

#### 1. Start Laravel Backend (Terminal 1)
```bash
cd backend
php artisan serve --port=8000
```
- Health Check: `http://127.0.0.1:8000/api/health`

#### 2. Start Vite Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
- Open browser at: `http://localhost:3000`

### Option C: Production Docker Deployment (Recommended for Production)

#### 1. Multi-Container Orchestration (Frontend + Backend + MySQL + Redis)
Run with Docker Compose:
```bash
docker compose up -d --build
```
Or double-click `docker-start.bat` on Windows.
- **Frontend App**: `http://localhost:3000` (or `http://localhost:80`)
- **Admin Dashboard**: `http://localhost:8000/admin`
- **Backend API**: `http://localhost:8000/api/health`
- **MySQL DB**: `localhost:3306` (`tnpsc_thozhan`)

#### 2. Single-Container Cloud Deployment (Cloud Run / Render / Railway / Fly.io)
Deploy the root `Dockerfile` which packages both the compiled React PWA and Laravel backend with Nginx & PHP-FPM:
```bash
docker build -t tnpsc-thozhan:latest .
docker run -p 80:80 -e DB_CONNECTION=sqlite -e APP_KEY=base64:... tnpsc-thozhan:latest
```

---

## 🧪 Verification & Test Results

- **Frontend**: 212 / 212 Vitest tests passing across 10 test files.
- **Backend**: 12 / 12 PHPUnit / Laravel feature tests passing (160 assertions).
- **TypeScript**: 0 type errors (`tsc --noEmit`).
- **Production Build**: Clean `frontend/dist/` bundle created.
