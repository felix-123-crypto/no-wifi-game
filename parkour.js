const canvas = document.querySelector('#parkour-game');
const ctx = canvas.getContext('2d');
const overlay = document.querySelector('#parkour-overlay');
const startButton = document.querySelector('#parkour-start');
const overlayKicker = document.querySelector('#overlay-kicker');
const overlayTitle = document.querySelector('#overlay-title');
const overlayCopy = document.querySelector('#overlay-copy');
const meterFill = document.querySelector('#meter-fill');
const meterLevel = document.querySelector('#meter-level');
const skipButton = document.querySelector('#parkour-skip');
const jumpLevelInput = document.querySelector('#parkour-jump-level');
const goLevelButton = document.querySelector('#parkour-go-level');
const stageLabel = document.querySelector('#stage-label');
const levelLabel = document.querySelector('#level-label');
const levelStat = document.querySelector('#level-stat');
const bestStat = document.querySelector('#best-stat');
const deathStat = document.querySelector('#death-stat');
const timeStat = document.querySelector('#time-stat');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const MAX_LEVEL = 1000;
const SAVE_KEY = 'recess-parkour-progress-v1';
const keys = new Set();
let currentLevel = 1;
let bestLevel = 1;
let deaths = 0;
let level = null;
let player = null;
let running = false;
let lastFrame = 0;
let levelStartedAt = 0;
let elapsed = 0;
let animationFrame = 0;
let noticeTimer = 0;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const stageFor = value => value < 25 ? 'WARM UP' : value < 100 ? 'MOMENTUM' : value < 250 ? 'PRECISION' : value < 500 ? 'FLOW STATE' : value < 800 ? 'GAUNTLET' : 'FINAL FORM';

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    currentLevel = clamp(Number(saved.currentLevel) || 1, 1, MAX_LEVEL);
    bestLevel = clamp(Number(saved.bestLevel) || currentLevel, 1, MAX_LEVEL);
    deaths = Math.max(0, Number(saved.deaths) || 0);
  } catch (_) {
    currentLevel = 1;
    bestLevel = 1;
    deaths = 0;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ currentLevel, bestLevel, deaths }));
  } catch (_) {
    // Progress is a bonus; gameplay still works if storage is unavailable.
  }
}

function updateStats() {
  levelStat.textContent = String(currentLevel).padStart(3, '0');
  bestStat.textContent = String(bestLevel).padStart(3, '0');
  deathStat.textContent = deaths;
  timeStat.textContent = formatTime(elapsed);
  stageLabel.textContent = stageFor(currentLevel);
  levelLabel.textContent = `LEVEL ${String(currentLevel).padStart(3, '0')} / ${MAX_LEVEL}`;
  meterLevel.textContent = bestLevel;
  meterFill.style.width = `${((bestLevel - 1) / (MAX_LEVEL - 1)) * 100}%`;
  jumpLevelInput.value = currentLevel;
  skipButton.disabled = currentLevel >= MAX_LEVEL;
  skipButton.textContent = currentLevel >= MAX_LEVEL ? 'ALL LEVELS CLEARED' : 'SKIP LEVEL →';
}

function showOverlay(title, copy, buttonText, kicker = `LEVEL ${String(currentLevel).padStart(3, '0')}`) {
  overlayTitle.textContent = title;
  overlayCopy.textContent = copy;
  overlayKicker.textContent = kicker;
  startButton.textContent = buttonText;
  overlay.hidden = false;
}

function hideOverlay() {
  overlay.hidden = true;
}

function rng(seed) {
  let value = (seed >>> 0) || 1;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function generateLevel(number) {
  const random = rng(0x9e3779b9 ^ Math.imul(number, 2654435761));
  const difficulty = (number - 1) / (MAX_LEVEL - 1);
  const platformCount = 12 + Math.floor(difficulty * 14);
  const baseGap = 70 + difficulty * 26;
  const minWidth = 122 - difficulty * 38;
  const platforms = [{ x: -120, y: 470, w: 330, h: 30, kind: 'start' }];
  const hazards = [];
  let x = 210;
  let y = 470;

  for (let index = 1; index <= platformCount; index += 1) {
    const gap = baseGap + random() * (44 + difficulty * 34);
    const width = Math.max(minWidth, 174 - difficulty * 62 + random() * 42);
    const maxRise = 42 + difficulty * 20;
    const maxDrop = 28 + difficulty * 18;
    y = clamp(y + (random() - 0.48) * (maxRise + maxDrop), 292, 470);
    const kind = number > 18 && random() < (0.08 + difficulty * 0.22) ? 'moving' : 'static';
    const platform = {
      x: x + gap,
      y,
      w: width,
      h: 18,
      kind,
      homeX: x + gap,
      range: 20 + random() * (18 + difficulty * 38),
      phase: random() * Math.PI * 2,
      speed: 0.8 + random() * (0.5 + difficulty * 0.7)
    };
    platforms.push(platform);

    const hazardChance = number < 4 ? 0 : 0.1 + difficulty * 0.43;
    if (random() < hazardChance && width > 100) {
      const hazardWidth = Math.min(30 + difficulty * 10, width * 0.28);
      hazards.push({
        x: platform.x + 24 + random() * Math.max(10, platform.w - hazardWidth - 48),
        y: platform.y - 17,
        w: hazardWidth,
        h: 17,
        kind: random() < 0.25 + difficulty * 0.3 ? 'saw' : 'spike',
        phase: random() * Math.PI * 2
      });
    }

    x = platform.x + width;
  }

  const finalPlatform = platforms[platforms.length - 1];
  const goal = { x: finalPlatform.x + finalPlatform.w - 24, y: finalPlatform.y - 92 };
  return {
    number,
    difficulty,
    width: finalPlatform.x + finalPlatform.w + 180,
    platforms,
    hazards,
    goal,
    timeLimit: 42 - difficulty * 16,
    speedLimit: 300 + difficulty * 58
  };
}

function resetPlayer() {
  const start = level.platforms[0];
  player = {
    x: 62,
    y: start.y - 42,
    w: 28,
    h: 42,
    vx: 0,
    vy: 0,
    grounded: true,
    coyote: 0,
    jumpBuffer: 0,
    facing: 1,
    squash: 0,
    trail: []
  };
}

function startLevel() {
  level = generateLevel(currentLevel);
  resetPlayer();
  elapsed = 0;
  levelStartedAt = performance.now();
  lastFrame = performance.now();
  running = true;
  hideOverlay();
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(loop);
  updateStats();
}

function restartLevel() {
  startLevel();
}

function skipLevel() {
  if (running || currentLevel >= MAX_LEVEL) return;
  currentLevel += 1;
  bestLevel = Math.max(bestLevel, currentLevel);
  saveProgress();
  level = generateLevel(currentLevel);
  resetPlayer();
  elapsed = 0;
  updateStats();
  showOverlay('LEVEL SKIPPED', `Level ${currentLevel - 1} was skipped. Level ${currentLevel} is ready when you are.`, 'START LEVEL');
  draw(performance.now());
}

function jumpToLevel() {
  if (running) return;
  const requested = clamp(Math.round(Number(jumpLevelInput.value) || currentLevel), 1, MAX_LEVEL);
  currentLevel = requested;
  bestLevel = Math.max(bestLevel, currentLevel);
  saveProgress();
  level = generateLevel(currentLevel);
  resetPlayer();
  elapsed = 0;
  updateStats();
  showOverlay('LEVEL SELECTED', `Level ${currentLevel} is loaded. Beat it, retry it, or skip ahead whenever you want.`, 'START LEVEL');
  draw(performance.now());
}

function killPlayer(message = 'The course got you. Take another line.') {
  if (!running) return;
  running = false;
  deaths += 1;
  saveProgress();
  updateStats();
  showOverlay('RUN ENDED', `${message} Level ${currentLevel} is ready for a retry.`, 'RETRY LEVEL');
  draw(performance.now());
}

function finishLevel() {
  if (!running) return;
  running = false;
  elapsed = Math.max(0, (performance.now() - levelStartedAt) / 1000);
  if (currentLevel >= bestLevel) {
    bestLevel = Math.min(MAX_LEVEL, currentLevel + 1);
  }
  const completed = currentLevel;
  if (currentLevel < MAX_LEVEL) currentLevel += 1;
  saveProgress();
  updateStats();
  window.RecessPoints?.award?.(25 + Math.floor(completed / 10), 'Parkour level cleared');
  if (completed === MAX_LEVEL) {
    showOverlay('1000 LEVELS CLEARED', 'You finished the full Parkour 1000 gauntlet. The course has no more flags.', 'PLAY AGAIN', 'FINAL FORM');
  } else {
    showOverlay('LEVEL CLEAR', `Flag reached in ${formatTime(elapsed)}. Level ${currentLevel} is unlocked.`, 'NEXT LEVEL', `LEVEL ${String(completed).padStart(3, '0')} CLEAR`);
  }
  draw(performance.now());
}

function rectsOverlap(a, b, pad = 0) {
  return a.x + a.w - pad > b.x && a.x + pad < b.x + b.w && a.y + a.h - pad > b.y && a.y + pad < b.y + b.h;
}

function updateMovingPlatforms(now) {
  const time = now / 1000;
  level.platforms.forEach(platform => {
    if (platform.kind === 'moving') {
      platform.x = platform.homeX + Math.sin(time * platform.speed + platform.phase) * platform.range;
    }
  });
  level.hazards.forEach(hazard => {
    if (hazard.kind === 'saw') hazard.y += Math.sin(time * 3 + hazard.phase) * 0.08;
  });
}

function physics(dt, now) {
  updateMovingPlatforms(now);
  const left = keys.has('ArrowLeft') || keys.has('KeyA');
  const right = keys.has('ArrowRight') || keys.has('KeyD');
  const down = keys.has('ArrowDown') || keys.has('KeyS');
  const jumpHeld = keys.has('Space') || keys.has('ArrowUp') || keys.has('KeyW');
  const acceleration = 1750 + level.difficulty * 230;
  const topSpeed = level.speedLimit;
  if (left) {
    player.vx -= acceleration * dt;
    player.facing = -1;
  }
  if (right) {
    player.vx += acceleration * dt;
    player.facing = 1;
  }
  if (!left && !right) player.vx *= Math.pow(0.0008, dt);
  player.vx = clamp(player.vx, -topSpeed, topSpeed);
  player.coyote = player.grounded ? 0.11 : Math.max(0, player.coyote - dt);
  player.jumpBuffer = jumpHeld ? 0.12 : Math.max(0, player.jumpBuffer - dt);
  if (player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = -(690 + level.difficulty * 55);
    player.grounded = false;
    player.coyote = 0;
    player.jumpBuffer = 0;
    player.squash = 1;
  }
  if (!jumpHeld && player.vy < -220) player.vy += 1700 * dt;
  player.vy += (down ? 2350 : 1720) * dt;
  const previousBottom = player.y + player.h;
  const previousX = player.x;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.grounded = false;

  for (const platform of level.platforms) {
    const horizontal = player.x + player.w - 5 > platform.x && player.x + 5 < platform.x + platform.w;
    const landing = previousBottom <= platform.y + 5 && player.y + player.h >= platform.y && player.vy >= 0;
    if (horizontal && landing) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.grounded = true;
      player.coyote = 0.11;
      player.squash = 1;
      break;
    }
  }

  for (const hazard of level.hazards) {
    const hazardBox = { x: hazard.x, y: hazard.y + (hazard.kind === 'saw' ? 2 : 4), w: hazard.w, h: hazard.h - 2 };
    if (rectsOverlap(player, hazardBox, 5)) {
      killPlayer('A hazard clipped your route.');
      return;
    }
  }
  if (player.y > HEIGHT + 100) {
    killPlayer('You missed the landing.');
    return;
  }
  const finishBox = { x: level.goal.x - 7, y: level.goal.y, w: 28, h: 96 };
  if (rectsOverlap(player, finishBox, 2)) {
    finishLevel();
    return;
  }
  if (Math.abs(player.x - previousX) > 0.1 || Math.abs(player.vy) > 1) {
    player.trail.push({ x: player.x, y: player.y, alpha: 0.28 });
  }
  if (player.trail.length > 8) player.trail.shift();
  player.squash = Math.max(0, player.squash - dt * 5);
}

function cameraX() {
  return clamp(player.x - 230, 0, Math.max(0, level.width - WIDTH));
}

function roundedRect(context, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function drawBackground(cam) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, '#07140c');
  gradient.addColorStop(1, '#020403');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = 'rgba(57,255,136,.10)';
  ctx.lineWidth = 1;
  const grid = 48;
  const xOffset = -((cam * 0.25) % grid);
  for (let x = xOffset; x < WIDTH; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 28; y < HEIGHT; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(57,255,136,.08)';
  ctx.beginPath();
  ctx.arc(770 - cam * 0.08, 96, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(57,255,136,.07)';
  ctx.font = '700 84px Audiowide, sans-serif';
  ctx.fillText(String(currentLevel).padStart(3, '0'), 34, 128);
}

function drawPlatforms(cam) {
  for (const platform of level.platforms) {
    const x = platform.x - cam;
    if (x + platform.w < -20 || x > WIDTH + 20) continue;
    ctx.fillStyle = platform.kind === 'moving' ? '#b8ffcf' : '#39ff88';
    roundedRect(ctx, x, platform.y, platform.w, platform.h, 4);
    ctx.fill();
    ctx.fillStyle = platform.kind === 'moving' ? '#6eefa2' : '#14934e';
    ctx.fillRect(x, platform.y + 11, platform.w, 7);
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    ctx.fillRect(x + 10, platform.y + 3, Math.max(16, platform.w * 0.22), 3);
  }
}

function drawHazards(cam, now) {
  for (const hazard of level.hazards) {
    const x = hazard.x - cam;
    if (x + hazard.w < -20 || x > WIDTH + 20) continue;
    ctx.fillStyle = '#ff5f72';
    if (hazard.kind === 'saw') {
      ctx.save();
      ctx.translate(x + hazard.w / 2, hazard.y + hazard.h / 2);
      ctx.rotate(now / 180 + hazard.phase);
      ctx.beginPath();
      for (let i = 0; i < 16; i += 1) {
        const radius = i % 2 ? hazard.w * 0.34 : hazard.w * 0.55;
        const angle = (i / 16) * Math.PI * 2;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#280d15';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.moveTo(x, hazard.y + hazard.h);
      ctx.lineTo(x + hazard.w / 2, hazard.y);
      ctx.lineTo(x + hazard.w, hazard.y + hazard.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.fillRect(x + hazard.w * 0.45, hazard.y + hazard.h * 0.35, 2, hazard.h * 0.34);
    }
  }
}

function drawGoal(cam) {
  const x = level.goal.x - cam;
  ctx.strokeStyle = '#f6ffb8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, level.goal.y + 96);
  ctx.lineTo(x, level.goal.y);
  ctx.stroke();
  ctx.fillStyle = '#f6ffb8';
  ctx.beginPath();
  ctx.moveTo(x, level.goal.y);
  ctx.lineTo(x + 43, level.goal.y + 14);
  ctx.lineTo(x, level.goal.y + 29);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#39ff88';
  ctx.font = '700 12px Audiowide, sans-serif';
  ctx.fillText('FINISH', x - 10, level.goal.y - 12);
}

function drawPlayer(cam) {
  for (const ghost of player.trail) {
    ctx.fillStyle = `rgba(57,255,136,${ghost.alpha})`;
    roundedRect(ctx, ghost.x - cam, ghost.y, player.w, player.h, 7);
    ctx.fill();
  }
  const x = player.x - cam;
  const squashX = player.squash * 3;
  ctx.save();
  ctx.translate(x + player.w / 2, player.y + player.h / 2);
  ctx.scale(1 + squashX / 20, 1 - squashX / 30);
  ctx.fillStyle = '#eafff1';
  roundedRect(ctx, -player.w / 2, -player.h / 2, player.w, player.h, 7);
  ctx.fill();
  ctx.fillStyle = '#050806';
  ctx.fillRect(player.facing > 0 ? 3 : -8, -10, 5, 5);
  ctx.fillStyle = '#39ff88';
  ctx.fillRect(-7, 9, 14, 4);
  ctx.restore();
}

function drawHud() {
  const progress = clamp((player.x / Math.max(level.goal.x, 1)) * 100, 0, 100);
  ctx.fillStyle = 'rgba(2,4,3,.75)';
  ctx.fillRect(24, HEIGHT - 42, WIDTH - 48, 10);
  ctx.fillStyle = '#39ff88';
  ctx.fillRect(24, HEIGHT - 42, (WIDTH - 48) * (progress / 100), 10);
  ctx.strokeStyle = 'rgba(234,255,241,.45)';
  ctx.strokeRect(24, HEIGHT - 42, WIDTH - 48, 10);
  ctx.fillStyle = '#eafff1';
  ctx.font = '700 12px Audiowide, sans-serif';
  ctx.fillText(`${Math.round(progress)}% COURSE`, 24, HEIGHT - 56);
  ctx.fillText(`TIME ${formatTime(elapsed)}`, WIDTH - 142, HEIGHT - 56);
  if (noticeTimer > 0) {
    ctx.fillStyle = `rgba(234,255,241,${Math.min(1, noticeTimer)})`;
    ctx.textAlign = 'center';
    ctx.font = '700 16px Audiowide, sans-serif';
    ctx.fillText('KEEP MOVING', WIDTH / 2, 42);
    ctx.textAlign = 'left';
  }
}

function draw(now) {
  if (!level || !player) return;
  const cam = cameraX();
  drawBackground(cam);
  drawPlatforms(cam);
  drawHazards(cam, now);
  drawGoal(cam);
  drawPlayer(cam);
  drawHud();
}

function loop(now) {
  if (!running) return;
  const dt = Math.min(0.032, Math.max(0, (now - lastFrame) / 1000));
  lastFrame = now;
  elapsed = (now - levelStartedAt) / 1000;
  noticeTimer = Math.max(0, noticeTimer - dt);
  physics(dt, now);
  if (running && elapsed > level.timeLimit) {
    killPlayer('The clock ran out. Push harder on the next run.');
    return;
  }
  updateStats();
  draw(now);
  animationFrame = requestAnimationFrame(loop);
}

function pressKey(code) {
  keys.add(code);
  if (code === 'KeyR' && !running) restartLevel();
  if (code === 'KeyN' && !running) skipLevel();
  if ((code === 'Space' || code === 'ArrowUp' || code === 'KeyW') && !running) {
    if (overlay.hidden) startLevel();
  }
}

window.addEventListener('keydown', event => {
  const controls = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyR'];
  if (!controls.includes(event.code)) return;
  event.preventDefault();
  pressKey(event.code);
});

window.addEventListener('keyup', event => keys.delete(event.code));
window.addEventListener('blur', () => keys.clear());

startButton.addEventListener('click', () => startLevel());
skipButton.addEventListener('click', () => skipLevel());
goLevelButton.addEventListener('click', () => jumpToLevel());
jumpLevelInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') jumpToLevel();
});

document.querySelectorAll('[data-parkour-key]').forEach(button => {
  const code = button.dataset.parkourKey;
  const down = event => {
    event.preventDefault();
    pressKey(code);
  };
  const up = event => {
    event.preventDefault();
    keys.delete(code);
  };
  button.addEventListener('pointerdown', down);
  button.addEventListener('pointerup', up);
  button.addEventListener('pointercancel', up);
  button.addEventListener('pointerleave', up);
});

readProgress();
level = generateLevel(currentLevel);
resetPlayer();
updateStats();
showOverlay('READY TO RUN?', 'Reach the flag without touching the hazards. Your progress saves in this browser.', 'START LEVEL');
draw(performance.now());
