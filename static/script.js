/* ═══════════════════════════════════════════════════════════════════
   Tic-Tac-Toe  —  Frontend Game Logic
   ═══════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  // ── DOM refs ──────────────────────────────────────────────────
  const boardEl       = document.getElementById("board");
  const statusEl      = document.getElementById("status");
  const btnRestart    = document.getElementById("btn-restart");
  const btnReset      = document.getElementById("btn-reset-scores");
  const aiFirstCheck  = document.getElementById("ai-first");
  const scoreHumanEl  = document.getElementById("score-human");
  const scoreDrawEl   = document.getElementById("score-draw");
  const scoreAIEl     = document.getElementById("score-ai");
  const cells         = document.querySelectorAll(".cell");

  // ── State ─────────────────────────────────────────────────────
  let board      = [["","",""], ["","",""], ["","",""]];
  let gameOver   = false;
  let locked     = false;   // true while waiting for AI
  let scores     = { human: 0, ai: 0, draw: 0 };

  // ── Initialise ────────────────────────────────────────────────
  function init() {
    board    = [["","",""], ["","",""], ["","",""]];
    gameOver = false;
    locked   = false;

    cells.forEach((c) => {
      c.textContent = "";
      c.className   = "cell";
    });

    boardEl.classList.remove("thinking");
    statusEl.className = "status";

    if (aiFirstCheck.checked) {
      statusEl.textContent = "AI is thinking…";
      locked = true;
      boardEl.classList.add("thinking");
      requestAIMove();
    } else {
      statusEl.textContent = "Your turn — click a cell";
    }
  }

  // ── Cell click handler ────────────────────────────────────────
  function handleCellClick(e) {
    if (gameOver || locked) return;

    const cell = e.currentTarget;
    const r = parseInt(cell.dataset.row, 10);
    const c = parseInt(cell.dataset.col, 10);

    if (board[r][c] !== "") return;

    // Place human mark
    board[r][c] = "X";
    renderCell(cell, "X");

    // Quick client-side terminal check before calling API
    if (checkLocalTerminal()) return;

    // Ask AI
    locked = true;
    boardEl.classList.add("thinking");
    statusEl.textContent = "AI is thinking…";
    requestAIMove();
  }

  // ── Render a cell ─────────────────────────────────────────────
  function renderCell(cell, mark) {
    cell.textContent = mark;
    cell.classList.add("taken", mark.toLowerCase(), "pop");
  }

  // ── Request AI move via API ───────────────────────────────────
  async function requestAIMove() {
    try {
      const res  = await fetch("/api/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board }),
      });
      const data = await res.json();

      if (data.row >= 0 && data.col >= 0) {
        board[data.row][data.col] = "O";
        const idx  = data.row * 3 + data.col;
        renderCell(cells[idx], "O");
      }

      if (data.winner) {
        endGame(data.winner, data.winning_line);
      } else if (data.draw) {
        endGame(null, null);
      } else {
        locked = false;
        boardEl.classList.remove("thinking");
        statusEl.textContent = "Your turn — click a cell";
      }
    } catch (err) {
      console.error("AI request failed:", err);
      statusEl.textContent = "Error contacting server. Try again.";
      locked = false;
      boardEl.classList.remove("thinking");
    }
  }

  // ── Quick local terminal check (before API call) ──────────────
  function checkLocalTerminal() {
    const w = localWinner();
    if (w) {
      // Let the API confirm & get winning line
      locked = true;
      boardEl.classList.add("thinking");
      requestAIMove();   // will detect terminal state
      return true;
    }
    // Check draw
    const empty = board.flat().filter((v) => v === "").length;
    if (empty === 0) {
      locked = true;
      requestAIMove();
      return true;
    }
    return false;
  }

  function localWinner() {
    const lines = [
      [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
      [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      const v = board[a[0]][a[1]];
      if (v && v === board[b[0]][b[1]] && v === board[c[0]][c[1]]) return v;
    }
    return null;
  }

  // ── End game ──────────────────────────────────────────────────
  function endGame(winner, winningLine) {
    gameOver = true;
    locked   = false;
    boardEl.classList.remove("thinking");

    cells.forEach((c) => c.classList.add("game-over"));

    if (winner === "X") {
      statusEl.textContent = "You win! 🎉";
      statusEl.className   = "status win";
      scores.human++;
    } else if (winner === "O") {
      statusEl.textContent = "AI wins! 🤖";
      statusEl.className   = "status lose";
      scores.ai++;
    } else {
      statusEl.textContent = "It's a draw! 🤝";
      statusEl.className   = "status draw";
      scores.draw++;
    }

    updateScoreboard();

    // Highlight winning cells
    if (winningLine) {
      for (const [r, c] of winningLine) {
        const idx = r * 3 + c;
        cells[idx].classList.add("win-cell");
      }
    }
  }

  // ── Scoreboard ────────────────────────────────────────────────
  function updateScoreboard() {
    scoreHumanEl.textContent = scores.human;
    scoreAIEl.textContent    = scores.ai;
    scoreDrawEl.textContent  = scores.draw;
  }

  // ── Event wiring ──────────────────────────────────────────────
  cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
  btnRestart.addEventListener("click", init);
  btnReset.addEventListener("click", () => {
    scores = { human: 0, ai: 0, draw: 0 };
    updateScoreboard();
    init();
  });
  aiFirstCheck.addEventListener("change", init);

  // ── Start ─────────────────────────────────────────────────────
  init();
})();
