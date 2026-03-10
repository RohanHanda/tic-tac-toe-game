# 🎮 Tic-Tac-Toe — Minimax AI

A fully interactive Tic-Tac-Toe game where you play against an **optimal AI** powered by the **Minimax algorithm**. The AI never loses.

**🔗 Play it live:** [https://rohanhanda.github.io/tic-tac-toe-game/](https://rohanhanda.github.io/tic-tac-toe-game/)

## Features

- 🧠 **Minimax AI** — plays optimally; never loses
- 🎨 **Modern dark UI** with animations and responsive design
- 📊 **Scoreboard** tracks wins, losses, and draws
- 🔄 **AI-first mode** — let the AI make the opening move
- 🌐 **100% client-side** — runs entirely in the browser, no server needed
- 🚀 **Deployed on GitHub Pages**

## How It Works

The **Minimax algorithm** exhaustively searches every possible game state:

- The **AI (O)** is the **maximizer** — it picks moves with the highest score.
- The **Human (X)** is the **minimizer** — it assumes you play optimally too.
- Terminal states are scored: **+10** (AI wins), **−10** (Human wins), **0** (draw).
- Depth is factored in so the AI prefers **faster wins** and **slower losses**.

## Project Structure

```
├── index.html      # Game page
├── style.css       # Dark-themed styling with animations
├── script.js       # Minimax AI + game logic (all client-side)
└── README.md       # This file
```

## Deploy on GitHub Pages

1. Go to **Settings → Pages** in your repository.
2. Under **Source**, select **Deploy from a branch**.
3. Choose the **main** branch and **/ (root)** folder.
4. Click **Save**.
5. Your game will be live at `https://rohanhanda.github.io/tic-tac-toe-game/` in ~1 minute.

## Run Locally

Just open `index.html` in any browser — no server required!

```bash
git clone https://github.com/RohanHanda/tic-tac-toe-game.git
cd tic-tac-toe-game
open index.html
```

## License

MIT
