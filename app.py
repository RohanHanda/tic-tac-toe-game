"""
Tic-Tac-Toe — Flask Backend with Minimax AI
=============================================
Serves the game UI and exposes an API endpoint for the AI to compute
its optimal move using the Minimax algorithm.
"""

import math
import os
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# ── Constants ────────────────────────────────────────────────────────────────
EMPTY = ""
AI = "O"
HUMAN = "X"


# ── Board Helpers ────────────────────────────────────────────────────────────
def get_available_moves(board: list[list[str]]) -> list[tuple[int, int]]:
    """Return all empty cell positions."""
    return [
        (r, c)
        for r in range(3)
        for c in range(3)
        if board[r][c] == EMPTY
    ]


def check_winner(board: list[list[str]]) -> str | None:
    """Return 'X', 'O', or None."""
    lines = []
    for r in range(3):
        lines.append([board[r][0], board[r][1], board[r][2]])
    for c in range(3):
        lines.append([board[0][c], board[1][c], board[2][c]])
    lines.append([board[0][0], board[1][1], board[2][2]])
    lines.append([board[0][2], board[1][1], board[2][0]])

    for line in lines:
        if line[0] == line[1] == line[2] and line[0] != EMPTY:
            return line[0]
    return None


def is_terminal(board: list[list[str]]) -> bool:
    return check_winner(board) is not None or len(get_available_moves(board)) == 0


def evaluate(board: list[list[str]]) -> int:
    winner = check_winner(board)
    if winner == AI:
        return 10
    elif winner == HUMAN:
        return -10
    return 0


# ── Minimax ──────────────────────────────────────────────────────────────────
def minimax(board: list[list[str]], depth: int, is_maximizing: bool) -> int:
    if is_terminal(board):
        score = evaluate(board)
        if score > 0:
            return score - depth
        elif score < 0:
            return score + depth
        return 0

    if is_maximizing:
        best = -math.inf
        for r, c in get_available_moves(board):
            board[r][c] = AI
            best = max(best, minimax(board, depth + 1, False))
            board[r][c] = EMPTY
        return best
    else:
        best = math.inf
        for r, c in get_available_moves(board):
            board[r][c] = HUMAN
            best = min(best, minimax(board, depth + 1, True))
            board[r][c] = EMPTY
        return best


def find_best_move(board: list[list[str]]) -> tuple[int, int]:
    best_score = -math.inf
    best_move = (-1, -1)
    for r, c in get_available_moves(board):
        board[r][c] = AI
        score = minimax(board, 0, False)
        board[r][c] = EMPTY
        if score > best_score:
            best_score = score
            best_move = (r, c)
    return best_move


# ── Winning line detection (for frontend highlight) ──────────────────────────
def get_winning_line(board: list[list[str]]) -> list[list[int]] | None:
    """Return the three [row, col] cells that form the winning line, or None."""
    lines = []
    for r in range(3):
        lines.append([(r, 0), (r, 1), (r, 2)])
    for c in range(3):
        lines.append([(0, c), (1, c), (2, c)])
    lines.append([(0, 0), (1, 1), (2, 2)])
    lines.append([(0, 2), (1, 1), (2, 0)])

    for line in lines:
        vals = [board[r][c] for r, c in line]
        if vals[0] == vals[1] == vals[2] and vals[0] != EMPTY:
            return [[r, c] for r, c in line]
    return None


# ── Routes ───────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/move", methods=["POST"])
def api_move():
    """Receive the current board state, return the AI's best move.

    Request JSON:
        { "board": [["X","",""], ["","O",""], ["","",""]]} 

    Response JSON:
        { "row": 0, "col": 2, "winner": null, "winning_line": null, "draw": false }
    """
    data = request.get_json()
    board = data.get("board")

    if board is None:
        return jsonify({"error": "Missing 'board' in request body"}), 400

    # If game is already over, just report result
    winner = check_winner(board)
    if winner or len(get_available_moves(board)) == 0:
        return jsonify({
            "row": -1,
            "col": -1,
            "winner": winner,
            "winning_line": get_winning_line(board),
            "draw": winner is None and len(get_available_moves(board)) == 0,
        })

    # Compute AI move
    row, col = find_best_move(board)
    board[row][col] = AI

    winner = check_winner(board)
    return jsonify({
        "row": row,
        "col": col,
        "winner": winner,
        "winning_line": get_winning_line(board),
        "draw": winner is None and len(get_available_moves(board)) == 0,
    })


# ── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)