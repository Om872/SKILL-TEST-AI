# Skill Test AI 

A full-stack, AI-powered web application that allows users to take skill-based tests (like Python, Java, Data Science), get AI-generated questions, and receive detailed performance analysis.

## Features Built
- **Responsive Animations & Glassmorphism**: Utilizes TailwindCSS and Framer Motion.
- **Authentication**: JWT-based login and registration system.
- **Dynamic Quiz Generation**: Using OpenRouter AI models (Google/Gemini-Pro).
- **Test Timers**: Built-in 10-minute countdown for all assessments.
- **Analytics Dashboard**: Tracks historic performances, aggregates values, and provides suggestions.
- **Chart Analysis**: Visual feedback using Chart.js to map correct/incorrect accuracy ratios.

## Directory Structure
- `frontend/`: React.js (Vite) + Tailwind CSS client.
- `backend/`: Flask (Python) + SQLite / PostgreSQL API handling auth, database, and OpenRouter API proxy.

## Setup Instructions

### 1. Setup Backend
Open your terminal and create a virtual environment in the `backend` directory.

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # (Windows)
pip install -r requirements.txt
```

#### Environment Configuration (.env)
Update `.env` in the `backend` folder with your actual API key:
```env
OPENROUTER_API_KEY=your_actual_api_key_here
SECRET_KEY=secure_key_123
DATABASE_URL=sqlite:///skilltest.db
```

#### Run Backend
```bash
python app.py
```
> The API will be available on http://127.0.0.1:5000/api.

### 2. Setup Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

> Open your local server at http://localhost:5173.

## Deployment Configuration
- `vercel.json` has been included in the `frontend` folder for seamless Vercel hosting.
- `backend/requirements.txt` is ready for deployment on a PaaS like Render or Railway. Change your `DATABASE_URL` during deployment to connect a live PostgreSQL database instance.
