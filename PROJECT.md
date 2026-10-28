# Project: TNPSC தோழன் (ExamBuddy Frontend PWA)

## Architecture

TNPSC தோழன் is a mobile-first, Tamil-first Progressive Web Application built with React 18, Vite, TypeScript (strict mode), and Tailwind CSS. The design faithfully implements Google Stitch Project `1469633910251393858` ("TNPSC Daily Tamil Quiz") featuring an OLED Navy glassmorphic design system (`TNPSC Aspire`).

### System Architecture
```
                                  ┌────────────────────────┐
                                  │      Browser / PWA     │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌───────────────────────────┐                 ┌───────────────────────────┐
         │     UI Component Layer    │                 │   E2E Test & Harness      │
         │ - Header & BottomNav      │                 │ - Vitest + Testing Lib    │
         │ - Home (முகப்பு)          │                 │ - Tier 1: Feature Tests   │
         │ - Quiz Player (தினசரி)    │                 │ - Tier 2: Boundary Tests  │
         │ - Practice & PYQ (பயிற்சி)│                 │ - Tier 3: Combinations    │
         │ - Profile (சுயவிவரம்)     │                 │ - Tier 4: Real-world Flow │
         └─────────────┬─────────────┘                 └───────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────┐       ┌───────────────────────┐
│ State & i18n     │       │ API & Mock Service    │
│ - Quiz Store     │       │ - REST Client (Axios) │
│ - User / Streak  │       │ - Seeded PRNG Shuffle │
│ - ta.json        │       │ - Authentic Mock Data │
└──────────────────┘       └───────────────────────┘
```

### Key Technical Tenets
1. **Glassmorphic Design Fidelity**: Deep OLED Navy canvas (`#051424`), translucent cards (`rgba(255, 255, 255, 0.06)` with `backdrop-blur-xl`), 1px subtle white borders (`rgba(255, 255, 255, 0.12)`), Saffron Gold accents (`#d97707`, `#ffb77d`), and Emerald Green accents (`#10b981`, `#4edea3`).
2. **Tamil Typography Safety**: Proportional line heights (`fontSize + 8px`) for `Noto Sans Tamil` to prevent diacritic clipping.
3. **Decoupled API Client & Mock Engine**: Matching `agent.md` REST contracts (`{ data: ..., message: ... }`). Supports 100% standalone offline operation with date-seeded deterministic 10-question daily quiz generation in `Asia/Kolkata` timezone.
4. **Mobile-First Container**: Optimized for 390px-430px viewports with safe area insets (`pt-safe`, `pb-safe`), centered on desktop with subtle ambient border.

---

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | App Shell & Viewport Container | Mobile-first centered 390px-430px container with safe area insets | M1 | Stitch Screen 1-4 |
| 2 | Tailwind Stitch Theme Tokens | OLED Navy, Saffron, Emerald, typography, glass utilities | M1 | Stitch Design System |
| 3 | Typography & Fonts Integration | Plus Jakarta Sans, Be Vietnam Pro, Noto Sans Tamil, Material Symbols | M1 | Stitch Design System |
| 4 | Brand Header Component | Sticky glass header with "TNPSC தோழன்", streak pill badge, avatar | M1 | Stitch Home Screen |
| 5 | Bottom Navigation Bar | Fixed 4-tab bar (முகப்பு, பயிற்சி, வினாக்கள், சுயவிவரம்) with active styling | M1 | Stitch Global Nav |
| 6 | TypeScript Domain Models | User, Question, Option, DailyQuiz, Streak, Progress, HeatmapDay | M2 | agent.md & Stitch |
| 7 | Seeded PRNG Daily Quiz Generator | Deterministic Mulberry32 algorithm seeded by Asia/Kolkata date | M2 | agent.md:113 |
| 8 | Authentic Mock Question Bank | 36+ real TNPSC questions across 6 syllabus areas (Grammar, Literature, Polity, History, Maths, GK) | M2 | agent.md & Syllabus |
| 9 | Authentic PYQ Dataset | 2023 Group 4, 2022 Group 2, 2021 VAO question papers | M2 | agent.md & Stitch |
| 10 | Mock User & Progress Store | 7-day streak, 84% accuracy, 1,420 questions solved, 14-day heatmap | M2 | Stitch Profile Screen |
| 11 | Unified REST API & Mock Client | `/auth/login`, `/quiz/daily`, `/quiz/daily/submit`, `/questions`, `/attempts`, `/progress`, `/leaderboard`, `/reports` | M2 | agent.md:94-106 |
| 12 | Tamil Localization Catalog | Complete key-value catalog in `src/i18n/ta.json` covering all screens | M2 | ORIGINAL_REQUEST:36 |
| 13 | Target Exam Banner | Banner with "TNPSC Group 4 & VAO 2024", 45 days remaining, 64% progress bar | M3 | Stitch Home Screen |
| 14 | 7-Day Streak Tracker Card | Card with 14-day activity dots row, "தொடர்க!" badge, record display | M3 | Stitch Home Screen |
| 15 | Daily Quiz Launcher Card | Card with watermark icon, bolt badge, title, subtitle, CTA button | M3 | Stitch Home Screen |
| 16 | 6-Card Syllabus Grid | 2-column quick access cards with subject icons, titles, topic counts | M3 | Stitch Home Screen |
| 17 | Mega Mock Test Banner | Banner with upcoming mock test title, live timer, "பதிவு" button | M3 | Stitch Home Screen |
| 18 | Quiz Header & Countdown Timer | 10-question counter, live timer (08:45), close confirmation dialog | M3 | Stitch Quiz Screen |
| 19 | Quiz Linear Progress Bar | Dynamic progress bar tracking quiz question completion | M3 | Stitch Quiz Screen |
| 20 | Dual-Language Question Card | Category pill, Tamil question text, English subtext, audio TTS button | M3 | Stitch Quiz Screen |
| 21 | Interactive Option Cards (அ/ஆ/இ/ஈ) | Instant emerald green / red error validation upon selection | M3 | Stitch Quiz Screen |
| 22 | Animated Instant Explanation Card | Card with lightbulb icon and detailed Tamil explanation | M3 | Stitch Quiz Screen |
| 23 | Quiz Navigation Bar | "முந்தைய" (Previous) and "அடுத்து" (Next) / "முடிக்க" (Finish) buttons | M3 | Stitch Quiz Screen |
| 24 | Quiz Completion & Results Modal | Score summary, accuracy %, streak increment celebration | M3 | Stitch Quiz Screen |
| 25 | Practice Header Banner | Motivational banner with "TNPSC பயிற்சி தளம்" & "இலக்கு 2024" badge | M3 | Stitch Practice Screen |
| 26 | Practice Segmented Tabs | Switcher between "தலைப்பு வாரியாக" (Topic-wise) and "முந்தைய வினாக்கள்" (PYQs) | M3 | Stitch Practice Screen |
| 27 | Practice Live Search Bar | Real-time search filter for topics and question content | M3 | Stitch Practice Screen |
| 28 | Practice Category Filter Chips | Horizontal scroll chips (All, Group 4, Group 2, VAO, General Tamil) | M3 | Stitch Practice Screen |
| 29 | Interactive Topic Cards | Cards with topic icon, title, question count, completion % bar, CTA | M3 | Stitch Practice Screen |
| 30 | Bookmark Toggle & Toast System | Bookmark button toggling fill state, triggerable feedback toast | M3 | Stitch Practice Screen |
| 31 | PYQ Exam Cards | Cards with exam title, questions count, full solutions badge, CTA | M3 | Stitch Practice Screen |
| 32 | Quick Practice FAB | Floating circular bolt button triggering instant 10-question quiz | M3 | Stitch Practice Screen |
| 33 | Aspirant Profile Banner | Candidate card with dual radial glow, avatar ring, verified badge, ID | M3 | Stitch Profile Screen |
| 34 | 3 Key Metric Cards | Streak (7 நாட்கள் 🔥), Accuracy (84% 🎯), Questions Solved (1,420 📚) | M3 | Stitch Profile Screen |
| 35 | 14-Day Practice Activity Heatmap | 7x2 grid with Tamil day labels and intensity-coded cells | M3 | Stitch Profile Screen |
| 36 | Settings & Preferences List | Bookmarks, Weak topics, Notifications, Language/Theme, Logout | M3 | Stitch Profile Screen |
| 37 | Version & Motto Footer | "TNPSC தோழன் பதிப்பு 2.4.1" • "வெற்றி நிச்சயம், விடாமுயற்சி!" | M3 | Stitch Profile Screen |
| 38 | PWA Manifest & App Icons | `manifest.webmanifest`, standalone mode, mobile icons, apple touch icon | M4 | ORIGINAL_REQUEST:52 |
| 39 | Service Worker Offline Cache | `sw.js` precaching shell and offline assets | M4 | ORIGINAL_REQUEST:52 |
| 40 | Clean Production Build | Zero TypeScript errors, zero Vite build warnings, clean bundle | M4 | ORIGINAL_REQUEST:50 |
| 41 | E2E Testing Suite (Tiers 1-4) | Comprehensive test harness covering all features, boundaries, flows | M5 | E2E Testing Track |
| 42 | Adversarial Hardening (Tier 5) | White-box stress testing, gap analysis, resilience verification | M5 | Final Milestone |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Frontend Foundation & Theme Setup | Initialize `frontend/` directory, Vite, React 18, TypeScript strict, Tailwind CSS with Stitch tokens, Google Fonts, Material Symbols & Lucide icons, safe area utilities, app shell container, Header, and BottomNav. | none | DONE |
| M2 | API Layer, Mock Engine & Tamil i18n | TypeScript domain definitions, REST API client, deterministic seeded daily quiz generator, authentic mock question bank (36+ questions across 6 topics), PYQ papers, user progress store, and `src/i18n/ta.json`. | M1 | DONE |
| M3 | Core Screens Implementation | Build 4 Stitch screens: முகப்பு (Home Dashboard), தினசரி தேர்வு (Daily Quiz Player), பயிற்சி (Practice & PYQs with search/filter/bookmarks/FAB), and சுயவிவரம் (Profile & Progress with 14-day heatmap). | M2 | DONE |
| M4 | PWA, Integration & Build Verification | Inter-screen routing, state synchronization, PWA manifest, service worker, icons, mobile viewport audit, and clean `npm run build` verification. | M3 | DONE |
| M5 | Final Milestone: E2E Test Suite & Adversarial Hardening | Phase 1: Pass 100% of E2E test suite (Tiers 1-4). Phase 2: Adversarial coverage hardening (Tier 5) with challenger stress-tests (203/203 tests passing). | M4 | DONE |

---

## Interface Contracts

### UI Component Layer ↔ API & Store Layer
```typescript
// Daily Quiz API Contract
export interface IDailyQuizService {
  getTodayQuiz(): Promise<DailyQuizData>;
  submitQuiz(payload: QuizSubmissionPayload): Promise<QuizSubmissionResult>;
}

// Question & Practice API Contract
export interface IQuestionService {
  getQuestions(params: QuestionQueryParams): Promise<{ data: Question[]; meta: PaginationMeta }>;
  submitAttempt(questionId: number, selectedOption: OptionId): Promise<AttemptResult>;
  getTopics(): Promise<TopicItem[]>;
  getPyqs(): Promise<PyqItem[]>;
}

// User & Progress API Contract
export interface IProgressService {
  getProgress(): Promise<ProgressStats>;
  toggleBookmark(itemId: string, type: 'topic' | 'pyq' | 'question'): Promise<boolean>;
}

// Localization Contract
export function t(key: string, params?: Record<string, string | number>): string;
```

### Screen Navigation Contract
```typescript
export type ActiveTab = 'home' | 'practice' | 'quiz' | 'profile';

export interface AppNavigationState {
  currentTab: ActiveTab;
  isQuizActive: boolean;
  activeTopicId: string | null;
  navigateToTab: (tab: ActiveTab) => void;
  startQuiz: (quizId?: number) => void;
  exitQuiz: () => void;
}
```

---

## Code Layout

```
f:\Projects\TNPSC தோழன்\frontend\
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── quizService.ts
│   │   ├── questionService.ts
│   │   ├── progressService.ts
│   │   └── mockData.ts
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── home/
│   │   │   ├── TargetExamBanner.tsx
│   │   │   ├── StreakCard.tsx
│   │   │   ├── DailyQuizLauncher.tsx
│   │   │   ├── SyllabusGrid.tsx
│   │   │   └── MockTestBanner.tsx
│   │   ├── quiz/
│   │   │   ├── QuizHeader.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── OptionButton.tsx
│   │   │   ├── ExplanationCard.tsx
│   │   │   └── QuizSummaryModal.tsx
│   │   ├── practice/
│   │   │   ├── PracticeTabs.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterChips.tsx
│   │   │   ├── TopicCard.tsx
│   │   │   └── PyqCard.tsx
│   │   └── profile/
│   │       ├── ProfileHeader.tsx
│   │       ├── MetricsGrid.tsx
│   │       ├── ActivityHeatmap.tsx
│   │       └── SettingsList.tsx
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── ta.json
│   │   └── en.json
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── QuizPage.tsx
│   │   ├── PracticePage.tsx
│   │   └── ProfilePage.tsx
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── quizStore.ts
│   │   └── practiceStore.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── quiz.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   ├── speech.ts
│   │   └── confetti.ts
│   ├── test/
│   │   ├── setup.ts
│   │   ├── tier1_features.test.tsx
│   │   ├── tier2_boundaries.test.tsx
│   │   ├── tier3_combinations.test.tsx
│   │   └── tier4_workloads.test.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── index.html
```
