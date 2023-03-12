# Radiology Copilot

Radiology Copilot is a full-stack scaffold for an AI-assisted radiology workflow. It combines a Next.js clinical workbench, a FastAPI backend, PostgreSQL persistence, DICOM upload/parsing, a MONAI/PyTorch inference boundary, and OpenAI-powered streaming report drafts.

<a href="https://faithokonkwor.github.io/radiology-copilot/">
  <img src="/images/app-image.png" width="100%"/>
</a>

---

🔗 **[Live Demo](https://faithokonkwor.github.io/radiology-copilot/)**

> [!IMPORTANT]
> Radiology Copilot is a development scaffold for radiologist-in-the-loop workflows. It is **not** a certified medical device, does **not** provide autonomous diagnosis, and must not be used for clinical decisions without appropriate validation, security review, regulatory review, and qualified clinician sign-off.

## Table of contents

- [What this project does](#what-this-project-does)
- [Feature highlights](#feature-highlights)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Quick start with Docker Compose](#quick-start-with-docker-compose)
- [Local development](#local-development)
- [Frontend guide](#frontend-guide)
- [Backend guide](#backend-guide)
- [Database schema](#database-schema)
- [API reference](#api-reference)
- [AI and imaging workflow](#ai-and-imaging-workflow)
- [Static GitHub Pages demo](#static-github-pages-demo)
- [Quality checks](#quality-checks)
- [Security, privacy, and compliance notes](#security-privacy-and-compliance-notes)
- [Production hardening checklist](#production-hardening-checklist)
- [Troubleshooting](#troubleshooting)
- [Roadmap ideas](#roadmap-ideas)
- [Contributing](#contributing)
- [License](#license)

## What this project does

Radiology Copilot models a modern reporting workspace where imaging teams can:

1. Upload DICOM studies from CT, MRI, X-ray, ultrasound, or other modalities.
2. Extract metadata from uploaded DICOM files.
3. Persist study, series, finding, report, user, and assistant-message data in PostgreSQL.
4. Run a deterministic local abnormality-detection baseline through a MONAI/PyTorch service boundary.
5. Display study details and AI finding overlays in a frontend viewer experience.
6. Draft structured radiology reports with streaming OpenAI responses when an API key is available.
7. Fall back to deterministic offline report/chat text when OpenAI is not configured.
8. Save drafts and review operational dashboard metrics.

The repository is intentionally scaffold-oriented: it provides clear extension points for validated models, DICOMweb/PACS integrations, authentication hardening, signed-report workflows, and clinical deployment controls.

## Feature highlights

- **DICOM upload pipeline** with metadata extraction via `pydicom`.
- **Study worklist** backed by PostgreSQL tables for users, studies, series, findings, reports, and assistant messages.
- **AI detection boundary** using MONAI/PyTorch transforms with a deterministic baseline that works without model weights.
- **Structured report generation** using an OpenAI streaming API path when `OPENAI_API_KEY` is configured.
- **Offline-safe development mode** with deterministic report and chat fallback output.
- **Radiology assistant chat** for contextual questions about study findings and report drafting.
- **Responsive frontend** built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui-style primitives.
- **Cornerstone.js-ready viewer component** for future DICOM image loading and annotation overlays.
- **JWT-ready authentication endpoints** for registration and login flows.
- **Dashboard analytics** summarizing total studies, pending reports, critical findings, and turnaround estimates.
- **Docker Compose stack** for frontend, backend, and PostgreSQL.
- **Static demo build** for GitHub Pages deployment.

## Technology stack

| Layer | Tools |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide icons, Radix Slot, Cornerstone.js packages |
| Backend | FastAPI, Uvicorn, Pydantic Settings, SQLAlchemy async, asyncpg |
| AI/reporting | OpenAI Python SDK, streaming chat completions, deterministic offline fallback |
| Imaging/ML | pydicom, MONAI, PyTorch, NumPy, Pillow |
| Database | PostgreSQL 16 with `pgcrypto` UUID generation |
| DevOps | Docker, Docker Compose, static Next.js export for GitHub Pages |

## Architecture

```mermaid
flowchart LR
  Browser[Browser / Next.js UI] -->|REST + streaming fetch| API[FastAPI backend]
  API -->|async SQL| DB[(PostgreSQL)]
  API -->|DICOM bytes| Uploads[(uploads volume)]
  API -->|metadata extraction| DICOM[pydicom]
  API -->|baseline inference boundary| MONAI[MONAI / PyTorch]
  API -->|optional streaming| OpenAI[OpenAI API]
  Browser -->|static demo build| Pages[GitHub Pages]
```

### Runtime flow

1. The frontend calls `NEXT_PUBLIC_API_URL` for API requests.
2. The backend reads environment variables through Pydantic Settings.
3. Uploaded files are written under `UPLOAD_DIR`.
4. DICOM metadata is extracted and normalized.
5. The detection service returns zero or more findings.
6. Study, series, finding, and report records are stored in PostgreSQL.
7. Report and chat endpoints stream plain-text chunks to the frontend.

## Repository layout

```text
radiology-copilot/
├── .github/
│   └── workflows/
│       └── pages.yml
├── .gitignore
├── .gitkeep
├── LICENSE
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── session.py
│   │   ├── main.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── api.py
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── ai_detection.py
│   │       ├── imaging.py
│   │       └── reporting.py
│   └── pyproject.toml
├── images/
│   └── app-image.png
├── database/
│   └── init.sql
├── docker-compose.yml
└── frontend/
    ├── .eslintrc.json
    ├── Dockerfile
    ├── app/
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── login/
    │   │   └── page.tsx
    │   ├── page.tsx
    │   ├── reports/
    │   │   └── page.tsx
    │   ├── studies/
    │   │   └── [id]/
    │   │       └── page.tsx
    │   └── upload/
    │       └── page.tsx
    ├── components/
    │   ├── ai/
    │   │   └── chat-assistant.tsx
    │   ├── dashboard/
    │   │   └── analytics-cards.tsx
    │   ├── demo/
    │   │   ├── demo-footer.tsx
    │   │   └── theme-toggle.tsx
    │   ├── dicom/
    │   │   └── dicom-viewer.tsx
    │   ├── layout/
    │   │   └── sidebar.tsx
    │   ├── reports/
    │   │   └── report-editor.tsx
    │   ├── ui/
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   └── input.tsx
    │   └── upload/
    │       └── upload-dropzone.tsx
    ├── lib/
    │   ├── api.ts
    │   └── utils.ts
    ├── next-env.d.ts
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.js
    ├── public/
    │   └── .nojekyll
    ├── tailwind.config.ts
    └── tsconfig.json
```

## Prerequisites

Choose either Docker Compose or local tooling.

### Docker path

- Docker Engine or Docker Desktop
- Docker Compose v2 (`docker compose version`)

### Local development path

- Python 3.11+
- Node.js 20+
- npm 10+
- PostgreSQL 16+ or a compatible managed PostgreSQL database
- Optional: an OpenAI API key for live streaming report/chat generation

## Configuration

The backend reads configuration from environment variables. When running locally from `backend/`, it also reads a `.env` file in that directory.

| Variable | Default | Description |
| --- | --- | --- |
| `APP_ENV` | `development` | Runtime environment label. |
| `SECRET_KEY` | `change-me-in-production` | JWT signing secret. Replace for any shared environment. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Login token lifetime in minutes. |
| `DATABASE_URL` | `postgresql+asyncpg://radiology:radiology@localhost:5432/radiology_copilot` | Async SQLAlchemy connection string. |
| `OPENAI_API_KEY` | unset | Enables live OpenAI streaming when set. |
| `OPENAI_MODEL` | `gpt-4.1-mini` | Model used by report and assistant streams. |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed browser origins. |
| `UPLOAD_DIR` | `uploads` | Directory for uploaded DICOM files. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Frontend API base URL. |
| `NEXT_PUBLIC_BASE_PATH` | unset | Static export base path, used by the GitHub Pages build. |

### Example backend environment file

Create `backend/.env` for local backend development:

```env
APP_ENV=development
SECRET_KEY=replace-with-a-local-dev-secret
DATABASE_URL=postgresql+asyncpg://radiology:radiology@localhost:5432/radiology_copilot
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
CORS_ORIGINS=http://localhost:3000
UPLOAD_DIR=uploads
```

### Example Compose environment file

`docker-compose.yml` currently references `.env.example` through `env_file`. If your clone does not include that file, create it in `radiology-copilot/` before running Compose:

```env
APP_ENV=development
SECRET_KEY=replace-with-a-compose-dev-secret
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
ACCESS_TOKEN_EXPIRE_MINUTES=60
UPLOAD_DIR=uploads
```

## Quick start with Docker Compose

From the repository root that contains `docker-compose.yml`:

```bash
cd radiology-copilot
cat > .env.example <<'ENV'
APP_ENV=development
SECRET_KEY=replace-with-a-compose-dev-secret
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
ACCESS_TOKEN_EXPIRE_MINUTES=60
UPLOAD_DIR=uploads
ENV

docker compose up --build
```

Open the services:

- Frontend: <http://localhost:3000>
- API health check: <http://localhost:8000/health>
- API docs: <http://localhost:8000/docs>
- PostgreSQL: `localhost:5432` with database/user/password `radiology` / `radiology` / `radiology`

Stop the stack:

```bash
docker compose down
```

Remove local database state as well:

```bash
docker compose down -v
```

## Local development

Run the database, backend, and frontend in separate terminals.

### 1. Start PostgreSQL

You can use the Compose database only:

```bash
cd radiology-copilot
docker compose up postgres
```

Or use your own PostgreSQL instance and apply the schema:

```bash
psql "$DATABASE_URL" -f database/init.sql
```

### 2. Start the backend

```bash
cd radiology-copilot/backend
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:

- Health: <http://localhost:8000/health>
- OpenAPI JSON: <http://localhost:8000/openapi.json>
- Swagger UI: <http://localhost:8000/docs>

### 3. Start the frontend

```bash
cd radiology-copilot/frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

Frontend URL:

- App: <http://localhost:3000>

## Frontend guide

### Main routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing/demo landing page. |
| `/login` | Login UI scaffold. |
| `/dashboard` | Analytics cards and operational summary. |
| `/upload` | DICOM upload workflow. |
| `/studies/[id]` | Study detail, viewer, findings, report editor, and assistant context. |
| `/reports` | Report review workspace. |

### Important frontend files

| File | Responsibility |
| --- | --- |
| `frontend/lib/api.ts` | Shared fetch helper, API types, and streaming text helper. |
| `frontend/components/upload/upload-dropzone.tsx` | Upload interaction and API call into `/api/studies/upload`. |
| `frontend/components/dicom/dicom-viewer.tsx` | Viewer shell and overlay-ready study display. |
| `frontend/components/reports/report-editor.tsx` | Structured report drafting/editing UI. |
| `frontend/components/ai/chat-assistant.tsx` | Streaming assistant UI. |
| `frontend/components/dashboard/analytics-cards.tsx` | Summary metrics presentation. |

### Frontend commands

```bash
npm run dev          # Start local Next.js dev server
npm run build        # Build production Next.js app
npm run start        # Serve production build
npm run lint         # Run Next.js linting
npm run typecheck    # Run TypeScript compiler without emitting files
npm run build:pages  # Static export configured for GitHub Pages
```

## Backend guide

### Important backend files

| File | Responsibility |
| --- | --- |
| `backend/app/main.py` | FastAPI app creation, CORS, health check, router registration, and global error handling. |
| `backend/app/api/routes.py` | API routes for auth, studies, findings, reports, assistant streaming, and analytics. |
| `backend/app/core/config.py` | Pydantic Settings environment configuration. |
| `backend/app/core/security.py` | Password hashing, password verification, and JWT creation helpers. |
| `backend/app/db/session.py` | Async SQLAlchemy engine and session dependency. |
| `backend/app/schemas/api.py` | Pydantic request and response schemas. |
| `backend/app/services/imaging.py` | DICOM upload storage and metadata extraction. |
| `backend/app/services/ai_detection.py` | MONAI/PyTorch abnormality detection service boundary. |
| `backend/app/services/reporting.py` | OpenAI streaming report/chat generation and offline fallback text. |

### Backend commands

```bash
pip install -e '.[dev]'                 # Install backend and dev dependencies
uvicorn app.main:app --reload           # Start API server
ruff check .                            # Lint backend code
pytest                                  # Run backend tests when tests are added
```

## Database schema

`database/init.sql` creates the initial PostgreSQL schema:

| Table | Purpose |
| --- | --- |
| `users` | Radiology users with email, name, role, password hash, and creation timestamp. |
| `studies` | Uploaded study records with patient metadata, modality, body part, owner, status, and timestamp. |
| `series` | Study series records with DICOM series UID, description, image count, and storage path. |
| `findings` | AI detections with label, confidence, severity, optional bounding box, optional heatmap path, and model name. |
| `reports` | Draft/signed report fields including indication, technique, findings, impression, author, and timestamps. |
| `assistant_messages` | User, assistant, and system messages tied to studies/users for future conversation history. |

Useful indexes are created for study worklists, findings-by-study lookups, and reports-by-study lookups.

## API reference

Base URL in local development: `http://localhost:8000`.

| Method | Path | Purpose | Request body |
| --- | --- | --- | --- |
| `GET` | `/health` | Service health check. | None |
| `POST` | `/api/auth/register` | Create a user and return an access token. | `{ "email": string, "full_name": string, "password": string }` |
| `POST` | `/api/auth/login` | Authenticate and return a bearer token. | `{ "email": string, "password": string }` |
| `POST` | `/api/studies/upload` | Upload a DICOM file and run the detection boundary. | Multipart form field named `file` |
| `GET` | `/api/studies` | Return up to 50 recent studies. | None |
| `GET` | `/api/studies/{study_id}/findings` | Return findings for a study. | None |
| `POST` | `/api/reports/stream` | Stream a report draft as `text/plain`. | `{ "study_id": string, "indication"?: string, "technique"?: string, "findings_context": Finding[] }` |
| `POST` | `/api/reports` | Save a report draft. | Report fields matching the database model |
| `GET` | `/api/reports/{study_id}` | Return saved reports for a study. | None |
| `POST` | `/api/assistant/stream` | Stream assistant chat output as `text/plain`. | `{ "study_id"?: string, "message": string, "context"?: string }` |
| `GET` | `/api/analytics/summary` | Return dashboard metrics. | None |

### Example requests

Register a user:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"rad@example.com","full_name":"Radiologist User","password":"password123"}'
```

Upload a DICOM file:

```bash
curl -X POST http://localhost:8000/api/studies/upload \
  -F "file=@/path/to/study.dcm"
```

Stream a report draft:

```bash
curl -N -X POST http://localhost:8000/api/reports/stream \
  -H 'Content-Type: application/json' \
  -d '{"study_id":"00000000-0000-0000-0000-000000000000","indication":"Chest pain","technique":"Portable chest radiograph","findings_context":[]}'
```

## AI and imaging workflow

### DICOM handling

- Uploaded files are saved under `UPLOAD_DIR` in UUID-named directories.
- Filenames are normalized to their basename before writing to disk.
- Metadata extraction uses `pydicom.dcmread(..., stop_before_pixels=True, force=True)` to avoid loading full pixel data during metadata parsing.
- Modality values are normalized to `CT`, `MRI`, `XRAY`, `US`, or `OTHER`.

### Detection boundary

The detection service currently:

1. Reads a small byte window from the uploaded file.
2. Converts the bytes into a tensor-like image representation.
3. Applies MONAI transforms.
4. Computes a deterministic score from intensity and texture statistics.
5. Returns no findings for low scores or one representative finding for higher scores.

This is useful for development and integration testing, but production use should replace `_predict` with a validated model, modality-specific preprocessing, calibrated thresholds, model cards, bias/performance evaluation, and post-market monitoring.

### Report generation

When `OPENAI_API_KEY` is set, report and assistant endpoints stream model output. When it is not set, the backend streams deterministic fallback text so the UI remains functional in offline development.

Generated text is intended as a draft only. Human radiologist review is required before sign-off.

## Static GitHub Pages demo

The frontend includes a static export path intended for GitHub Pages.

```bash
cd radiology-copilot/frontend
npm install
npm run build:pages
```

The `build:pages` script sets:

```bash
NEXT_EXPORT=true NEXT_PUBLIC_BASE_PATH=/radiology-copilot next build
```

The output is generated in `frontend/out` when static export is enabled by the Next.js configuration.

## Quality checks

Recommended checks before opening a pull request:

```bash
cd radiology-copilot/frontend
npm run lint
npm run typecheck
npm run build
```

```bash
cd radiology-copilot/backend
ruff check .
pytest
```

```bash
cd radiology-copilot
docker compose config
docker compose up --build
```

## Security, privacy, and compliance notes

This scaffold touches sensitive clinical-data concepts. Treat it as non-production until the following areas are addressed:

- **PHI handling:** define data-retention, redaction, masking, and minimum-necessary access policies.
- **Transport security:** terminate TLS at the edge and use secure service-to-service networking.
- **Secrets management:** replace local `.env` files with a managed secret store in deployed environments.
- **Authentication and authorization:** add RBAC, account lifecycle management, token refresh/revocation, and audit trails.
- **Storage security:** encrypt uploads and database volumes at rest; use scoped object-storage credentials.
- **Audit logging:** log access to patient/study/report data and administrative actions.
- **Clinical safety:** validate model performance locally, document intended use, and require radiologist sign-off.
- **Regulatory review:** consult qualified regulatory and legal experts before clinical deployment.

## Production hardening checklist

- Replace the deterministic detection baseline with validated MONAI model weights and modality-specific preprocessing.
- Add DICOMweb/WADO-RS or PACS/RIS integrations for image retrieval and workflow interoperability.
- Implement a robust SQLAlchemy model layer and Alembic migrations.
- Add object storage for studies, generated heatmaps, and exports.
- Implement signed-report lifecycle states, PDF export, report versioning, addenda, and comparison workflows.
- Add structured observability: logs, traces, metrics, model drift monitoring, and alerting.
- Add comprehensive tests: unit, integration, contract, browser e2e, security, and model validation tests.
- Add CI/CD workflows for linting, type-checking, tests, image builds, and deployment.
- Review CORS, CSP, CSRF, rate limiting, upload size limits, file type validation, and vulnerability scanning.
- Configure backups, restore drills, disaster recovery, and environment-specific retention policies.

## Troubleshooting

### `docker compose` reports that `.env.example` is missing

Create `radiology-copilot/.env.example` using the example in the [Configuration](#configuration) section, or update `docker-compose.yml` to point to your preferred env file.

### The frontend cannot reach the API

- Confirm the backend is running at <http://localhost:8000/health>.
- Set `NEXT_PUBLIC_API_URL=http://localhost:8000` before starting the frontend.
- Confirm `CORS_ORIGINS` includes the frontend origin, usually `http://localhost:3000`.

### OpenAI responses are not streaming live model output

- Confirm `OPENAI_API_KEY` is set in the backend environment.
- Confirm `OPENAI_MODEL` is available to your OpenAI account.
- If no key is configured, the offline fallback is expected.

### Database connection fails

- Confirm PostgreSQL is running.
- Confirm `DATABASE_URL` uses the `postgresql+asyncpg://` scheme.
- If running backend on the host and PostgreSQL in Compose, use `localhost:5432`.
- If running backend inside Compose, use the service hostname `postgres:5432`.

### DICOM uploads appear as `OTHER` modality

The metadata parser falls back to `OTHER` when the file is missing a recognized modality or cannot be parsed. Confirm the uploaded file contains a valid DICOM `Modality` tag.

## Roadmap ideas

- DICOMweb image loading and multi-frame/series browsing.
- Real segmentation masks, heatmaps, measurements, and annotation persistence.
- Prior-study comparison and longitudinal change summaries.
- Structured report templates by modality/body part.
- Role-based sign-off, peer review, and addendum workflows.
- FHIR/RIS/PACS integrations.
- De-identification tooling for demo and test datasets.
- Evaluation harnesses for report quality, hallucination checks, and model safety.

## Contributing

1. Fork or branch from the current repository.
2. Keep changes focused and documented.
3. Run relevant frontend, backend, and Compose checks.
4. Avoid committing generated artifacts, local virtual environments, uploaded studies, secrets, or `node_modules`.
5. Open a pull request with a clear summary, testing notes, and screenshots for visible UI changes.

## License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
