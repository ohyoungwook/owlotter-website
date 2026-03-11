// Minesweeper
(function () {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  let board = [];      // { mine, revealed, flagged, count }
  let gameOver = false;
  let gameWon = false;
  let started = false;
  let timerInterval = null;
  let seconds = 0;
  let flagCount = 0;

  const boardEl = document.getElementById('mine-board');
  const faceEl = document.getElementById('mine-face');
  const mineCountEl = document.getElementById('mine-count');
  const timerEl = document.getElementById('mine-timer');
  const menuGame = document.getElementById('mine-menu-game');

  boardEl.style.gridTemplateColumns = 'repeat(' + COLS + ', auto)';

  function init() {
    board = [];
    gameOver = false;
    gameWon = false;
    started = false;
    flagCount = 0;
    seconds = 0;
    clearInterval(timerInterval);
    timerInterval = null;
    timerEl.textContent = '000';
    mineCountEl.textContent = padNum(MINES);
    faceEl.textContent = '\u{1F642}';
    boardEl.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        board.push({ mine: false, revealed: false, flagged: false, count: 0, r: r, c: c });
      }
    }

    // Render cells
    board.forEach((cell, i) => {
      const el = document.createElement('button');
      el.className = 'mine-cell';
      el.dataset.index = i;
      el.addEventListener('mousedown', onMouseDown);
      el.addEventListener('mouseup', onMouseUp);
      el.addEventListener('contextmenu', (e) => e.preventDefault());
      // Touch support for flagging (long press)
      let longPress = null;
      el.addEventListener('touchstart', (e) => {
        longPress = setTimeout(() => {
          longPress = null;
          toggleFlag(i);
        }, 400);
      });
      el.addEventListener('touchend', (e) => {
        if (longPress) {
          clearTimeout(longPress);
          longPress = null;
          // Treat as click
          handleClick(i);
        }
        e.preventDefault();
      });
      el.addEventListener('touchmove', () => {
        if (longPress) { clearTimeout(longPress); longPress = null; }
      });
      boardEl.appendChild(el);
    });
  }

  function placeMines(excludeIndex) {
    let placed = 0;
    while (placed < MINES) {
      const idx = Math.floor(Math.random() * ROWS * COLS);
      if (idx === excludeIndex || board[idx].mine) continue;
      // Also exclude neighbors of first click for nicer start
      const er = Math.floor(excludeIndex / COLS);
      const ec = excludeIndex % COLS;
      const cr = Math.floor(idx / COLS);
      const cc = idx % COLS;
      if (Math.abs(er - cr) <= 1 && Math.abs(ec - cc) <= 1) continue;
      board[idx].mine = true;
      placed++;
    }

    // Calculate counts
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r * COLS + c].mine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr * COLS + nc].mine) {
              count++;
            }
          }
        }
        board[r * COLS + c].count = count;
      }
    }
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      seconds++;
      if (seconds > 999) seconds = 999;
      timerEl.textContent = padNum(seconds);
    }, 1000);
  }

  function padNum(n) {
    return String(n).padStart(3, '0');
  }

  function onMouseDown(e) {
    if (gameOver || gameWon) return;
    if (e.button === 0) {
      faceEl.textContent = '\u{1F62E}';
    }
  }

  function onMouseUp(e) {
    if (gameOver || gameWon) return;
    const i = parseInt(e.currentTarget.dataset.index);
    if (e.button === 2) {
      // Right click = flag
      toggleFlag(i);
    } else if (e.button === 0) {
      handleClick(i);
    }
    if (!gameOver && !gameWon) {
      faceEl.textContent = '\u{1F642}';
    }
  }

  function toggleFlag(i) {
    if (gameOver || gameWon) return;
    const cell = board[i];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    flagCount += cell.flagged ? 1 : -1;
    mineCountEl.textContent = padNum(MINES - flagCount);
    renderCell(i);
  }

  function handleClick(i) {
    if (gameOver || gameWon) return;
    const cell = board[i];
    if (cell.flagged || cell.revealed) return;

    if (!started) {
      started = true;
      placeMines(i);
      startTimer();
    }

    if (cell.mine) {
      // Game over
      cell.revealed = true;
      gameOver = true;
      clearInterval(timerInterval);
      faceEl.textContent = '\u{1F635}';
      revealAllMines(i);
      return;
    }

    reveal(i);
    checkWin();
  }

  function reveal(i) {
    const cell = board[i];
    if (cell.revealed || cell.flagged || cell.mine) return;
    cell.revealed = true;
    renderCell(i);

    if (cell.count === 0) {
      // Flood fill
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            reveal(nr * COLS + nc);
          }
        }
      }
    }
  }

  function revealAllMines(clickedIndex) {
    board.forEach((cell, i) => {
      if (cell.mine && !cell.flagged) {
        cell.revealed = true;
        const el = boardEl.children[i];
        el.classList.add('revealed');
        if (i === clickedIndex) {
          el.classList.add('mine-bomb');
        } else {
          el.classList.add('mine-revealed-bomb');
        }
        el.textContent = '\u{1F4A3}';
      } else if (!cell.mine && cell.flagged) {
        // Wrong flag
        const el = boardEl.children[i];
        el.classList.add('revealed', 'mine-wrong');
        el.textContent = '\u{1F6A9}';
      }
    });
  }

  function renderCell(i) {
    const cell = board[i];
    const el = boardEl.children[i];

    if (cell.revealed) {
      el.classList.add('revealed', 'mine-' + cell.count);
      el.textContent = cell.count > 0 ? cell.count : '';
    } else if (cell.flagged) {
      el.classList.add('flagged');
      el.textContent = '\u{1F6A9}';
    } else {
      el.classList.remove('flagged');
      el.textContent = '';
    }
  }

  function checkWin() {
    const unrevealed = board.filter(c => !c.revealed && !c.mine).length;
    if (unrevealed === 0) {
      gameWon = true;
      clearInterval(timerInterval);
      faceEl.textContent = '\u{1F60E}';
      // Auto-flag remaining mines
      board.forEach((cell, i) => {
        if (cell.mine && !cell.flagged) {
          cell.flagged = true;
          const el = boardEl.children[i];
          el.classList.add('flagged');
          el.textContent = '\u{1F6A9}';
        }
      });
      mineCountEl.textContent = '000';
    }
  }

  // Face button = new game
  faceEl.addEventListener('click', init);

  // Game menu = new game
  menuGame.addEventListener('click', init);

  // Init on load
  init();
})();
