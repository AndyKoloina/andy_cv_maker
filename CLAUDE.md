# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running the full stack
```bash
docker-compose up --build
```
Frontend at `http://localhost:80`, backend at `http://localhost:3000`.

### Frontend (dev)
```bash
cd frontend && npm install && npm run dev
```
Note: the Vite config has no proxy — `/api/generate` calls will fail without the Docker backend running. In dev, start the backend separately or run via Docker.

### Backend (dev)
```bash
cd backend && npm install && npm run build && npm run start
```
Requires `DATABASE_URL` and `REDIS_URL` env vars (see `docker-compose.yml` for values).

### Prisma
```bash
cd backend && npx prisma generate       # regenerate client after schema changes
cd backend && npx prisma migrate dev    # create and apply a migration
```

There is no test suite yet.

## Architecture

This is a monorepo: `backend/`, `frontend/`, `shared/`, with Docker orchestration at the root.

### Shared schema (`shared/schema.ts`)
Zod schemas (`ResumeSchema`, `ExperienceSchema`) and their inferred TypeScript types are defined once and consumed by both sides. The backend `tsconfig.json` sets `rootDir: "../"` so the `shared/` directory compiles into `dist/shared/`. The frontend includes `../shared` in its `tsconfig.json` and resolves the files directly via relative imports at `../../../shared/schema`.

### Backend (`backend/src/`)
Single Express endpoint: `POST /api/generate`.

Request flow:
1. `ResumeSchema.parse(req.body)` — Zod validates the payload
2. `CacheService.getPdf(data)` — SHA-256 hash of the JSON payload used as Redis key; returns cached PDF if found (1-hour TTL)
3. `PdfService.generate(data)` — compiles a Handlebars HTML template and renders it to PDF via Puppeteer (`--no-sandbox` flags required for Docker)
4. `CacheService.setPdf(...)` — stores result in Redis
5. PDF buffer returned as `application/pdf`

`DbService` (Prisma/PostgreSQL) and JWT auth are stubbed but not wired up. The controller has a comment marking where `DbService.saveResume` would be called for authenticated users.

### Frontend (`frontend/src/`)
Two-panel layout: `Editor` (left half) fills in personal info and experiences; `Preview` (right half) renders a live A4-scaled preview using the same data.

State is managed by a single Zustand store (`useResumeStore`) persisted to `localStorage` under the key `cv-storage`. The `Editor` posts the full store data to `/api/generate` and triggers a file download on success.

### Unimplemented schema fields
`ResumeSchema` includes `metadata.template` (`FRENCH | CANADIAN`) and `metadata.language` (`fr | en`), but `PdfService` currently uses a single hardcoded Handlebars template that ignores these fields.
