# Clicky Frontend

A beginner-friendly React dashboard for tracking website analytics from Clicky.

It gives users a clean place to:
- Sign in
- Add websites manually or by bulk upload
- View visitor trends and online visitors
- Organize websites by bookmark colors
- Search and sort tracked websites

## Why this project is useful

This frontend helps teams who monitor multiple websites and want one visual dashboard instead of checking raw analytics pages one by one.

It is especially helpful for:
- Freelancers managing many client websites
- Small teams needing quick traffic snapshots
- Beginners learning how to build a full-stack analytics dashboard

## Tech stack

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- Vitest + Testing Library

## Project structure (quick view)

- `src/pages` -> app screens (`Login`, `Dashboard`)
- `src/components` -> reusable UI and feature components
- `src/hooks` -> API-driven state logic (auth, websites)
- `src/lib` -> API client, auth storage, shared types

## Prerequisites

- Node.js 18+
- npm (or pnpm/bun if you prefer)

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in `frontend/` (recommended):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Base URL behavior:
- `development` default: `http://localhost:5000/api`
- `production` default: `/api` (same-origin, requires a proxy/rewrite to backend)

If frontend and backend are on different production domains, you must set:

```env
VITE_API_BASE_URL=https://<your-backend-domain>/api
```

3. Start dev server:

```bash
npm run dev
```

4. Open the app from the URL shown in terminal (usually `http://localhost:5173`).

## Available scripts

- `npm run dev` -> start local development server
- `npm run build` -> create production build
- `npm run build:dev` -> build with development mode
- `npm run preview` -> preview built app
- `npm run lint` -> run ESLint
- `npm run test` -> run tests once
- `npm run test:watch` -> run tests in watch mode

## Backend connection

The frontend expects the backend API to be running.

Default API base URL:
- development: `http://localhost:5000/api`
- production: `/api` unless `VITE_API_BASE_URL` is set

Main API flows used:
- `POST /auth/login`
- `GET /websites`
- `POST /websites`
- `POST /websites/import`
- `PATCH /websites/:websiteId/bookmark`

## Beginner workflow to explore

1. Run backend and frontend locally.
2. Sign in using the demo credentials from backend setup.
3. Add one website manually.
4. Try bulk import with an Excel/CSV file.
5. Use search, tags, and sorting to inspect data.

## Common issues

- Login fails: make sure backend is running and demo user exists.
- Empty dashboard: check if website entries were added and backend can fetch analytics.
- CORS issue: confirm backend `CLIENT_URL` includes your frontend URL.

## Next improvements you can build

- Protected route wrapper component
- Refresh token / persistent auth strategy
- Better loading and empty states per section
- More tests around dashboard interactions
