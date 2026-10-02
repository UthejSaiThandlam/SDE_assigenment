# AuraPulse — Personalized Content & Intelligence Dashboard

A full-stack, modular content intelligence platform built for the Frontend / Full-Stack SDE assignment. AuraPulse aggregates real-time news headlines, cinema releases, and community social trends into an adaptive, explainable recommendation feed.

Built with a cleanly decoupled architecture:
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, `@dnd-kit`.
- **Backend**: Node.js, Express, TypeScript, JWT (bcrypt + HS256), NewsAPI & Watchmode Cinema integrations with resilient offline cache.

---

## 🌟 7 Core Differentiators & Killer Features

Rather than building 20 superficial components, AuraPulse is engineered around **strong, production-grade differentiators**:

### 1. 🧠 Explainable Personalization ("Why am I seeing this?")
- Every card includes a dedicated **"Why this?"** inspector.
- Opens an explainability breakdown displaying exact mathematical scoring:
  - **Category Alignment** (Up to 45 pts): Matches active priorities (e.g. AI, Technology).
  - **Interaction Affinity** (Up to 15 pts): Dynamic bonus earned from user reading patterns.
  - **Recency Decay** (Up to 25 pts): Freshness weighting from publication timestamp.
  - **Authority & Engagement** (Up to 15 pts): Critical ratings (TMDB) or viral engagement.
  - Transparent plain-English reasons (`✓ Top priority match`, `✓ High critical rating: 8.5/10`).

### 2. 🎯 Adaptive Preference Scoring (Dynamic Engagement Engine)
- Personalization is dynamic, not a static category filter.
- Tracks real-time engagement telemetry:
  - Story Opened / Clicked: `+3 pts`
  - Story Favorited / Read Later: `+5 pts`
  - 20-Second Quick Brief Viewed: `+2 pts`
  - "Not Interested" Feedback: `-4 pts` (immediately hides card and lowers category affinity)
- Click **"Adaptive Scoring"** in the toolbar to inspect your live interest evolution:
  `AI 92%` • `Technology 78%` • `Finance 51%` • `Sports 18%`.

### 3. 🔄 "Refresh My Perspective" (Anti-Bubble Diversity Mode)
- One-click toggle: **↻ Refresh Perspective**.
- Deliberately counters recommendation filter bubbles by altering ranking distribution:
  - `40%` Cross-category discoveries outside standard preferences.
  - `30%` High-velocity trending content across all topics.
  - `30%` Tailored core preferences.
- Displays an active perspective banner with one-click return to standard feed.

### 4. 🧩 Content Diversity Score & Reading Analytics
- Real-time **Feed Diversity Index (0–100)** calculated using Shannon entropy across active content categories.
- Real-time **Estimated Reading Time** accrued across the feed (`~24 min total`).

### 5. ⚡ 20-Second Executive Quick Brief
- Click **⚡ Quick Brief** on any card.
- Opens a concise popup presenting:
  - 3 core executive takeaway bullets.
  - Source publication & estimated reading duration.
  - Quick action: *Save to Read Later* or *Read Full Source*.

### 6. 🪄 Universal Command Palette (`Ctrl + K` / `Cmd + K`)
- Keyboard-driven command hub for instant actions:
  - Quick search across news, movies, and social posts.
  - Toggle Dark / Light theme.
  - Trigger "Refresh Perspective" mode.
  - View Saved Favorites or Read Later backlog.
  - Launch Feed Audit Report or Adaptive Telemetry.

### 7. 🔔 Live Activity & Sync Notification Center
- Bell icon in the header tracks real-time dashboard state.
- Automatically records and notifies upon:
  - Feed synchronization events with source metrics.
  - Live interaction-driven adaptive weight changes.
  - Perspective shifts and offline cache readiness.
  - One-click "Mark All as Read" and "Clear All".

---

## 🏗️ Architecture & Directory Structure

```
Assignement_sde/
├── frontend/                   # Client application (Next.js 16 + RTK)
│   ├── src/
│   │   ├── app/                # Next.js App Router (feed, login, favorites, settings)
│   │   ├── components/
│   │   │   ├── cards/          # ContentCard with Quick Brief, Why This, options
│   │   │   ├── feed/           # FeedGrid, SortableCard (@dnd-kit drag-and-drop)
│   │   │   ├── layout/         # Header, Sidebar, DashboardShell, NotificationBell
│   │   │   ├── modals/         # ExplainabilityModal, QuickBriefModal, UserProfileModal, FeedReportModal
│   │   │   └── ui/             # CommandPalette, EmptyState, SkeletonCard
│   │   ├── hooks/              # useDebounce, custom hooks
│   │   ├── lib/                # Personalization & Shannon entropy diversity math
│   │   ├── store/              # Redux slices: preferences, favorites, adaptive, notifications, auth
│   │   ├── tests/              # Vitest unit & integration test suites
│   │   └── types/              # Domain models (ContentItem, UserPreferences)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                    # REST API Microservice (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/        # FeedController, AuthController
│   │   ├── routes/             # Express routes (/api/feed, /api/auth, /api/movies, etc.)
│   │   ├── services/           # NewsService (NewsAPI), MoviesService (Watchmode/TMDB), AuthService (JWT)
│   │   ├── data/               # Curated fallback datasets (guarantees offline resilience)
│   │   ├── types/              # Backend TypeScript types
│   │   └── server.ts           # Express server with CORS & security headers
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
Run from the root workspace directory:
```bash
npm run install:all
```
*(Or install in `frontend` with `npm install --legacy-peer-deps` and `backend` with `npm install`)*.

### 3. Configure Environment Keys
API keys are already pre-configured in local `.env` files for immediate use, or you can supply your own:

- **Frontend** (`frontend/.env.local`):
  ```env
  NEWS_API_KEY=d82cb2bae3b745b58800f519dda72040
  MOVIE_API_KEY=kGkzHU6HoQDcNpZv4zAMB0yyy0EmN9bkg5zQbm9s
  WATCHMODE_API_KEY=kGkzHU6HoQDcNpZv4zAMB0yyy0EmN9bkg5zQbm9s
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  BACKEND_URL=http://localhost:5000
  ```

- **Backend** (`backend/.env`):
  ```env
  PORT=5000
  NEWS_API_KEY=d82cb2bae3b745b58800f519dda72040
  MOVIE_API_KEY=kGkzHU6HoQDcNpZv4zAMB0yyy0EmN9bkg5zQbm9s
  WATCHMODE_API_KEY=kGkzHU6HoQDcNpZv4zAMB0yyy0EmN9bkg5zQbm9s
  JWT_SECRET=aurapulse-jwt-secret-key-2026-production
  ```

*Note: All API keys are consumed strictly via `process.env` and never hardcoded in client source code. If offline or rate-limited, the application gracefully activates its high-fidelity curated cache.*

### 4. Run the Application

Start both backend and frontend from the root folder:

```bash
# Terminal 1: Run Backend (Port 5000)
npm run dev:backend

# Terminal 2: Run Frontend (Port 3000)
npm run dev:frontend
```

Once running:
- **Dashboard Application**: [http://localhost:3000](http://localhost:3000)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Default Evaluator Demo Account**: `uthej@aurapulse.io` / `password123` (or click 1-click Demo Sign In)

---

## 🧪 Testing Suite

A comprehensive test suite of **26 automated unit and integration tests** verifies personalization logic, state slices, and UI interactions:

```bash
# Run all tests via Vitest
npm test
```

### Test Suites Included:
- `personalization.test.ts`: Deterministic scoring calculation, explainability reasons, drag-and-drop sort order.
- `adaptiveSlice.test.ts`: Interaction affinity updates, negative feedback penalty, read later toggles, perspective shifts.
- `notificationSlice.test.ts`: Notification queuing, read flags, and event clearing.
- `preferencesSlice.test.ts`: Category selection, minimum safety rule, theme switches.
- `favoritesSlice.test.ts`: Bookmark toggling, duplicate prevention, bulk clearing.
- `useDebounce.test.ts`: 400ms search input stabilization.
- `EmptyState.test.tsx`: Component rendering and filter reset callbacks.

---

## 🔌 API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, uptime, and system timestamp |
| `POST` | `/api/auth/login` | Authenticates user credentials and issues signed JWT |
| `POST` | `/api/auth/register` | Registers user profile and issues JWT |
| `GET` | `/api/auth/me` | Validates JWT bearer token and returns profile |
| `GET` | `/api/feed` | Unified, ranked multi-source stream (`q`, `category`, `type`) |
| `GET` | `/api/news` | NewsAPI integration with US top-headlines and search |
| `GET` | `/api/movies` | Watchmode/TMDB cinema releases with streaming provider links |
| `GET` | `/api/social` | Structured social pulse discussion stream |

---

## 🛡️ License & Submission Context
Developed for the **Software Development Engineer (SDE) Intern - Frontend Development Assignment**.
Designed and implemented with modern clean code practices, production state management, and explainable AI-style algorithmic scoring.
