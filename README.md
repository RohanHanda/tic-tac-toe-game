# 🎮 Tic-Tac-Toe — Minimax AI

A fully interactive Tic-Tac-Toe game where you play against an **optimal AI** powered by the **Minimax algorithm**. The AI never loses.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Flask](https://img.shields.io/badge/Flask-3.x-green)

## Features

- 🧠 **Minimax AI** — plays optimally; never loses
- 🎨 **Modern dark UI** with animations and responsive design
- 📊 **Scoreboard** tracks wins, losses, and draws
- 🔄 **AI-first mode** — let the AI make the opening move
- 🐳 **Docker-ready** and deployable to Render, Heroku, Railway, Fly.io, etc.

---

## Quick Start (Local)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd tic-tac-toe

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Open **http://localhost:5000** in your browser.

---

## Deploy with Docker

```bash
docker build -t tictactoe .
docker run -p 5000:5000 tictactoe
```

---

## Deploy to Render (Free Tier)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service**.
3. Connect your GitHub repo.
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Click **Deploy**. Done!

---

## Deploy to Heroku

```bash
heroku create my-tictactoe-app
git push heroku main
heroku open
```

---

## Deploy to Railway

1. Push to GitHub.
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**.
3. Railway auto-detects the `Procfile`. Done!

---

## Project Structure

```
├── app.py               # Flask backend + Minimax AI
├── requirements.txt     # Python dependencies
├── Procfile             # Process file for PaaS deployment
├── Dockerfile           # Container deployment
├── static/
│   ├── style.css        # Game styling
│   └── script.js        # Frontend game logic
└── templates/
    └── index.html       # Game page
```

---

## How the AI Works

The **Minimax algorithm** exhaustively searches every possible game state:

- The **AI (O)** is the **maximizer** — it picks moves with the highest score.
- The **Human (X)** is the **minimizer** — it assumes you play optimally too.
- Terminal states are scored: **+10** (AI wins), **-10** (Human wins), **0** (draw).
- Depth is factored in so the AI prefers **faster wins** and **slower losses**.

Since Tic-Tac-Toe has a small state space (~255K nodes), Minimax explores the
full tree with no pruning needed — guaranteeing **perfect play**.
