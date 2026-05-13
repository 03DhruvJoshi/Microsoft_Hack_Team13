# PrepPath

AI-powered interview preparation platform. Personalised roadmaps, live speech practice, AI feedback, and calendar sync — built for the Microsoft Hackathon.

---

## What it does

1. Upload your CV + job description → AI generates a personalised 3-week prep roadmap
2. Practice mock interview questions with live voice transcription
3. Get AI feedback on every answer (scored across 4 metrics)
4. Feedback adapts your roadmap to focus on weak areas
5. Download your schedule as a `.ics` calendar file or sync to Microsoft Calendar
6. Create an account to save your progress across sessions

---

## Project structure

```
deliverable/
├── frontend/                   React + Vite
│   ├── src/
│   │   ├── App.jsx             Root component & page router
│   │   ├── constants.js        API base URL
│   │   ├── theme.js            Theme tokens
│   │   └── components/
│   │       ├── Landing.jsx
│   │       ├── Login.jsx       Register / sign in
│   │       ├── Onboarding.jsx  CV + job description upload
│   │       ├── Dashboard.jsx   Progress overview
│   │       ├── Roadmap.jsx     3-week prep plan
│   │       ├── CalendarSync.jsx  ICS download + Microsoft Calendar
│   │       ├── Practice.jsx    Live speech practice
│   │       ├── Feedback.jsx    AI scoring + roadmap adaptation
│   │       ├── Header.jsx
│   │       └── AccessibilityToolbar.jsx
│   ├── vite.config.js          Proxies /api and /auth to backend
│   └── package.json
│
└── backend/                    FastAPI (Python)
    ├── main.py                 App entry point — mounts all routers
    ├── config.py               Settings from .env
    ├── database.py             SQLAlchemy + SQLite setup
    ├── requirements.txt
    ├── .env.example            Template — copy to .env
    ├── models/                 Database models (User, Roadmap, PracticeSession)
    ├── services/               Business logic
    │   ├── openai_service.py   Azure OpenAI chat calls
    │   ├── whisper_service.py  Audio transcription
    │   ├── auth_service.py     JWT + bcrypt
    │   ├── calendar_service.py ICS file generation
    │   └── microsoft_service.py  Microsoft Graph API
    └── routers/                One file per feature
        ├── auth.py             POST /auth/register, /auth/login, GET /auth/me
        ├── analyze.py          POST /api/analyze
        ├── questions.py        POST /api/questions/regenerate
        ├── transcription.py    POST /api/transcribe
        ├── feedback.py         POST /api/feedback
        ├── calendar.py         POST /api/calendar/download
        ├── roadmap.py          POST /api/roadmap/adapt
        └── microsoft.py        GET /api/microsoft/auth + /callback, POST /api/microsoft/sync
```

---

## Requirements

- **Python 3.11+**
- **Node.js 18+**
- A modern browser — **Chrome or Edge** for live speech transcription

---

## Running locally

### Step 1 — Configure the backend

```bash
cd deliverable/backend
copy .env.example .env
```

Open `.env` and fill in your own API keys — **the repo does not ship credentials**:

| Key | Required | Used for |
|-----|----------|----------|
| `AZURE_OPENAI_KEY` | **Yes** | Roadmap generation, AI feedback, question generation |
| `OPENAI_API_KEY` | **Yes** | Whisper audio transcription (live practice feature) |
| `MS_CLIENT_ID` / `MS_CLIENT_SECRET` | Optional | Microsoft Calendar sync |

Without both required keys the backend will start but API calls will return 500 errors.

### Step 2 — Start the backend

The project has a root `venv`. Activate it, then start the server:

```bash
# From the repo root
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

cd deliverable/backend
python main.py
```

The API starts at **http://localhost:8000**  
Interactive docs at **http://localhost:8000/docs**

> **First run:** A `preppath.db` SQLite database is created automatically in the backend folder.

### Step 3 — Start the frontend

Open a **second terminal** (no venv needed):

```bash
cd deliverable/frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**

Vite automatically proxies `/api/*` and `/auth/*` to the backend — no CORS setup required.

---

## Using the app

| Step | What to do |
|------|------------|
| **1. Land** | Click *Get started* on the welcome page |
| **2. Sign up (optional)** | Register to save your roadmap across sessions, or continue as guest |
| **3. Onboard** | Paste your CV text and job description, pick an interview date |
| **4. Roadmap** | Review your AI-generated 3-week plan and skill gap analysis |
| **5. Calendar** | Download the `.ics` file or sync to Microsoft Calendar |
| **6. Practice** | Click *Start Recording* — speak your answer and watch it transcribe live |
| **7. Feedback** | Review your score across 4 metrics; click *Adapt My Roadmap* if score < 70 |
| **8. Repeat** | Work through all questions; your roadmap updates as you improve |

---

## Configuration

Copy `.env.example` to `.env` and fill in values as needed:

```env
# REQUIRED — Azure OpenAI (powers roadmap, feedback, questions)
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com
AZURE_OPENAI_KEY=<your-azure-openai-key>
AZURE_OPENAI_MODEL=<your-deployment-name>
AZURE_OPENAI_VERSION=2024-12-01-preview

# REQUIRED — OpenAI (Whisper transcription for live practice)
OPENAI_API_KEY=<your-openai-api-key>

# Optional — change for production
SECRET_KEY=change-me-in-production

# Optional — Microsoft Calendar sync
# 1. Go to https://portal.azure.com → Azure Active Directory → App registrations
# 2. New registration → Redirect URI: http://localhost:8000/api/microsoft/callback
# 3. API permissions → Microsoft Graph → Calendars.ReadWrite (delegated)
# 4. Certificates & secrets → New client secret
MS_CLIENT_ID=your-app-client-id
MS_CLIENT_SECRET=your-client-secret
MS_TENANT_ID=common
MS_REDIRECT_URI=http://localhost:8000/api/microsoft/callback
MS_FRONTEND_URL=http://localhost:5173
```

---

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account → returns JWT |
| POST | `/auth/login` | Sign in → returns JWT |
| GET | `/auth/me` | Get current user (requires Bearer token) |
| POST | `/api/analyze` | CV + JD → roadmap JSON |
| POST | `/api/feedback` | Question + transcript → scored feedback |
| POST | `/api/questions/regenerate` | Generate targeted questions |
| POST | `/api/transcribe` | Audio/video file → transcript text |
| POST | `/api/calendar/download` | Roadmap → `.ics` file |
| POST | `/api/roadmap/adapt` | Feedback history → adapted roadmap |
| GET | `/api/microsoft/auth` | Start Microsoft OAuth2 flow |
| POST | `/api/microsoft/sync` | Push roadmap events to Outlook |
| GET | `/health` | Server health check |

---

## Building for production

```bash
# Build the frontend
cd deliverable/frontend
npm run build          # outputs to frontend/dist/

# Serve both frontend and API from one server
# Add this to backend/main.py before running:
#
# from fastapi.staticfiles import StaticFiles
# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")
#
# Then just run: python main.py
```

---

## AI types used

| AI Capability | Technology | Feature |
|---|---|---|
| Generative LLM | Azure OpenAI GPT-5.4 | Roadmap, feedback, questions, adaptation |
| Speech recognition | Web Speech API (browser) | Live practice transcription |
| Adaptive personalisation | LLM feedback loop | Roadmap re-generation from scores |
| Structured generation | Prompt engineering | JSON-constrained LLM output |
| Calendar intelligence | LLM → ICS events | Scheduling from roadmap tasks |

---

## Accessibility

PrepPath is built accessibility-first. The toolbar (bottom-right on every page) provides:

- High contrast mode
- Dyslexia-friendly font (OpenDyslexic)
- Reduce motion
- Text size adjustment (slider)
- Zoom levels (100% / 125% / 150%)

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Lucide icons |
| Backend | FastAPI, Python 3.11 |
| Database | SQLite via SQLAlchemy |
| Auth | JWT (python-jose) + bcrypt |
| AI | Azure OpenAI GPT-5.4, Web Speech API |
| Calendar | ICS generation, Microsoft Graph API |
| Fonts | Inter, Fraunces, JetBrains Mono, OpenDyslexic |
