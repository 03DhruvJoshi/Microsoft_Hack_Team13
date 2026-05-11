# PrepPath — Deliverable

AI-powered interview prep tool. Modular React + Vite frontend, FastAPI backend.

## Project structure

```
deliverable/
├── frontend/           React + Vite app (modular components)
│   ├── src/
│   │   ├── App.jsx             Root component & page router
│   │   ├── main.jsx            React entry point
│   │   ├── constants.js        Shared constants (API base URL)
│   │   ├── theme.js            Theme token builder
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── AccessibilityToolbar.jsx
│   │       ├── Landing.jsx
│   │       ├── Onboarding.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Roadmap.jsx
│   │       ├── CalendarSync.jsx
│   │       ├── Practice.jsx
│   │       └── Feedback.jsx
│   ├── index.html
│   ├── vite.config.js          Proxies /api → localhost:8000 in dev
│   └── package.json
└── backend/            FastAPI server
    ├── main.py
    └── requirements.txt
```

---

## Running locally

### 1. Backend

```bash
cd deliverable/backend

# Create & activate a virtual environment (recommended)
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python main.py
# Server starts at http://localhost:8000
```

### 2. Frontend

Open a **second terminal**:

```bash
cd deliverable/frontend
npm install
npm run dev
# App starts at http://localhost:5173
```

The Vite dev server automatically proxies `/api/*` requests to `http://localhost:8000`, so no CORS issues in development.

---

## Building for production

```bash
cd deliverable/frontend
npm run build        # outputs to frontend/dist/
```

To serve the built frontend through FastAPI (single-server deployment), add this to `backend/main.py`:

```python
from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")
```

Then run only the backend — it serves both the API and the frontend.

---

## Environment / configuration

The Azure OpenAI credentials are currently hard-coded in `backend/main.py`. For production, move them to environment variables:

```bash
export AZURE_OPENAI_ENDPOINT="..."
export AZURE_OPENAI_KEY="..."
```

And update `main.py` to read them with `os.environ.get(...)`.
