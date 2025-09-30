let board = Array(9).fill(null);
let currentPlayer = "X";
let gameMode = null; // "pvp" o "pvc"
let gameOver = false;

// Crear tablero dinámicamente
const boardContainer = document.getElementById("board");
const statusText = document.getElementById("status");

function createBoard() {
  boardContainer.innerHTML = "";
  board.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.dataset.index = index;
    cellDiv.addEventListener("click", handleMove);
    cellDiv.textContent = cell;
    boardContainer.appendChild(cellDiv);
  });
}

// Selección de modo
function setMode(mode) {
  gameMode = mode;
  resetGame();
  statusText.textContent = 
    mode === "pvp" ? "Modo Jugador vs Jugador" : "Modo Jugador vs Computadora";
}

// Manejo de jugadas
function handleMove(e) {
  const index = e.target.dataset.index;

  if (board[index] || gameOver) return; // Celda ocupada o juego terminado

  board[index] = currentPlayer;
  createBoard();

  if (checkWinner()) {
    statusText.textContent = `¡Ganó ${currentPlayer}! 🎉`;
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    statusText.textContent = "Empate 🤝";
    gameOver = true;
    return;
  }

  // Cambiar turno
  if (gameMode === "pvp") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  } else if (gameMode === "pvc") {
    currentPlayer = "O"; // Computadora siempre "O"
    computerMove();
  }
}

// Movimiento de la computadora (aleatorio)
function computerMove() {
  if (gameOver) return;

  let emptyCells = board
    .map((cell, i) => (cell === null ? i : null))
    .filter(i => i !== null);

  if (emptyCells.length === 0) return;

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  createBoard();

  if (checkWinner()) {
    statusText.textContent = "¡La computadora ganó! 🤖";
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    statusText.textContent = "Empate 🤝";
    gameOver = true;
    return;
  }

  currentPlayer = "X"; // Vuelve el turno del jugador
}

// Verificar ganador
function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // filas
    [0,3,6],[1,4,7],[2,5,8], // columnas
    [0,4,8],[2,4,6]          // diagonales
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

// Reiniciar juego
function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  createBoard();
  statusText.textContent = "Selecciona un modo de juego 👆";
}

// Inicializar
createBoard();
