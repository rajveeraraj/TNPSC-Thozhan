# agent.md: ExamBuddy

Instructions for the coding agent working on this repository. Read this fully before making changes.

---

## 1. Project Overview

**Product name:** ExamBuddy (use this exact name in the UI, app title, manifest, and docs). Earlier working name: TNPSC தோழன்.

A Tamil-first exam preparation web app. First launch exam: TNPSC. Keep the design exam-agnostic so UPSC, SSC, Banking, and other state PSC exams can be added later (the `exam` field on questions already supports this).

- Daily quiz (10 questions, same set for all users each day)
- Topic-wise practice
- Previous year questions (PYQ) with filters
- Streak tracking and progress

**Target users:** Group 4, Group 2/2A, Group 1, VAO aspirants in Tamil Nadu.

**Prototype reference:** https://claude.ai/artifact/2NHcDo4XXQFbJpRZtd3u2A (single-file HTML, localStorage). Port its UI and logic to use the API.
**Question CRM prototype:** https://claude.ai/artifact/CrxG2L1e7aY2eLoSugkdJk

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Backend | Laravel (REST API), PHP 8.2+, MySQL |
| Admin / CRM | Filament (Laravel) |
| Auth | JWT (phone OTP / Google) |
| Frontend | React + Vite + TypeScript, PWA, mobile-first |
| Notifications | Firebase Cloud Messaging |
| Payments | Razorpay / UPI (Phase 2) |

Backend and frontend are **separate apps** that talk only through the REST API.

---

## 3. Repository Layout

```
exambuddy/
├── backend/     Laravel API + Filament admin
├── frontend/    React PWA
├── data/        PYQ pipeline (raw_pdfs, scripts, output)
├── docs/
└── agent.md
```

### backend/
```
app/Http/Controllers/Api/   Auth, DailyQuiz, Question, Attempt, Progress, Leaderboard, Report
app/Http/Requests/          Form validation
app/Http/Resources/         JSON responses
app/Models/                 User, Question, Attempt, DailyResult, Streak, Report, Subscription
app/Services/               DailyQuizService, StreakService, OtpService
app/Console/Commands/       ImportQuestions (JSON/CSV -> DB)
app/Filament/Resources/     QuestionResource (admin CRM)
database/                   migrations, seeders, factories
routes/api.php
tests/Feature/
```

### frontend/
```
src/api/          client.ts (axios + JWT), auth.ts, quiz.ts, progress.ts
src/pages/        Login, Daily, Practice, Pyq, Progress, Leaderboard
src/components/   QuestionCard, OptionButton, StreakCard, TopicChips, BottomNav
src/store/        authStore.ts, quizStore.ts
src/i18n/ta.json  Tamil strings
src/styles/       theme.css (light/dark tokens)
public/           manifest.webmanifest, icons
```

---

## 4. Database Schema

| Table | Fields |
|---|---|
| users | id, name, phone, email, created_at |
| questions | id, exam, year, paper, topic, question_ta, question_en, options (json), answer, explanation, source_pdf, review_status |
| attempts | id, user_id, question_id, is_correct, created_at |
| daily_results | id, user_id, date, score, total |
| streaks | user_id, current, best, last_date |
| reports | id, user_id, question_id, reason, status |
| subscriptions | id, user_id, plan, starts_at, ends_at |

Use migrations for every schema change. Use `utf8mb4` for Tamil text.

---

## 5. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/login | Login / OTP verify |
| GET | /quiz/daily | Today's 10 questions |
| POST | /quiz/daily/submit | Submit answers, update streak |
| GET | /questions | Filter by exam, year, topic |
| POST | /attempts | Record a practice answer |
| GET | /progress | Streak, best streak, accuracy, last 14 days |
| GET | /leaderboard | Daily / weekly ranking |
| POST | /reports | Report a wrong question |

All endpoints except `/auth/login` require a valid JWT. Responses: `{ "data": ..., "message": "..." }`.

---

## 6. Business Rules (do not change without asking)

- **Daily quiz:** seed the shuffle with the date so every user gets the same 10 questions.
- **Streak:** a day counts when the daily quiz is completed. If today is not done yet, the streak continues from yesterday. Missing a full day resets it to 0.
- **Best streak:** longest run of consecutive completed days.
- **Accuracy:** correct answers / total answered.
- **Timezone:** Asia/Kolkata for all date logic.
- **Free vs paid:** daily quiz and streak are free. Full PYQ bank, mock tests, weak-topic analysis are paid.

---

## 7. Coding Conventions

**Backend**
- PSR-12 and Laravel conventions
- Form Requests for validation, API Resources for responses
- Thin controllers; logic in service classes
- Feature tests (Pest/PHPUnit) for every endpoint
- Secrets only in `.env`; keep `.env.example` updated

**Frontend**
- TypeScript strict mode
- Tamil is the default language; all strings via `i18n/ta.json`
- Light and dark themes via CSS variables
- Font: Noto Sans Tamil with system fallback
- Large touch targets, simple screens
- JWT handling in the api client only; no sensitive data in localStorage

---

## 8. PYQ Data Pipeline (`data/`)

1. Download official PDFs from tnpsc.gov.in (Previous Year Question Papers and Answer Keys).
2. Extract text with `pdfplumber` / `PyMuPDF`; OCR scanned PDFs with Tesseract (`tam`).
3. Parse: question number, question, options A-D, answer.
4. Output JSON in the `questions` table format.
5. Mark imported rows `review_status = pending` until manually verified.

**Rules**
- Match each paper series (A/B/C/D) with the same series in the official answer key.
- Flag cancelled or disputed questions.
- Use official sources only. Do not copy content or explanations from third-party or coaching sites.
- Write explanations originally.

**Priority:** Group 4 (last 5-8 years), then Group 2/2A, Group 1 prelims, VAO.

---

## 9. Working Rules for the Agent

- Small, focused changes. One concern per commit.
- Run tests and lint before declaring a task done.
- Ask before changing business rules, schema, or the API contract.
- Never invent exam questions or answers. Every question must come from a verified source.
- No new dependencies without a clear reason.
- If unclear, state your assumption in the commit notes instead of guessing silently.

---

## 10. Build Order

1. backend: migrations, models, import command, seed real questions
2. backend: auth, daily quiz, streak APIs + tests
3. frontend: api client, Login, Daily, Progress
4. frontend: Practice and PYQ pages
5. Filament admin panel (CRM)
6. PWA, notifications, mock tests, payments

---

## 11. Definition of Done

- Works end to end (API and UI)
- Tests pass, lint clean
- Tamil text renders correctly
- Works on a small mobile screen
- Documented in `docs/` if behavior changes
