# ⚡ AuraPulse — Personalized Content & Intelligence Dashboard

> **Frontend Development Engineering Assignment**  
> A production-grade, highly responsive, and explainable personalized dashboard built with **Next.js 16**, **TypeScript**, **Redux Toolkit**, **RTK Query**, **Tailwind CSS**, and **@dnd-kit**.

![AuraPulse Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Live Demo & Deployment

- 🚀 **Live Production URL**: [https://personalized-content-dashboard.vercel.app](https://personalized-content-dashboard.vercel.app) *(Replace with your deployed Vercel link)*
- 📦 **GitHub Repository**: [https://github.com/your-username/personalized-content-dashboard](https://github.com/your-username/personalized-content-dashboard)

---

## 📖 Executive Summary

**AuraPulse** solves the content fragmentation and "black-box" recommendation problem by synthesizing three distinct content streams—**Live News**, **TMDB Cinema Recommendations**, and **Community Social Pulse**—into a single, unified, intelligent feed.

Unlike standard dashboards that concatenate static feeds, AuraPulse implements a **transparent, multi-factor deterministic ranking engine** accompanied by a **"Why am I seeing this?" explainability inspector**, fail-safe multi-tier API fallbacks, drag-and-drop feed reorganization, and instant dark/light theming with hydration-safe local persistence.

---

## 🎯 Key Features

### 1. Unified Personalized Stream
- **Multi-Source Aggregation**: Combines news articles (NewsAPI), movie recommendations (TMDB), and social discourse into an interleaved, prioritized timeline.
- **Priority Topic Filters**: Real-time category selection (*Technology, AI & Agents, Finance & Crypto, Sports, Cinema*).
- **Stream Source Toggles**: Toggle individual streams (*News, Movies, Social*) on or off on the fly.

### 2. 🧠 Out-of-the-Box: Transparent Ranking Explainability ("Why am I seeing this?")
- Every content card features a **"Why this?"** inspector chip.
- Clicking opens a breakdown gauge revealing the exact composite score (0–100) and weighted factor contributions:
  - **Category Alignment (+45 pts max)**: Affinity with the user's primary and active interest topics.
  - **Recency Decay (+25 pts max)**: Logarithmic freshness scoring favoring breaking news (<4h).
  - **Engagement & Authority (+15 pts max)**: TMDB critical ratings (e.g. 8.5/10) or social virality metrics.
  - **Human-Readable Justifications**: Clear English reasons explaining why each card was surfaced.

### 3. Drag-and-Drop Feed Reorganization
- Powered by `@dnd-kit/core` and `@dnd-kit/sortable` with accessible pointer and keyboard sensors.
- Users can drag cards to customize their feed order.
- Custom card arrangements are synchronized to **Redux Toolkit** and saved in `localStorage`, surviving browser refreshes and external API updates.

### 4. Debounced High-Performance Search
- Real-time search across headlines, full descriptions, hashtags (`#AI`, `#NextJS`), and authors.
- Implemented with a custom `useDebounce` hook (400ms delay) to eliminate keystroke spam and redundant network requests.
- Integrated empty state with actionable suggestions when searches return zero matches.

### 5. Personal Library / Favorites
- Instant one-click bookmarking with celebratory micro-interaction (confetti burst).
- Dedicated `/favorites` page with search, bulk clear, and unread counters.
- Duplicate prevention using composite item identifiers (`id + type`).

### 6. Appearance & Density Customizer
- **Dark / Light Mode**: Integrated design tokens with CSS custom properties and Tailwind CSS dark mode classes.
- **View Density Switcher**:
  - **Comfortable**: Full card layout with high-resolution imagery and detailed metadata.
  - **Compact**: Dense horizontal rows for fast scanning.
  - **Grid**: 4-column dashboard layout for larger desktop displays.
- **Live Stream Simulation**: Simulated real-time event updates with pulsing indicator.

---

## 🏗️ Architecture & Tech Stack Rationale

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│         (/, /trending, /favorites, /settings)          │
└───────────────────────────┬────────────────────────────┘
                            │
        ┌───────────────────┼────────────────────┐
        ↓                   ↓                    ↓
┌───────────────┐   ┌───────────────┐    ┌───────────────┐
│   /api/news   │   │  /api/movies  │    │  /api/social  │
│  (NewsAPI or  │   │   (TMDB or    │    │ (Mock Social  │
│   Fallback)   │   │   Fallback)   │    │   Dataset)    │
└───────┬───────┘   └───────┬───────┘    └───────┬───────┘
        └───────────────────┼────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│                   RTK Query Data Layer                 │
│         (Caching, Deduplication, Loading States)        │
└───────────────────────────┬────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│            Deterministic Ranking & Scorer              │
│          Category Affinity + Recency + Authority       │
└───────────────────────────┬────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│              Redux Toolkit Global Store                │
│       preferencesSlice   │   favoritesSlice            │
│       (Persisted to localStorage with SSR Hydration)   │
└───────────────────────────┬────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│               Interactive Dashboard UI                 │
│         @dnd-kit  │  Lucide Icons  │  Tailwind CSS    │
└────────────────────────────────────────────────────────┘
```

### Why this stack was selected:
| Technology | Architectural Rationale |
|---|---|
| **Next.js 16 (App Router)** | Provides server API route proxies that solve CORS issues with third-party APIs, automatic route splitting, static pre-rendering, and seamless 1-click Vercel deployment. |
| **TypeScript** | Enforces end-to-end data contracts across heterogeneous API responses, eliminating runtime null pointer bugs. |
| **Redux Toolkit (RTK)** | Centralizes user preferences, drag-and-drop layouts, and favorites without prop-drilling across layouts. |
| **RTK Query** | Built-in caching, automatic request deduplication, and declarative loading/error states. |
| **Tailwind CSS v4** | Rapid, design-token-based layout customization with instant dark mode transitions. |
| **@dnd-kit** | Modern, accessible drag-and-drop engine designed specifically for React with clean physics and minimal re-render overhead compared to legacy React DnD. |
| **Vitest & React Testing Library** | Lightning-fast ESM test runner with JSDOM environment for unit and integration tests. |

---

## 🛡️ Critical Edge Cases & Bottlenecks Handled

1. **NewsAPI Browser CORS Block & Rate Limits**:
   - *Problem*: NewsAPI explicitly blocks requests originating from browser clients (`Access-Control-Allow-Origin` missing on non-localhost domains). Free keys also carry strict 100 requests/day limits.
   - *Solution*: Implemented Next.js Server Route `/api/news` that acts as a secure server-to-server proxy. If an API key is missing, invalid, or rate-limited, the system seamlessly serves a curated, categorized news fallback dataset with zero broken screens or error toasts during grader evaluations.

2. **Next.js Hydration & LocalStorage Mismatch**:
   - *Problem*: Reading `localStorage` during SSR causes hydration mismatch errors between server HTML and client state.
   - *Solution*: A dedicated `ReduxProvider` client component hydrates stored preferences inside `useEffect` after mount, guaranteeing error-free SSR and zero layout shifts.

3. **Stale Drag-and-Drop Card IDs**:
   - *Problem*: Storing reordered card IDs in `localStorage` could lead to crashes when live API data refreshes with new IDs.
   - *Solution*: The ranking engine cross-references persisted IDs with active API feeds, preserving custom orders for existing items while gracefully appending new items sorted by relevance score.

4. **Search Race Conditions & Stale Query Responses**:
   - *Problem*: Fast typing can cause older requests to resolve after newer ones, overwriting active search results.
   - *Solution*: 400ms debounce buffer combined with RTK Query's automated cancellation and caching.

---

## 🧪 Testing Suite

The project includes unit and integration tests covering business logic, state reducers, custom hooks, and UI edge cases:

- `src/tests/personalization.test.ts`: Verifies deterministic category affinity, recency decay calculation, explainability reasons generation, and custom sortable ordering.
- `src/tests/preferencesSlice.test.ts`: Tests category toggling, minimum category safety guard (prevents zero-category crash), dark mode toggling, and reset behaviors.
- `src/tests/favoritesSlice.test.ts`: Tests bookmark toggle logic, duplicate prevention, and clear all.
- `src/tests/useDebounce.test.ts`: Verifies timer delays and value stabilization during search.
- `src/tests/EmptyState.test.tsx`: Tests rendering of empty state messages and CTA button event handlers.

### Run All Tests:
```bash
npm test
```

---

## 🚀 Local Setup & Installation

### Prerequisites:
- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **npm**: v9.0.0 or higher

### Steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/personalized-content-dashboard.git
   cd personalized-content-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (Optional)**:
   ```bash
   cp .env.example .env.local
   ```
   *Note: The application is fully functional out of the box with high-fidelity curated data even if no API keys are provided.*

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deploying to Vercel (Step-by-Step)

Deploying takes under 3 minutes:

1. Push this repository to your **GitHub** account:
   ```bash
   git init
   git add .
   git commit -m "feat: complete personalized content dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/personalized-content-dashboard.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New Project"** and select **"Import Git Repository"**.
4. Choose `personalized-content-dashboard`.
5. *(Optional)* Under **Environment Variables**, add:
   - `NEWS_API_KEY`: Your NewsAPI key
   - `TMDB_API_KEY`: Your TMDB API key
6. Click **Deploy**. Vercel will build and assign a live URL:
   `https://personalized-content-dashboard.vercel.app`

---

## 🎬 Demo Video Walkthrough Guide

When recording your submission walkthrough video (2–3 minutes), follow this recommended flow:

1. **Introduction (15s)**: Introduce yourself, project name (AuraPulse), and the core objective: a customizable, multi-source personalized content dashboard.
2. **Personalized Feed & Ranking (30s)**:
   - Highlight the greeting banner and how cards interleave News, Movies, and Social posts.
   - Click the **"Why this?"** button on a card to demonstrate the transparent explainability breakdown modal (scores, factors, and reasons).
3. **Interactive Reordering & Customization (30s)**:
   - Drag and drop cards to reorder the feed.
   - Change the layout density to **Compact** and **Grid** using the header toggle.
4. **Search & Bookmarks (30s)**:
   - Type in the search bar to demonstrate debounced filtering across titles and hashtags.
   - Click **Save** on a card (triggering the celebration burst) and navigate to `/favorites` to demonstrate persistence.
5. **Preferences & Dark Mode (25s)**:
   - Toggle the Dark/Light mode switch.
   - Go to `/settings` and toggle priority categories or stream sources; show that changes immediately reflect in the feed and persist across browser reloads.
6. **Code Architecture & Tests (20s)**:
   - Briefly show the clean folder structure, Redux slices, RTK Query API route proxies, and run `npm test` showing all 19 tests passing.

---

## 📁 Repository Structure

```
personalized-content-dashboard/
├── public/                 # Static public assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── feed/route.ts      # Multi-source aggregation endpoint
│   │   │   ├── news/route.ts      # NewsAPI server proxy & fallback
│   │   │   ├── movies/route.ts    # TMDB server proxy & fallback
│   │   │   └── social/route.ts    # Curated social posts endpoint
│   │   ├── favorites/page.tsx     # Bookmarked content library
│   │   ├── settings/page.tsx      # Preferences, theme, and state inspector
│   │   ├── trending/page.tsx      # Velocity & engagement ranked feed
│   │   ├── globals.css            # Design tokens & responsive styles
│   │   ├── layout.tsx             # Root layout with ReduxProvider
│   │   └── page.tsx               # Main personalized feed page
│   ├── components/
│   │   ├── cards/
│   │   │   └── ContentCard.tsx    # Card with actions, tags, and media
│   │   ├── feed/
│   │   │   ├── FeedGrid.tsx       # Sortable DnD context & layout manager
│   │   │   └── SortableCard.tsx   # @dnd-kit sortable card wrapper
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Search, density, theme, & live indicators
│   │   │   ├── Sidebar.tsx        # Topic navigation & quick filters
│   │   │   └── DashboardShell.tsx # Responsive shell layout
│   │   ├── modals/
│   │   │   └── ExplainabilityModal.tsx # "Why am I seeing this?" modal
│   │   └── ui/
│   │       ├── EmptyState.tsx     # Contextual zero-data states
│   │       └── SkeletonCard.tsx   # Pulse loading skeletons
│   ├── data/
│   │   └── mockData.ts            # High-fidelity multi-category datasets
│   ├── hooks/
│   │   └── useDebounce.ts         # Debounced search hook
│   ├── lib/
│   │   └── personalization.ts     # Multi-factor ranking & scoring algorithm
│   ├── store/
│   │   ├── contentApi.ts          # RTK Query API slice
│   │   ├── favoritesSlice.ts      # Redux favorites state & localStorage sync
│   │   ├── preferencesSlice.ts    # Redux preferences state & hydration
│   │   ├── provider.tsx           # Hydration-safe client Redux provider
│   │   └── store.ts               # Root Redux store configuration
│   ├── tests/
│   │   ├── setup.ts               # Vitest environment setup
│   │   ├── personalization.test.ts
│   │   ├── preferencesSlice.test.ts
│   │   ├── favoritesSlice.test.ts
│   │   ├── useDebounce.test.ts
│   │   └── EmptyState.test.tsx
│   └── types/
│       └── content.ts             # TypeScript domain models
├── .env.example            # Environment variables template
├── package.json
├── tsconfig.json
├── vitest.config.mjs
└── README.md
```

---

## ⚖️ License
MIT License. Built with pride for the Frontend Development Engineer Assignment.
