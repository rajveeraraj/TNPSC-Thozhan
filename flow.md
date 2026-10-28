# ExamBuddy: Page Flows

Page flows for the user app (frontend) and the admin panel (Filament).

---

## 1. User App Flow

### Entry

```
Splash
  ↓
Onboarding (3 slides)
  ↓
Login (Phone OTP / Google)
  ↓
Select Exam (Group 4 / Group 2 / Group 1 / VAO)
  ↓
Select Language (Tamil / English) + Daily goal
  ↓
HOME
```

### Home

Bottom navigation: **Home | Practice | PYQ | Progress | Profile**

```
HOME
 ├─ Streak card ─────────────→ Progress
 ├─ Daily Quiz ──→ Quiz (10 Qs) → Result → Streak updated → Leaderboard / Home
 ├─ Continue Practice ───────→ Practice
 ├─ Mock Test ───────────────→ Test Instructions → Test → Result → Analysis
 └─ Notifications bell ──────→ Notifications
```

### Practice

```
Practice → Subject → Category → Sub-category → Quiz → Result → Review answers / Retry
```

### PYQ

```
PYQ → Exam → Year → Paper → Questions → Result
         (Paid content → Plans page)
```

### Question Screen Actions

```
Answer → Explanation → Bookmark | Report wrong answer | Next
```

### Progress

```
Progress → Streak calendar | Accuracy | Weak topics → Practice that topic
         → Leaderboard (Daily / Weekly)
```

### Profile

```
Profile → Edit profile | Change exam | Bookmarks | Subscription / Plans
        → Settings (language, theme, reminders) | Help / Feedback | Logout
```

### Paywall

```
Locked content → Plans → Payment (UPI / Razorpay) → Success → Unlocked content
```

---

## 2. Admin Panel Flow (Filament)

```
Admin Login
  ↓
DASHBOARD (KPIs, charts, content health)
  ├─ Masters
  │    Exam → Subject → Category → Sub-category
  │    (Difficulty, Year, Plans, Coupons, Badges)
  │
  ├─ Questions
  │    Add / Bulk Import → Pending → Review → Reviewed
  │                                    └→ Flagged → Fix → Review
  │    Reports queue (users' wrong-answer reports) → Fix question
  │
  ├─ Quiz & Tests
  │    Daily Quiz Scheduler | Mock Tests
  │
  ├─ CRM
  │    Users → User detail (streak, attempts, subscription)
  │    Segments → Campaign (Push / WhatsApp / SMS) → Schedule → Report
  │    Support (feedback / tickets)
  │    Subscriptions (payments, coupons, refunds)
  │
  ├─ Reports (retention, topic accuracy, revenue)
  └─ Settings (roles, audit log, app settings)
```

---

## 3. Content to User Flow

```
Admin adds Master data → adds / imports Questions → Review → Reviewed
   → appears in Daily Quiz / Practice / PYQ in the app
   → user attempts → data feeds Dashboard & CRM segments → Campaign → user returns
```

---

## 4. Master Hierarchy

```
Exam → Subject → Category → Sub-category
```

Questions reference `exam_id`, `subject_id`, `category_id`, `difficulty_id` (instead of plain text fields).

---

## 5. Priority

| Phase | Scope |
|---|---|
| MVP | Login, exam select, Daily Quiz, Practice, PYQ, Progress; Admin: Dashboard, Masters, Questions, Users |
| Phase 2 | Mock Test, Notifications, Plans / Payments; Admin: Campaigns, Subscriptions, Support |
| Later | Leaderboard extras, Referrals, Leads (B2B), advanced reports |
