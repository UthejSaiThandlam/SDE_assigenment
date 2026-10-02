# Personalized Content Dashboard

A full-stack, modular content intelligence platform featuring a separated **Frontend** (Next.js, TypeScript, Redux Toolkit, Tailwind CSS) and **Backend** (Node.js, Express, TypeScript) architecture.

---

## 🏗️ Architecture Overview

The codebase is organized into independent `frontend` and `backend` modules:

```
Assignement_sde/
├── frontend/                   # Client application
│   ├── src/
│   │   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── components/         # Modular UI components (cards, feed, layout, modals)
│   │   ├── hooks/              # Custom React hooks (e.g. useDebounce)
│   │   ├── lib/                # Personalization & scoring algorithms
│   │   ├── store/              # Redux Toolkit & RTK Query state management
│   │   ├── tests/              # Vitest unit and integration test suite
│   │   └── types/              # TypeScript interfaces and domain models
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
├── backend/                    # REST API Service
│   ├── src/
│   │   ├── controllers/        # Request handlers (feed, news, movies, social)
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Data fetching and aggregation logic
│   │   ├── data/               # Curated fallback and mock datasets
│   │   ├── types/              # Backend TypeScript definitions
│   │   └── server.ts           # Express server entry point with CORS
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚡ Core Features

1. **Multi-Source Aggregation**: Synthesizes News headlines, TMDB cinema recommendations, and social media posts into a unified feed.
2. **Transparent Personalization Engine**: Calculates a composite relevance score (0–100) per item based on user topic preferences, recency, and authority. Every card includes a "Why this?" inspector detailing its score breakdown.
3. **Interactive Feed Reordering**: Drag-and-drop sortable cards powered by `@dnd-kit` with layout persistence in Redux and `localStorage`.
4. **Debounced Search**: Optimized 400ms debounced search filtering across titles, descriptions, hashtags, and authors.
5. **Favorites Library**: Bookmarking system with duplicate prevention and session persistence.
6. **Customizable Density & Theming**: Switch between Comfortable, Compact, and Grid layouts with dark and light mode support.

---

## 🔌 Backend API Specification

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Service status and timestamp |
| `GET` | `/api/feed` | `q` (string), `category` (string), `type` (string) | Aggregated, filtered multi-source feed |
| `GET` | `/api/news` | `category` (string), `q` (string) | News articles with live API or fallback |
| `GET` | `/api/movies` | `q` (string) | TMDB movie recommendations or fallback |
| `GET` | `/api/social` | `hashtag` (string), `q` (string) | Structured social posts |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Install all dependencies across both services from the root folder:
```bash
npm run install:all
```

Alternatively, install individually:
```bash
# Frontend
cd frontend
npm install --legacy-peer-deps

# Backend
cd ../backend
npm install
```

### 3. Environment Configuration (Optional)
Both services contain `.env.example` templates. External API keys are optional; the application includes high-fidelity fallback datasets to guarantee continuous operation without external dependencies.

- **Backend** (`backend/.env`):
  ```env
  PORT=5000
  NEWS_API_KEY=your_news_api_key_here
  TMDB_API_KEY=your_tmdb_api_key_here
  ```

### 4. Running the Application

You can run both services concurrently or individually from the root directory:

#### Run Backend (Port 5000):
```bash
npm run dev:backend
```

#### Run Frontend (Port 3000):
```bash
npm run dev:frontend
```

Once started:
- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing

The test suite covers algorithmic scoring, Redux state transitions, custom hooks, and UI edge cases:

```bash
# Run all unit and integration tests
npm test
```

### Test Coverage Highlights:
- `personalization.test.ts`: Scoring calculation, explainability reasons, and custom sort order.
- `preferencesSlice.test.ts`: Category selection, minimum category safety rule, theme toggle.
- `favoritesSlice.test.ts`: Bookmark toggle, duplicate prevention, and bulk clear.
- `useDebounce.test.ts`: Search debounce timing and value stabilization.
- `EmptyState.test.tsx`: Empty state messages and callback actions.

---

## 🛠️ Tech Stack Summary

- **Frontend**: React 19, Next.js 16, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, `@dnd-kit`, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, CORS, Dotenv
- **Testing**: Vitest, React Testing Library, JSDOM
