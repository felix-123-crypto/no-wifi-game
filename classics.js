(() => {
  'use strict';

  const requestedGame = new URLSearchParams(window.location.search).get('game');
  const currentGame = ['2048', 'tetris', 'snake'].includes(requestedGame) ? requestedGame : '2048';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const scoreEl = $('#score');
  const bestEl = $('#best');
  const extraLabelEl = $('#extra-label');
  const extraValueEl = $('#extra-value');
  const statusEl = $('#console-status');
  const announceEl = $('#game-announcement');
  const overlay = $('#game-overlay');
  const overlayTitle = $('#overlay-title');
  const overlayCopy = $('#overlay-copy');
  const overlayPrimary = $('#overlay-primary');
  const overlaySecondary = $('#overlay-secondary');
  const pauseButton = $('#pause-button');
  let primaryAction = () => {};
  let secondaryAction = () => {};
  let commonScore = 0;
  let commonBest = readBest(currentGame);

  const gameMeta = {
    '2048': {
      title: '2048', kicker: 'NUMBER PUZZLE',
      subtitle: 'Slide matching tiles together and build the legendary 2048 tile.',
      extra: 'TOP TILE',
      overlay: 'Use arrow keys, WASD, or swipe. Equal numbers merge once per move.',
      helpTitle: 'HOW TO PLAY 2048',
      help: 'Use the arrow keys or WASD. Every move slides all tiles; two equal tiles touching in the direction of travel combine into one.'
    },
    tetris: {
      title: 'Block Drop', kicker: 'FALLING-BLOCK CLASSIC',
      subtitle: 'Rotate all seven pieces, clear lines, and survive as the speed climbs.',
      extra: 'LEVEL',
      overlay: 'Build complete horizontal lines. Use Space for a hard drop and P to pause.',
      helpTitle: 'HOW TO PLAY BLOCK DROP',
      help: 'Move with the arrow keys. Up or X rotates clockwise, Z rotates left, Down soft-drops, and Space instantly hard-drops the piece.'
    },
    snake: {
      title: 'Snake', kicker: 'ARCADE SURVIVAL',
      subtitle: 'Eat, grow, and thread the longest path without hitting the wall or your tail.',
      extra: 'SPEED',
      overlay: 'Turn with arrow keys, WASD, or touch. You cannot reverse into yourself.',
      helpTitle: 'HOW TO PLAY SNAKE',
      help: 'Guide the snake with the arrow keys or WASD. Eat fruit to grow, avoid the walls and your own tail, and press P to pause.'
    }
  };

  function readBest(game) {
    try { return Math.max(0, Number(localStorage.getItem(`recess-classic-${game}`)) || 0); }
    catch (_) { return 0; }
  }

  function writeBest(game, value) {
    try { localStorage.setItem(`recess-classic-${game}`, String(value)); }
    catch (_) { /* Private browsing may disable persistent storage. */ }
  }

  function setScore(value) {
    commonScore = Math.max(0, Math.floor(value));
    scoreEl.textContent = commonScore.toLocaleString();
    if (commonScore > commonBest) {
      commonBest = commonScore;
      bestEl.textContent = commonBest.toLocaleString();
      writeBest(currentGame, commonBest);
    }
  }

  function awardArcadePoints(amount, reason) {
    const points = Math.max(0, Math.floor(Number(amount) || 0));
    if (!points || !window.RecessPoints || typeof window.RecessPoints.award !== 'function') return;
    try { window.RecessPoints.award(points, reason); }
    catch (_) { /* Point tracking must never interrupt the active game. */ }
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function announce(message) {
    announceEl.textContent = '';
    window.setTimeout(() => { announceEl.textContent = message; }, 20);
  }

  function openOverlay(title, copy, primaryLabel, onPrimary, secondaryLabel = '', onSecondary = () => {}) {
    overlayTitle.textContent = title;
    overlayCopy.textContent = copy;
    overlayPrimary.textContent = primaryLabel;
    primaryAction = onPrimary;
    overlaySecondary.hidden = !secondaryLabel;
    overlaySecondary.textContent = secondaryLabel;
    secondaryAction = onSecondary;
    overlay.hidden = false;
    window.setTimeout(() => overlayPrimary.focus(), 0);
  }

  function closeOverlay() {
    overlay.hidden = true;
  }

  overlayPrimary.addEventListener('click', () => primaryAction());
  overlaySecondary.addEventListener('click', () => secondaryAction());

  const meta = gameMeta[currentGame];
  $('#game-title').textContent = meta.title;
  $('#game-kicker').textContent = meta.kicker;
  $('#game-subtitle').textContent = meta.subtitle;
  extraLabelEl.textContent = meta.extra;
  $('#help-title').textContent = meta.helpTitle;
  $('#help-copy').textContent = meta.help;
  bestEl.textContent = commonBest.toLocaleString();
  document.title = `${meta.title} — Recess Arcade`;
  $$('[data-game-tab]').forEach((tab) => {
    if (tab.dataset.gameTab === currentGame) tab.setAttribute('aria-current', 'page');
  });
  ['2048', 'tetris', 'snake'].forEach((name) => {
    $(`#panel-${name}`).hidden = name !== currentGame;
    $(`#touch-${name}`).hidden = name !== currentGame;
  });

  /* ------------------------------ 2048 ------------------------------ */
  const board2048El = $('#board-2048');
  let board2048 = [];
  let active2048 = false;
  let paused2048 = false;
  let won2048 = false;
  let fresh2048 = new Set();
  let merged2048 = new Set();
  const MOVE_2048_LOCK_MS = 200;
  const INPUT_2048_DEBOUNCE_MS = 55;
  let input2048Locked = false;
  let input2048Queue = [];
  let input2048Timer = 0;
  let last2048Intent = null;

  function empty2048Board() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  function reset2048Input() {
    window.clearTimeout(input2048Timer);
    input2048Timer = 0;
    input2048Locked = false;
    input2048Queue = [];
    last2048Intent = null;
  }

  function release2048Input() {
    input2048Timer = 0;
    input2048Locked = false;
    if (!active2048 || paused2048 || !overlay.hidden) {
      input2048Queue = [];
      return;
    }
    const next = input2048Queue.shift();
    if (next) run2048Move(next.direction);
  }

  function run2048Move(direction) {
    const moved = move2048(direction);
    if (!moved) {
      const next = input2048Queue.shift();
      if (next) run2048Move(next.direction);
      return;
    }
    if (!active2048 || paused2048 || !overlay.hidden) {
      reset2048Input();
      return;
    }
    input2048Locked = true;
    input2048Timer = window.setTimeout(release2048Input, MOVE_2048_LOCK_MS);
  }

  function request2048Move(direction, source = 'unknown') {
    if (!['up', 'down', 'left', 'right'].includes(direction)) return;
    if (!active2048 || paused2048 || !overlay.hidden) return;
    const now = performance.now();
    if (last2048Intent && last2048Intent.direction === direction && now - last2048Intent.time < INPUT_2048_DEBOUNCE_MS) return;
    last2048Intent = { direction, source, time: now };
    if (input2048Locked) {
      if (input2048Queue.length < 2) input2048Queue.push({ direction, source });
      return;
    }
    run2048Move(direction);
  }

  function start2048() {
    reset2048Input();
    board2048 = empty2048Board();
    active2048 = true;
    paused2048 = false;
    won2048 = false;
    fresh2048.clear();
    merged2048.clear();
    setScore(0);
    add2048Tile();
    add2048Tile();
    render2048();
    closeOverlay();
    pauseButton.textContent = 'PAUSE';
    setStatus('SLIDE THE TILES');
    board2048El.focus();
  }

  function add2048Tile(board = board2048) {
    const empty = [];
    board.forEach((row, r) => row.forEach((value, c) => { if (!value) empty.push([r, c]); }));
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    fresh2048.add(`${r},${c}`);
  }

  function collapse2048Line(values) {
    const compact = values.filter(Boolean);
    const output = [];
    const mergePositions = [];
    let scoreGain = 0;
    for (let i = 0; i < compact.length; i += 1) {
      if (compact[i] === compact[i + 1]) {
        const merged = compact[i] * 2;
        output.push(merged);
        mergePositions.push(output.length - 1);
        scoreGain += merged;
        i += 1;
      } else {
        output.push(compact[i]);
      }
    }
    while (output.length < 4) output.push(0);
    return { values: output, mergePositions, scoreGain };
  }

  function get2048Line(board, index, direction) {
    if (direction === 'left') return board[index].slice();
    if (direction === 'right') return board[index].slice().reverse();
    if (direction === 'up') return board.map((row) => row[index]);
    return board.map((row) => row[index]).reverse();
  }

  function set2048Line(board, index, direction, values, mergePositions) {
    values.forEach((value, p) => {
      let r;
      let c;
      if (direction === 'left') { r = index; c = p; }
      else if (direction === 'right') { r = index; c = 3 - p; }
      else if (direction === 'up') { r = p; c = index; }
      else { r = 3 - p; c = index; }
      board[r][c] = value;
      if (mergePositions.includes(p)) merged2048.add(`${r},${c}`);
    });
  }

  function boardsEqual2048(first, second) {
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (first[r][c] !== second[r][c]) return false;
      }
    }
    return true;
  }

  function move2048(direction) {
    if (!active2048 || paused2048 || !overlay.hidden) return false;
    const before = board2048.map((row) => row.slice());
    const nextBoard = before.map((row) => row.slice());
    let scoreGain = 0;
    fresh2048.clear();
    merged2048.clear();
    for (let line = 0; line < 4; line += 1) {
      const result = collapse2048Line(get2048Line(before, line, direction));
      set2048Line(nextBoard, line, direction, result.values, result.mergePositions);
      scoreGain += result.scoreGain;
    }
    if (boardsEqual2048(before, nextBoard)) {
      setStatus('NO MOVE — TRY ANOTHER WAY');
      return false;
    }
    board2048 = nextBoard;
    if (scoreGain) {
      setScore(commonScore + scoreGain);
      awardArcadePoints(Math.max(1, Math.floor(scoreGain / 4)), `Scored ${scoreGain} points in 2048`);
    }
    add2048Tile();
    render2048();
    setStatus(`${direction.toUpperCase()} MOVE`);
    const topTile = Math.max(...board2048.flat());
    if (topTile >= 2048 && !won2048) {
      won2048 = true;
      paused2048 = true;
      announce('You made the 2048 tile!');
      openOverlay('2048!', 'You reached the legendary tile. Keep building, or start a fresh board.', 'KEEP PLAYING', () => {
        paused2048 = false; closeOverlay(); setStatus('ENDLESS MODE'); board2048El.focus();
      }, 'NEW GAME', start2048);
    } else if (!canMove2048()) {
      active2048 = false;
      input2048Queue = [];
      setStatus('NO MOVES LEFT');
      announce(`Game over. Your score is ${commonScore}.`);
      openOverlay('NO MORE MOVES', `Final score: ${commonScore.toLocaleString()}. Build from the corners and try again.`, 'PLAY AGAIN', start2048);
    }
    return true;
  }

  function canMove2048(board = board2048) {
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (!board[r][c]) return true;
        if (c < 3 && board[r][c] === board[r][c + 1]) return true;
        if (r < 3 && board[r][c] === board[r + 1][c]) return true;
      }
    }
    return false;
  }

  function render2048() {
    const fragment = document.createDocumentFragment();
    let topTile = 0;
    board2048.forEach((row, r) => row.forEach((value, c) => {
      const tile = document.createElement('div');
      tile.className = 'tile-2048';
      tile.dataset.value = value <= 2048 ? String(value) : '4096';
      if (value > 2048) tile.dataset.large = 'true';
      if (fresh2048.has(`${r},${c}`)) tile.classList.add('spawn');
      if (merged2048.has(`${r},${c}`)) tile.classList.add('merged');
      if (tile.classList.contains('spawn') || tile.classList.contains('merged')) {
        tile.addEventListener('animationend', () => tile.classList.remove('spawn', 'merged'), { once: true });
      }
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-label', value ? String(value) : 'empty');
      tile.textContent = value || '';
      fragment.append(tile);
      topTile = Math.max(topTile, value);
    }));
    board2048El.replaceChildren(fragment);
    extraValueEl.textContent = String(topTile || 2);
    board2048El.setAttribute('aria-label', `2048 board. Highest tile ${topTile || 2}. Score ${commonScore}.`);
  }

  function pause2048() {
    if (!active2048) return;
    reset2048Input();
    paused2048 = true;
    pauseButton.textContent = 'RESUME';
    setStatus('PAUSED');
    openOverlay('PAUSED', 'Your board is waiting exactly where you left it.', 'RESUME', () => {
      paused2048 = false; pauseButton.textContent = 'PAUSE'; closeOverlay(); setStatus('SLIDE THE TILES'); board2048El.focus();
    }, 'NEW GAME', start2048);
  }

  /* --------------------------- Block Drop --------------------------- */
  const tetrisCanvas = $('#tetris-canvas');
  const tCtx = tetrisCanvas.getContext('2d');
  const nextCanvas = $('#next-canvas');
  const nextCtx = nextCanvas.getContext('2d');
  const T_COLS = 10;
  const T_ROWS = 20;
  const T_CELL = 30;
  const TETROMINOES = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
  };
  const T_COLORS = { I: '#3dd5f3', J: '#5687ff', L: '#ff9e3d', O: '#ffd83d', S: '#55d979', T: '#b76df1', Z: '#ff5d67' };
  let tBoard = [];
  let tPiece = null;
  let tNext = null;
  let tBag = [];
  let tLines = 0;
  let tLevel = 1;
  let tActive = false;
  let tPaused = false;
  let tLastTime = 0;
  let tDropAccumulator = 0;
  let tAnimation = 0;

  function shuffledBag() {
    const pieces = Object.keys(TETROMINOES);
    for (let i = pieces.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    return pieces;
  }

  function takeTetromino() {
    if (!tBag.length) tBag = shuffledBag();
    return tBag.pop();
  }

  function makePiece(type) {
    const matrix = TETROMINOES[type].map((row) => row.slice());
    return { type, matrix, x: Math.floor((T_COLS - matrix.length) / 2), y: 0 };
  }

  function startTetris() {
    cancelAnimationFrame(tAnimation);
    tBoard = Array.from({ length: T_ROWS }, () => Array(T_COLS).fill(''));
    tBag = [];
    tLines = 0;
    tLevel = 1;
    tNext = takeTetromino();
    tActive = true;
    tPaused = false;
    tDropAccumulator = 0;
    tLastTime = performance.now();
    setScore(0);
    spawnTetrisPiece();
    updateTetrisStats();
    closeOverlay();
    pauseButton.textContent = 'PAUSE';
    setStatus('LEVEL 1 — START');
    tetrisCanvas.focus?.();
    tAnimation = requestAnimationFrame(tetrisLoop);
  }

  function spawnTetrisPiece() {
    tPiece = makePiece(tNext || takeTetromino());
    tNext = takeTetromino();
    drawNextPiece();
    if (tetrisCollision(tPiece, 0, 0, tPiece.matrix)) finishTetris();
  }

  function tetrisCollision(piece, offsetX, offsetY, matrix) {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (!matrix[y][x]) continue;
        const boardX = piece.x + x + offsetX;
        const boardY = piece.y + y + offsetY;
        if (boardX < 0 || boardX >= T_COLS || boardY >= T_ROWS) return true;
        if (boardY >= 0 && tBoard[boardY][boardX]) return true;
      }
    }
    return false;
  }

  function rotateMatrix(matrix, clockwise = true) {
    const size = matrix.length;
    return Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => (
      clockwise ? matrix[size - 1 - x][y] : matrix[x][size - 1 - y]
    )));
  }

  function rotateTetris(clockwise = true) {
    if (!tActive || tPaused || !overlay.hidden) return;
    const rotated = rotateMatrix(tPiece.matrix, clockwise);
    for (const kick of [0, -1, 1, -2, 2]) {
      if (!tetrisCollision(tPiece, kick, 0, rotated)) {
        tPiece.x += kick;
        tPiece.matrix = rotated;
        setStatus(clockwise ? 'ROTATE RIGHT' : 'ROTATE LEFT');
        return;
      }
    }
  }

  function moveTetris(dx) {
    if (!tActive || tPaused || !overlay.hidden) return;
    if (!tetrisCollision(tPiece, dx, 0, tPiece.matrix)) tPiece.x += dx;
  }

  function dropTetris(manual = false) {
    if (!tActive || tPaused) return false;
    if (!tetrisCollision(tPiece, 0, 1, tPiece.matrix)) {
      tPiece.y += 1;
      if (manual) setScore(commonScore + 1);
      return true;
    }
    lockTetrisPiece();
    return false;
  }

  function hardDropTetris() {
    if (!tActive || tPaused || !overlay.hidden) return;
    let distance = 0;
    while (!tetrisCollision(tPiece, 0, 1, tPiece.matrix)) {
      tPiece.y += 1;
      distance += 1;
    }
    setScore(commonScore + distance * 2);
    lockTetrisPiece();
    setStatus(`HARD DROP +${distance * 2}`);
  }

  function lockTetrisPiece() {
    for (let y = 0; y < tPiece.matrix.length; y += 1) {
      for (let x = 0; x < tPiece.matrix[y].length; x += 1) {
        if (!tPiece.matrix[y][x]) continue;
        const boardY = tPiece.y + y;
        if (boardY < 0) { finishTetris(); return; }
        tBoard[boardY][tPiece.x + x] = tPiece.type;
      }
    }
    clearTetrisLines();
    spawnTetrisPiece();
  }

  function clearTetrisLines() {
    let cleared = 0;
    for (let y = T_ROWS - 1; y >= 0; y -= 1) {
      if (tBoard[y].every(Boolean)) {
        tBoard.splice(y, 1);
        tBoard.unshift(Array(T_COLS).fill(''));
        cleared += 1;
        y += 1;
      }
    }
    if (!cleared) return;
    tLines += cleared;
    tLevel = Math.floor(tLines / 10) + 1;
    const points = [0, 100, 300, 500, 800][cleared] * tLevel;
    setScore(commonScore + points);
    const arcadePoints = cleared * 15 + [0, 0, 10, 25, 60][cleared];
    awardArcadePoints(arcadePoints, `Cleared ${cleared} ${cleared === 1 ? 'row' : 'rows'} in Block Drop`);
    updateTetrisStats();
    setStatus(cleared === 4 ? `TETRIS! +${points}` : `${cleared} LINE${cleared > 1 ? 'S' : ''} +${points}`);
    announce(cleared === 4 ? 'Tetris! Four lines cleared.' : `${cleared} lines cleared.`);
  }

  function updateTetrisStats() {
    $('#tetris-level').textContent = String(tLevel);
    $('#tetris-lines').textContent = String(tLines);
    extraValueEl.textContent = String(tLevel);
  }

  function tetrisSpeed() {
    return Math.max(85, 850 - (tLevel - 1) * 68);
  }

  function tetrisLoop(now) {
    if (!tActive) return;
    const delta = Math.min(80, now - tLastTime);
    tLastTime = now;
    if (!tPaused) {
      tDropAccumulator += delta;
      if (tDropAccumulator >= tetrisSpeed()) {
        tDropAccumulator %= tetrisSpeed();
        dropTetris(false);
      }
    }
    drawTetris();
    tAnimation = requestAnimationFrame(tetrisLoop);
  }

  function drawBlock(ctx, x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    ctx.fillRect(x + 3, y + 3, size - 6, 4);
    ctx.fillRect(x + 3, y + 3, 4, size - 6);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(x + 4, y + size - 7, size - 8, 4);
    ctx.fillRect(x + size - 7, y + 4, 4, size - 8);
    ctx.strokeStyle = 'rgba(255,255,255,.4)';
    ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);
    ctx.restore();
  }

  function drawTetris() {
    tCtx.fillStyle = '#081125';
    tCtx.fillRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
    tCtx.strokeStyle = 'rgba(91,125,205,.13)';
    tCtx.lineWidth = 1;
    for (let x = 0; x <= T_COLS; x += 1) {
      tCtx.beginPath(); tCtx.moveTo(x * T_CELL + .5, 0); tCtx.lineTo(x * T_CELL + .5, 600); tCtx.stroke();
    }
    for (let y = 0; y <= T_ROWS; y += 1) {
      tCtx.beginPath(); tCtx.moveTo(0, y * T_CELL + .5); tCtx.lineTo(300, y * T_CELL + .5); tCtx.stroke();
    }
    tBoard.forEach((row, y) => row.forEach((type, x) => {
      if (type) drawBlock(tCtx, x * T_CELL, y * T_CELL, T_CELL, T_COLORS[type]);
    }));
    if (!tPiece) return;
    let ghostY = tPiece.y;
    while (!tetrisCollision({ ...tPiece, y: ghostY }, 0, 1, tPiece.matrix)) ghostY += 1;
    tPiece.matrix.forEach((row, y) => row.forEach((cell, x) => {
      if (!cell) return;
      if (ghostY + y >= 0) drawBlock(tCtx, (tPiece.x + x) * T_CELL, (ghostY + y) * T_CELL, T_CELL, T_COLORS[tPiece.type], .2);
      if (tPiece.y + y >= 0) drawBlock(tCtx, (tPiece.x + x) * T_CELL, (tPiece.y + y) * T_CELL, T_CELL, T_COLORS[tPiece.type]);
    }));
  }

  function drawNextPiece() {
    nextCtx.fillStyle = '#09132b';
    nextCtx.fillRect(0, 0, 128, 128);
    if (!tNext) return;
    const matrix = TETROMINOES[tNext];
    const blockSize = 23;
    const offsetX = (128 - matrix.length * blockSize) / 2;
    const offsetY = (128 - matrix.length * blockSize) / 2;
    matrix.forEach((row, y) => row.forEach((cell, x) => {
      if (cell) drawBlock(nextCtx, offsetX + x * blockSize, offsetY + y * blockSize, blockSize, T_COLORS[tNext]);
    }));
  }

  function pauseTetris() {
    if (!tActive) return;
    tPaused = true;
    pauseButton.textContent = 'RESUME';
    setStatus('PAUSED');
    openOverlay('PAUSED', 'The falling piece is frozen. Jump back in whenever you are ready.', 'RESUME', () => {
      tPaused = false; tLastTime = performance.now(); pauseButton.textContent = 'PAUSE'; closeOverlay(); setStatus(`LEVEL ${tLevel} — ${tLines} LINES`);
    }, 'NEW GAME', startTetris);
  }

  function finishTetris() {
    tActive = false;
    cancelAnimationFrame(tAnimation);
    drawTetris();
    setStatus('STACK REACHED THE TOP');
    announce(`Game over. Your score is ${commonScore}.`);
    openOverlay('GAME OVER', `You cleared ${tLines} line${tLines === 1 ? '' : 's'} and scored ${commonScore.toLocaleString()} points.`, 'PLAY AGAIN', startTetris);
  }

  /* ------------------------------ Snake ----------------------------- */
  const snakeCanvas = $('#snake-canvas');
  const sCtx = snakeCanvas.getContext('2d');
  const S_CELL = 24;
  const S_COLS = 30;
  const S_ROWS = 20;
  const DIRECTIONS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  let snake = [];
  let previousSnake = [];
  let snakeDirection = DIRECTIONS.right;
  let snakeQueue = [];
  let snakeFood = null;
  let snakeEaten = 0;
  let snakeLevel = 1;
  let snakeActive = false;
  let snakePaused = false;
  let snakeLastStep = 0;
  let snakeLastFrame = 0;
  let snakeAnimation = 0;
  let snakeParticles = [];

  function startSnake() {
    cancelAnimationFrame(snakeAnimation);
    snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }, { x: 5, y: 10 }];
    previousSnake = snake.map((segment) => ({ ...segment }));
    snakeDirection = DIRECTIONS.right;
    snakeQueue = [];
    snakeEaten = 0;
    snakeLevel = 1;
    snakeParticles = [];
    snakeActive = true;
    snakePaused = false;
    setScore(0);
    spawnSnakeFood();
    updateSnakeStats();
    closeOverlay();
    pauseButton.textContent = 'PAUSE';
    setStatus('HUNT THE FRUIT');
    snakeLastStep = performance.now();
    snakeLastFrame = snakeLastStep;
    snakeAnimation = requestAnimationFrame(snakeLoop);
  }

  function snakeInterval() {
    return Math.max(62, 128 - (snakeLevel - 1) * 9);
  }

  function spawnSnakeFood() {
    const available = [];
    for (let y = 0; y < S_ROWS; y += 1) {
      for (let x = 0; x < S_COLS; x += 1) {
        if (!snake.some((segment) => segment.x === x && segment.y === y)) available.push({ x, y });
      }
    }
    if (!available.length) { finishSnake(true); return; }
    const spot = available[Math.floor(Math.random() * available.length)];
    snakeFood = { ...spot, golden: (snakeEaten + 1) % 5 === 0 };
  }

  function queueSnakeDirection(name) {
    if (!snakeActive || snakePaused || !overlay.hidden) return;
    const next = DIRECTIONS[name];
    if (!next) return;
    const last = snakeQueue.length ? snakeQueue[snakeQueue.length - 1] : snakeDirection;
    if (next.x === -last.x && next.y === -last.y) return;
    if (next.x === last.x && next.y === last.y) return;
    if (snakeQueue.length < 2) snakeQueue.push(next);
  }

  function snakeStep(now) {
    if (snakeQueue.length) snakeDirection = snakeQueue.shift();
    previousSnake = snake.map((segment) => ({ ...segment }));
    const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };
    const eating = head.x === snakeFood.x && head.y === snakeFood.y;
    const bodyToCheck = eating ? snake : snake.slice(0, -1);
    const hitWall = head.x < 0 || head.x >= S_COLS || head.y < 0 || head.y >= S_ROWS;
    const hitSelf = bodyToCheck.some((segment) => segment.x === head.x && segment.y === head.y);
    if (hitWall || hitSelf) { finishSnake(false); return; }
    snake.unshift(head);
    if (eating) {
      const ateGolden = snakeFood.golden;
      snakeEaten += 1;
      const points = ateGolden ? 25 * snakeLevel : 10 * snakeLevel;
      setScore(commonScore + points);
      awardArcadePoints(ateGolden ? 10 : 3, ateGolden ? 'Ate golden food in Snake' : 'Ate food in Snake');
      createSnakeParticles(snakeFood.x * S_CELL + 12, snakeFood.y * S_CELL + 12, ateGolden ? '#ffd23f' : '#ff5a4e');
      snakeLevel = Math.floor(snakeEaten / 5) + 1;
      spawnSnakeFood();
      updateSnakeStats();
      setStatus(ateGolden ? `GOLDEN FRUIT +${points}` : `FRUIT +${points}`);
      announce(`Fruit collected. Score ${commonScore}.`);
    } else {
      snake.pop();
    }
    snakeLastStep = now;
  }

  function updateSnakeStats() {
    $('#snake-speed').textContent = String(snakeLevel);
    $('#snake-length').textContent = String(snake.length);
    $('#snake-next').textContent = String(5 - (snakeEaten % 5));
    extraValueEl.textContent = String(snakeLevel);
  }

  function createSnakeParticles(x, y, color) {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      snakeParticles.push({ x, y, vx: Math.cos(angle) * (25 + Math.random() * 35), vy: Math.sin(angle) * (25 + Math.random() * 35), life: 1, color });
    }
  }

  function snakeLoop(now) {
    if (!snakeActive) return;
    const frameDelta = Math.min(.05, (now - snakeLastFrame) / 1000);
    snakeLastFrame = now;
    if (!snakePaused && now - snakeLastStep >= snakeInterval()) snakeStep(now);
    updateSnakeParticles(frameDelta);
    drawSnake(now);
    snakeAnimation = requestAnimationFrame(snakeLoop);
  }

  function updateSnakeParticles(delta) {
    snakeParticles.forEach((particle) => {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.life -= delta * 2.4;
    });
    snakeParticles = snakeParticles.filter((particle) => particle.life > 0);
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawSnake(now) {
    sCtx.fillStyle = '#b6d983';
    sCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    for (let y = 0; y < S_ROWS; y += 1) {
      for (let x = 0; x < S_COLS; x += 1) {
        if ((x + y) % 2 === 0) {
          sCtx.fillStyle = 'rgba(44,89,47,.055)';
          sCtx.fillRect(x * S_CELL, y * S_CELL, S_CELL, S_CELL);
        }
      }
    }
    if (snakeFood) drawSnakeFood(now);
    const alpha = Math.min(1, Math.max(0, (now - snakeLastStep) / snakeInterval()));
    snake.forEach((segment, index) => {
      const previous = previousSnake[Math.min(index, previousSnake.length - 1)] || segment;
      const x = (previous.x + (segment.x - previous.x) * alpha) * S_CELL;
      const y = (previous.y + (segment.y - previous.y) * alpha) * S_CELL;
      const inset = index === 0 ? 1 : 2;
      roundedRect(sCtx, x + inset, y + inset, S_CELL - inset * 2, S_CELL - inset * 2, index === 0 ? 8 : 6);
      sCtx.fillStyle = index === 0 ? '#173d25' : index % 2 ? '#2d6b38' : '#347b40';
      sCtx.fill();
      if (index === 0) drawSnakeEyes(x, y);
    });
    snakeParticles.forEach((particle) => {
      sCtx.globalAlpha = particle.life;
      sCtx.fillStyle = particle.color;
      sCtx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });
    sCtx.globalAlpha = 1;
  }

  function drawSnakeEyes(x, y) {
    const horizontal = snakeDirection.x !== 0;
    const eyePositions = horizontal ? [[12, 6], [12, 16]] : [[6, 12], [16, 12]];
    sCtx.fillStyle = '#fff';
    eyePositions.forEach(([ex, ey]) => { sCtx.beginPath(); sCtx.arc(x + ex, y + ey, 2.5, 0, Math.PI * 2); sCtx.fill(); });
    sCtx.fillStyle = '#111';
    eyePositions.forEach(([ex, ey]) => {
      sCtx.beginPath(); sCtx.arc(x + ex + snakeDirection.x, y + ey + snakeDirection.y, 1.2, 0, Math.PI * 2); sCtx.fill();
    });
  }

  function drawSnakeFood(now) {
    const cx = snakeFood.x * S_CELL + 12;
    const cy = snakeFood.y * S_CELL + 12;
    const pulse = 1 + Math.sin(now / 160) * .08;
    sCtx.save();
    sCtx.translate(cx, cy);
    sCtx.scale(pulse, pulse);
    if (snakeFood.golden) {
      sCtx.fillStyle = '#ffd23f';
      sCtx.strokeStyle = '#715c0b';
      sCtx.lineWidth = 2;
      sCtx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const radius = i % 2 === 0 ? 10 : 4.5;
        const angle = -Math.PI / 2 + i * Math.PI / 5;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) sCtx.moveTo(px, py); else sCtx.lineTo(px, py);
      }
      sCtx.closePath(); sCtx.fill(); sCtx.stroke();
    } else {
      sCtx.fillStyle = '#ef4d44';
      sCtx.strokeStyle = '#71302b';
      sCtx.lineWidth = 2;
      sCtx.beginPath(); sCtx.arc(-4, 1, 7.5, 0, Math.PI * 2); sCtx.arc(4, 1, 7.5, 0, Math.PI * 2); sCtx.fill(); sCtx.stroke();
      sCtx.strokeStyle = '#295e32'; sCtx.beginPath(); sCtx.moveTo(0, -5); sCtx.quadraticCurveTo(2, -12, 8, -10); sCtx.stroke();
    }
    sCtx.restore();
  }

  function pauseSnake() {
    if (!snakeActive) return;
    snakePaused = true;
    pauseButton.textContent = 'RESUME';
    setStatus('PAUSED');
    openOverlay('PAUSED', 'The snake is resting. Your route and score are safe.', 'RESUME', () => {
      snakePaused = false; snakeLastStep = performance.now(); snakeLastFrame = snakeLastStep; pauseButton.textContent = 'PAUSE'; closeOverlay(); setStatus(`SPEED ${snakeLevel} — KEEP MOVING`);
    }, 'NEW GAME', startSnake);
  }

  function finishSnake(won) {
    snakeActive = false;
    cancelAnimationFrame(snakeAnimation);
    setStatus(won ? 'BOARD CLEARED' : 'CRASHED');
    announce(won ? 'You filled the board!' : `Game over. Your score is ${commonScore}.`);
    openOverlay(won ? 'PERFECT SNAKE!' : 'GAME OVER', won ? 'You filled every square — an unbeatable run.' : `Length ${snake.length}. Score ${commonScore.toLocaleString()}. Watch the head, then plan the tail.`, 'PLAY AGAIN', startSnake);
  }

  /* -------------------------- Common input -------------------------- */
  function restartCurrent() {
    if (currentGame === '2048') start2048();
    else if (currentGame === 'tetris') startTetris();
    else startSnake();
  }

  function pauseCurrent() {
    if (currentGame === '2048') pause2048();
    else if (currentGame === 'tetris') pauseTetris();
    else pauseSnake();
  }

  $('#restart-button').addEventListener('click', restartCurrent);
  pauseButton.addEventListener('click', () => {
    if (!overlay.hidden && pauseButton.textContent === 'RESUME') primaryAction();
    else if (overlay.hidden) pauseCurrent();
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (!overlay.hidden) {
      if ((key === 'enter' || key === ' ') && !event.repeat) {
        event.preventDefault();
        if (document.activeElement === overlaySecondary && !overlaySecondary.hidden) secondaryAction();
        else primaryAction();
      }
      return;
    }
    const movementKey = ['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'w', 'a', 's', 'd', ' ', 'x', 'z'].includes(key);
    if (movementKey) event.preventDefault();
    if (key === 'p' || key === 'escape') {
      if (overlay.hidden) pauseCurrent();
      else if (pauseButton.textContent === 'RESUME') primaryAction();
      return;
    }
    const directionFromKey = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' }[key];
    if (currentGame === '2048' && directionFromKey && !event.repeat) request2048Move(directionFromKey, 'keyboard');
    if (currentGame === 'snake' && directionFromKey) queueSnakeDirection(directionFromKey);
    if (currentGame === 'tetris') {
      if (directionFromKey === 'left') moveTetris(-1);
      else if (directionFromKey === 'right') moveTetris(1);
      else if (directionFromKey === 'down') dropTetris(true);
      else if ((directionFromKey === 'up' || key === 'x') && !event.repeat) rotateTetris(true);
      else if (key === 'z' && !event.repeat) rotateTetris(false);
      else if (key === ' ' && !event.repeat) hardDropTetris();
    }
  }, { passive: false });

  $$('[id^="touch-"] button').forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      if (event.isPrimary === false) return;
      event.preventDefault();
      const action = button.dataset.action;
      if (currentGame === '2048') request2048Move(action, 'touch-button');
      else if (currentGame === 'snake') queueSnakeDirection(action);
      else if (action === 'left') moveTetris(-1);
      else if (action === 'right') moveTetris(1);
      else if (action === 'down') dropTetris(true);
      else if (action === 'rotate') rotateTetris(true);
      else if (action === 'drop') hardDropTetris();
    });
  });

  function addSwipeControls(element, callback) {
    let start = null;
    element.addEventListener('pointerdown', (event) => {
      if (event.isPrimary === false) return;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
      try { element.setPointerCapture(event.pointerId); } catch (_) { /* Pointer capture is optional. */ }
    });
    element.addEventListener('pointerup', (event) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      callback(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    });
    element.addEventListener('pointercancel', () => { start = null; });
  }

  addSwipeControls(board2048El, (direction) => request2048Move(direction, 'swipe'));
  addSwipeControls(snakeCanvas, queueSnakeDirection);
  addSwipeControls(tetrisCanvas, (direction) => {
    if (direction === 'left') moveTetris(-1);
    else if (direction === 'right') moveTetris(1);
    else if (direction === 'up') rotateTetris(true);
    else hardDropTetris();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && overlay.hidden) pauseCurrent();
  });

  board2048 = empty2048Board();
  render2048();
  drawTetris();
  drawNextPiece();
  drawSnake(performance.now());
  setScore(0);
  extraValueEl.textContent = currentGame === 'tetris' || currentGame === 'snake' ? '1' : '2';
  openOverlay('READY?', meta.overlay, 'START GAME', restartCurrent);
})();
