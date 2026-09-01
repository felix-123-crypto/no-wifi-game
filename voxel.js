(function () {
  "use strict";

  const canvas = document.getElementById("voxel-canvas");
  const stage = document.getElementById("voxel-stage");
  const overlay = document.getElementById("world-overlay");
  const overlayKicker = document.getElementById("overlay-kicker");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayCopy = document.getElementById("overlay-copy");
  const enterButton = document.getElementById("enter-world");
  const controlLine = document.getElementById("control-line");
  const coordinatesEl = document.getElementById("coordinates");
  const fpsEl = document.getElementById("fps");
  const clockEl = document.getElementById("world-clock");
  const scoreEl = document.getElementById("score");
  const bestScoreEl = document.getElementById("best-score");
  const targetLabel = document.getElementById("target-label");
  const healthValue = document.getElementById("health-value");
  const hungerValue = document.getElementById("hunger-value");
  const healthMeter = document.getElementById("health-meter");
  const hungerMeter = document.getElementById("hunger-meter");
  const survivalModeLabel = document.getElementById("survival-mode-label");
  const mobCountEl = document.getElementById("mob-count");
  const settingsButton = document.getElementById("settings-button");
  const settingsPanel = document.getElementById("settings-panel");
  const closeSettingsButton = document.getElementById("close-settings");
  const survivalToggle = document.getElementById("survival-toggle");
  const sensitivityRange = document.getElementById("sensitivity-range");
  const sensitivityOutput = document.getElementById("sensitivity-output");
  const distanceRange = document.getElementById("distance-range");
  const distanceOutput = document.getElementById("distance-output");
  const questKicker = document.getElementById("quest-kicker");
  const questText = document.getElementById("quest-text");
  const hotbar = document.getElementById("hotbar");
  const hotbarButtons = Array.from(hotbar.querySelectorAll("button"));
  const heldBlock = document.getElementById("held-block");
  const toastEl = document.getElementById("toast");
  const joystick = document.getElementById("joystick");
  const joystickKnob = document.getElementById("joystick-knob");
  const touchJump = document.getElementById("touch-jump");
  const touchMine = document.getElementById("touch-mine");
  const touchPlace = document.getElementById("touch-place");

  const WORLD_X = 144;
  const WORLD_Y = 40;
  const WORLD_Z = 144;
  const CHUNK_SIZE = 16;
  const CHUNKS_X = WORLD_X / CHUNK_SIZE;
  const CHUNKS_Z = WORLD_Z / CHUNK_SIZE;
  const WORLD_SEED = 73129;
  const REACH = 6.25;
  const PLAYER_RADIUS = 0.29;
  const PLAYER_HEIGHT = 1.78;
  const EYE_HEIGHT = 1.62;

  const BLOCKS = {
    1: { name: "Grass", hand: "#63ad48", value: 12 },
    2: { name: "Dirt", hand: "#895439", value: 10 },
    3: { name: "Stone", hand: "#7d8790", value: 14 },
    4: { name: "Wood", hand: "#8b5a34", value: 18 },
    5: { name: "Leaves", hand: "#397d3d", value: 8 },
    6: { name: "Sand", hand: "#e5cf82", value: 12 },
    7: { name: "Brick", hand: "#b65342", value: 20 },
    8: { name: "Glass", hand: "#83dbe9", value: 24 },
    9: { name: "Crystal", hand: "#58e6f4", value: 100 }
  };

  const HOTBAR_BLOCKS = hotbarButtons.map(function (button) {
    return Number(button.dataset.block);
  });

  const FACE_DEFINITIONS = [
    {
      direction: [1, 0, 0], normal: [1, 0, 0], shade: 0.82,
      corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]
    },
    {
      direction: [-1, 0, 0], normal: [-1, 0, 0], shade: 0.72,
      corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]]
    },
    {
      direction: [0, 1, 0], normal: [0, 1, 0], shade: 1,
      corners: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]]
    },
    {
      direction: [0, -1, 0], normal: [0, -1, 0], shade: 0.52,
      corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]
    },
    {
      direction: [0, 0, 1], normal: [0, 0, 1], shade: 0.9,
      corners: [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]]
    },
    {
      direction: [0, 0, -1], normal: [0, 0, -1], shade: 0.64,
      corners: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]
    }
  ];

  const TRIANGLE_ORDER = [0, 1, 2, 0, 2, 3];
  const world = new Uint8Array(WORLD_X * WORLD_Y * WORLD_Z);
  const heightMap = new Uint8Array(WORLD_X * WORLD_Z);
  const chunks = [];
  const keys = Object.create(null);
  const player = {
    x: WORLD_X / 2 + 0.5,
    y: 18,
    z: WORLD_Z / 2 + 0.5,
    velocityY: 0,
    yaw: 0,
    pitch: -0.08,
    grounded: false,
    bobTime: 0,
    bobAmount: 0
  };

  const mobs = [];
  const survival = { health: 100, hunger: 100, elapsed: 0, damageCooldown: 0 };

  const touchMove = { x: 0, y: 0 };
  const stats = { score: 0, mined: 0, placed: 0, crystals: 0 };
  const MINED_BLOCKS_PER_ARCADE_AWARD = 4;
  let ordinaryBlocksSinceArcadeAward = 0;
  let gl = null;
  let program = null;
  let outlineBuffer = null;
  let mobBuffer = null;
  let selectedHotbarIndex = 0;
  let currentTarget = null;
  let ready = false;
  let running = false;
  let hasEntered = false;
  let jumpQueued = false;
  let worldElapsed = 0;
  let lastFrameTime = performance.now();
  let lastHudUpdate = 0;
  let lastWorldClockUpdate = 0;
  let lastMineTime = 0;
  let lastPlaceTime = 0;
  let toastTimer = 0;
  let questStage = 0;
  let frameCounter = 0;
  let fpsWindowStart = performance.now();
  let measuredFps = 60;
  let qualityScale = 1;
  let renderDistance = 4.3;
  let lookSensitivity = 0.00225;
  let resizePending = true;
  let joystickPointerId = null;
  let lookPointerId = null;
  let lastLookX = 0;
  let lastLookY = 0;
  let draggingMouse = false;
  let settingsOpen = false;
  let settingsWasRunning = false;
  let survivalMode = true;
  let gameOver = false;
  let audioContext = null;
  let bestScore = loadBestScore();

  const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const hasTouchPointer = (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches) || navigator.maxTouchPoints > 0;
  let touchMode = isCoarsePointer;

  const vertexShaderSource = [
    "attribute vec3 aPosition;",
    "attribute vec3 aNormal;",
    "attribute float aMaterial;",
    "attribute float aShade;",
    "uniform mat4 uProjection;",
    "uniform mat4 uView;",
    "uniform vec3 uCamera;",
    "varying vec3 vWorld;",
    "varying vec3 vNormal;",
    "varying float vMaterial;",
    "varying float vShade;",
    "varying float vDistance;",
    "void main() {",
    "  vWorld = aPosition;",
    "  vNormal = aNormal;",
    "  vMaterial = aMaterial;",
    "  vShade = aShade;",
    "  vDistance = distance(uCamera, aPosition);",
    "  gl_Position = uProjection * uView * vec4(aPosition, 1.0);",
    "}"
  ].join("\n");

  const fragmentShaderSource = [
    "precision mediump float;",
    "uniform vec3 uFogColor;",
    "uniform float uDaylight;",
    "varying vec3 vWorld;",
    "varying vec3 vNormal;",
    "varying float vMaterial;",
    "varying float vShade;",
    "varying float vDistance;",
    "float hash3(vec3 p) {",
    "  p = fract(p * 0.1031);",
    "  p += dot(p, p.yzx + 33.33);",
    "  return fract((p.x + p.y) * p.z);",
    "}",
    "vec3 materialColor(float id, vec3 normal, vec3 position) {",
    "  if (id > 12.5) return vec3(0.45, 0.90, 0.48);",
    "  if (id > 11.5) return vec3(0.67, 0.33, 0.93);",
    "  if (id > 10.5) return vec3(0.95, 0.32, 0.25);",
    "  if (id > 9.5) return vec3(1.0, 0.84, 0.10);",
    "  if (id < 1.5) {",
    "    if (normal.y > 0.5) return vec3(0.27, 0.67, 0.24);",
    "    if (normal.y < -0.5) return vec3(0.42, 0.25, 0.15);",
    "    float grassBand = step(0.76, fract(position.y + 0.001));",
    "    return mix(vec3(0.45, 0.28, 0.17), vec3(0.28, 0.62, 0.22), grassBand);",
    "  }",
    "  if (id < 2.5) return vec3(0.46, 0.28, 0.18);",
    "  if (id < 3.5) return vec3(0.46, 0.50, 0.53);",
    "  if (id < 4.5) {",
    "    if (abs(normal.y) > 0.5) {",
    "      float ring = step(0.47, fract(length(fract(position.xz) - 0.5) * 7.0));",
    "      return mix(vec3(0.50, 0.30, 0.16), vec3(0.34, 0.19, 0.10), ring * 0.45);",
    "    }",
    "    float stripe = step(0.62, fract((position.x + position.z) * 3.0));",
    "    return mix(vec3(0.50, 0.30, 0.16), vec3(0.36, 0.20, 0.10), stripe * 0.5);",
    "  }",
    "  if (id < 5.5) return vec3(0.16, 0.46, 0.20);",
    "  if (id < 6.5) return vec3(0.83, 0.74, 0.43);",
    "  if (id < 7.5) {",
    "    vec2 uv = abs(normal.z) > 0.5 ? position.xy : (abs(normal.x) > 0.5 ? position.zy : position.xz);",
    "    float row = mod(floor(uv.y * 2.0), 2.0);",
    "    float mortarX = step(0.91, fract(uv.x * 2.0 + row * 0.5));",
    "    float mortarY = step(0.84, fract(uv.y * 2.0));",
    "    return mix(vec3(0.61, 0.22, 0.16), vec3(0.78, 0.67, 0.52), min(1.0, mortarX + mortarY));",
    "  }",
    "  if (id < 8.5) {",
    "    float glint = step(0.84, fract((position.x + position.y + position.z) * 2.0));",
    "    return mix(vec3(0.35, 0.77, 0.84), vec3(0.76, 0.96, 0.98), glint * 0.55);",
    "  }",
    "  float crystalBand = step(0.5, fract((position.x - position.y + position.z) * 5.0));",
    "  return mix(vec3(0.06, 0.60, 0.78), vec3(0.42, 0.95, 1.0), crystalBand * 0.6);",
    "}",
    "void main() {",
    "  vec3 normal = normalize(vNormal);",
    "  vec3 base = materialColor(vMaterial, normal, vWorld);",
    "  float grain = 0.90 + hash3(floor(vWorld * 7.0 + normal * 0.02)) * 0.15;",
    "  float directional = 0.78 + max(dot(normal, normalize(vec3(0.45, 1.0, 0.28))), 0.0) * 0.22;",
    "  float light = directional * vShade * uDaylight;",
    "  if (vMaterial > 8.5 && vMaterial < 9.5) light = max(light, 0.94);",
    "  if (vMaterial > 9.5) light = 1.0;",
    "  vec3 shaded = base * light * grain;",
    "  float fog = smoothstep(40.0, 67.0, vDistance);",
    "  gl_FragColor = vec4(mix(shaded, uFogColor, fog), 1.0);",
    "}"
  ].join("\n");

  const locations = {
    position: null,
    normal: null,
    material: null,
    shade: null,
    projection: null,
    view: null,
    camera: null,
    fogColor: null,
    daylight: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(a, b, amount) {
    return a + (b - a) * amount;
  }

  function indexOfBlock(x, y, z) {
    return x + z * WORLD_X + y * WORLD_X * WORLD_Z;
  }

  function indexOfHeight(x, z) {
    return x + z * WORLD_X;
  }

  function isInsideWorld(x, y, z) {
    return x >= 0 && x < WORLD_X && y >= 0 && y < WORLD_Y && z >= 0 && z < WORLD_Z;
  }

  function getBlock(x, y, z) {
    if (!isInsideWorld(x, y, z)) return 0;
    return world[indexOfBlock(x, y, z)];
  }

  function setBlockDirect(x, y, z, id) {
    if (!isInsideWorld(x, y, z)) return;
    world[indexOfBlock(x, y, z)] = id;
  }

  function hash2(x, z) {
    let value = Math.imul(x, 374761393) ^ Math.imul(z, 668265263) ^ WORLD_SEED;
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  }

  function hash3(x, y, z) {
    let value = Math.imul(x, 374761393) ^ Math.imul(y, 1103515245) ^ Math.imul(z, 668265263) ^ WORLD_SEED;
    value = Math.imul(value ^ (value >>> 15), 2246822519);
    value = Math.imul(value ^ (value >>> 13), 3266489917);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  }

  function smooth(value) {
    return value * value * (3 - 2 * value);
  }

  function valueNoise(x, z, scale) {
    const scaledX = x / scale;
    const scaledZ = z / scale;
    const x0 = Math.floor(scaledX);
    const z0 = Math.floor(scaledZ);
    const tx = smooth(scaledX - x0);
    const tz = smooth(scaledZ - z0);
    const a = mix(hash2(x0, z0), hash2(x0 + 1, z0), tx);
    const b = mix(hash2(x0, z0 + 1), hash2(x0 + 1, z0 + 1), tx);
    return mix(a, b, tz);
  }

  function rawTerrainHeight(x, z) {
    const broad = valueNoise(x + 190, z - 70, 29);
    const detail = valueNoise(x - 310, z + 140, 11);
    const ridge = Math.abs(valueNoise(x + 33, z + 51, 18) - 0.5) * 2;
    const wave = (Math.sin(x * 0.095) + Math.cos(z * 0.082)) * 0.75;
    return clamp(Math.floor(7 + broad * 8 + detail * 4 + ridge * 2 + wave), 6, 22);
  }

  function generateWorld() {
    world.fill(0);
    const centerX = Math.floor(WORLD_X / 2);
    const centerZ = Math.floor(WORLD_Z / 2);
    const spawnHeight = rawTerrainHeight(centerX, centerZ);

    for (let z = 0; z < WORLD_Z; z += 1) {
      for (let x = 0; x < WORLD_X; x += 1) {
        const distanceFromSpawn = Math.hypot(x - centerX, z - centerZ);
        const flattenBlend = clamp((distanceFromSpawn - 4) / 7, 0, 1);
        const rawHeight = rawTerrainHeight(x, z);
        const height = clamp(Math.round(mix(spawnHeight, rawHeight, flattenBlend)), 5, WORLD_Y - 10);
        heightMap[indexOfHeight(x, z)] = height;

        for (let y = 0; y <= height; y += 1) {
          let block = 3;
          if (y === height) block = height <= 8 ? 6 : 1;
          else if (y >= height - 3) block = height <= 8 ? 6 : 2;

          if (y > 2 && y < height - 3) {
            const tunnel = Math.sin((x + 11) * 0.29) + Math.sin((z - 7) * 0.31) + Math.sin((y + x * 0.08) * 0.53);
            const pocket = Math.sin((x + z) * 0.17 + y * 0.41);
            if (tunnel + pocket * 0.45 > 2.62) block = 0;
          }

          if (block === 3 && y > 2 && y < height - 2 && hash3(x, y, z) < 0.007) {
            block = 9;
          }

          setBlockDirect(x, y, z, block);
        }
      }
    }

    growTrees(centerX, centerZ);
    buildSpawnBeacon(centerX, centerZ, spawnHeight);
    spawnMobs(centerX, centerZ);
  }

  function spawnMobs(centerX, centerZ) {
    mobs.length = 0;
    for (let i = 0; i < 10; i += 1) {
      const angle = (i / 10) * Math.PI * 2 + hash2(i * 17, i * 23) * 0.45;
      const radius = 18 + (i % 4) * 9 + hash2(i * 31, i * 7) * 8;
      const x = clamp(Math.floor(centerX + Math.cos(angle) * radius), 3, WORLD_X - 4);
      const z = clamp(Math.floor(centerZ + Math.sin(angle) * radius), 3, WORLD_Z - 4);
      const groundY = heightMap[indexOfHeight(x, z)];
      if (Math.abs(groundY - heightMap[indexOfHeight(centerX, centerZ)]) > 8) continue;
      mobs.push({
        x: x + 0.5,
        y: groundY + 1,
        z: z + 0.5,
        dirX: Math.cos(angle + Math.PI * 0.5),
        dirZ: Math.sin(angle + Math.PI * 0.5),
        speed: 0.65 + (i % 3) * 0.16,
        phase: i * 1.7,
        turnTimer: 1.2 + i * 0.18,
        kind: i % 3,
        hitCooldown: 0
      });
    }
  }

  function growTrees(centerX, centerZ) {
    for (let z = 3; z < WORLD_Z - 3; z += 1) {
      for (let x = 3; x < WORLD_X - 3; x += 1) {
        if (Math.hypot(x - centerX, z - centerZ) < 11) continue;
        if (hash2(x * 7 + 19, z * 11 - 5) > 0.021) continue;
        const groundY = heightMap[indexOfHeight(x, z)];
        if (getBlock(x, groundY, z) !== 1 || groundY > WORLD_Y - 9) continue;

        const trunkHeight = 4 + Math.floor(hash2(x + 91, z - 37) * 3);
        for (let y = 1; y <= trunkHeight; y += 1) {
          setBlockDirect(x, groundY + y, z, 4);
        }

        const crownY = groundY + trunkHeight;
        for (let dy = -2; dy <= 2; dy += 1) {
          for (let dz = -2; dz <= 2; dz += 1) {
            for (let dx = -2; dx <= 2; dx += 1) {
              const shape = Math.abs(dx) + Math.abs(dz) + Math.abs(dy) * 0.9;
              if (shape > 4.1) continue;
              if (dx === 0 && dz === 0 && dy <= 0) continue;
              if (hash3(x + dx, crownY + dy, z + dz) < 0.1 && shape > 2.5) continue;
              if (getBlock(x + dx, crownY + dy, z + dz) === 0) {
                setBlockDirect(x + dx, crownY + dy, z + dz, 5);
              }
            }
          }
        }
      }
    }
  }

  function buildSpawnBeacon(centerX, centerZ, spawnHeight) {
    const archZ = centerZ + 8;
    const baseY = Math.max(spawnHeight, heightMap[indexOfHeight(centerX, archZ)]) + 1;

    for (let x = centerX - 3; x <= centerX + 3; x += 1) {
      for (let y = baseY; y < Math.min(WORLD_Y, baseY + 7); y += 1) {
        setBlockDirect(x, y, archZ, 0);
      }
    }

    for (let y = 0; y < 5; y += 1) {
      setBlockDirect(centerX - 2, baseY + y, archZ, 7);
      setBlockDirect(centerX + 2, baseY + y, archZ, 7);
    }
    for (let x = centerX - 2; x <= centerX + 2; x += 1) {
      setBlockDirect(x, baseY + 4, archZ, 7);
    }
    setBlockDirect(centerX, baseY + 5, archZ, 9);
  }

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Unknown shader error";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function createProgram() {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(shaderProgram) || "Unable to link WebGL program";
      gl.deleteProgram(shaderProgram);
      throw new Error(message);
    }
    return shaderProgram;
  }

  function initializeRenderer() {
    gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false
    }) || canvas.getContext("experimental-webgl");

    if (!gl) {
      throw new Error("This browser does not support WebGL.");
    }

    program = createProgram();
    locations.position = gl.getAttribLocation(program, "aPosition");
    locations.normal = gl.getAttribLocation(program, "aNormal");
    locations.material = gl.getAttribLocation(program, "aMaterial");
    locations.shade = gl.getAttribLocation(program, "aShade");
    locations.projection = gl.getUniformLocation(program, "uProjection");
    locations.view = gl.getUniformLocation(program, "uView");
    locations.camera = gl.getUniformLocation(program, "uCamera");
    locations.fogColor = gl.getUniformLocation(program, "uFogColor");
    locations.daylight = gl.getUniformLocation(program, "uDaylight");

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    outlineBuffer = gl.createBuffer();
    mobBuffer = gl.createBuffer();
  }

  function initializeChunks() {
    chunks.length = 0;
    for (let cz = 0; cz < CHUNKS_Z; cz += 1) {
      for (let cx = 0; cx < CHUNKS_X; cx += 1) {
        chunks.push({
          cx: cx,
          cz: cz,
          buffer: gl.createBuffer(),
          count: 0,
          dirty: true
        });
      }
    }

    for (let i = 0; i < chunks.length; i += 1) {
      buildChunkMesh(chunks[i]);
    }
  }

  function pushVertex(vertices, x, y, z, normal, material, shade) {
    vertices.push(x, y, z, normal[0], normal[1], normal[2], material, shade);
  }

  function appendBox(vertices, x, y, z, width, height, depth, material) {
    for (let faceIndex = 0; faceIndex < FACE_DEFINITIONS.length; faceIndex += 1) {
      const face = FACE_DEFINITIONS[faceIndex];
      for (let triangleIndex = 0; triangleIndex < TRIANGLE_ORDER.length; triangleIndex += 1) {
        const corner = face.corners[TRIANGLE_ORDER[triangleIndex]];
        pushVertex(
          vertices,
          x + corner[0] * width,
          y + corner[1] * height,
          z + corner[2] * depth,
          face.normal,
          material,
          face.shade * 1.08
        );
      }
    }
  }

  function buildChunkMesh(chunk) {
    const vertices = [];
    const startX = chunk.cx * CHUNK_SIZE;
    const startZ = chunk.cz * CHUNK_SIZE;
    const endX = Math.min(startX + CHUNK_SIZE, WORLD_X);
    const endZ = Math.min(startZ + CHUNK_SIZE, WORLD_Z);

    for (let y = 0; y < WORLD_Y; y += 1) {
      for (let z = startZ; z < endZ; z += 1) {
        for (let x = startX; x < endX; x += 1) {
          const material = getBlock(x, y, z);
          if (material === 0) continue;

          for (let faceIndex = 0; faceIndex < FACE_DEFINITIONS.length; faceIndex += 1) {
            const face = FACE_DEFINITIONS[faceIndex];
            const neighborX = x + face.direction[0];
            const neighborY = y + face.direction[1];
            const neighborZ = z + face.direction[2];
            if (getBlock(neighborX, neighborY, neighborZ) !== 0) continue;
            if (y === 0 && face.direction[1] === -1) continue;

            const variation = 0.94 + hash3(x, y, z) * 0.1;
            for (let triangleIndex = 0; triangleIndex < TRIANGLE_ORDER.length; triangleIndex += 1) {
              const corner = face.corners[TRIANGLE_ORDER[triangleIndex]];
              pushVertex(
                vertices,
                x + corner[0],
                y + corner[1],
                z + corner[2],
                face.normal,
                material,
                face.shade * variation
              );
            }
          }
        }
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    chunk.count = vertices.length / 8;
    chunk.dirty = false;
  }

  function chunkAt(cx, cz) {
    if (cx < 0 || cx >= CHUNKS_X || cz < 0 || cz >= CHUNKS_Z) return null;
    return chunks[cx + cz * CHUNKS_X];
  }

  function markChunkDirtyAt(x, z) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cz = Math.floor(z / CHUNK_SIZE);
    const center = chunkAt(cx, cz);
    if (center) center.dirty = true;
    if (x % CHUNK_SIZE === 0) {
      const west = chunkAt(cx - 1, cz);
      if (west) west.dirty = true;
    }
    if (x % CHUNK_SIZE === CHUNK_SIZE - 1) {
      const east = chunkAt(cx + 1, cz);
      if (east) east.dirty = true;
    }
    if (z % CHUNK_SIZE === 0) {
      const north = chunkAt(cx, cz - 1);
      if (north) north.dirty = true;
    }
    if (z % CHUNK_SIZE === CHUNK_SIZE - 1) {
      const south = chunkAt(cx, cz + 1);
      if (south) south.dirty = true;
    }
  }

  function changeBlock(x, y, z, id) {
    if (!isInsideWorld(x, y, z)) return false;
    const index = indexOfBlock(x, y, z);
    if (world[index] === id) return false;
    world[index] = id;
    markChunkDirtyAt(x, z);
    return true;
  }

  function rebuildDirtyChunks(limit) {
    let rebuilt = 0;
    for (let i = 0; i < chunks.length && rebuilt < limit; i += 1) {
      if (!chunks[i].dirty) continue;
      buildChunkMesh(chunks[i]);
      rebuilt += 1;
    }
  }

  function perspectiveMatrix(fieldOfView, aspect, near, far) {
    const f = 1 / Math.tan(fieldOfView / 2);
    const rangeInverse = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInverse, -1,
      0, 0, near * far * rangeInverse * 2, 0
    ]);
  }

  function normalize3(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return [x / length, y / length, z / length];
  }

  function lookAtMatrix(eye, center, up) {
    const zAxis = normalize3(eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]);
    const xAxis = normalize3(
      up[1] * zAxis[2] - up[2] * zAxis[1],
      up[2] * zAxis[0] - up[0] * zAxis[2],
      up[0] * zAxis[1] - up[1] * zAxis[0]
    );
    const yAxis = [
      zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1],
      zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2],
      zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0]
    ];

    return new Float32Array([
      xAxis[0], yAxis[0], zAxis[0], 0,
      xAxis[1], yAxis[1], zAxis[1], 0,
      xAxis[2], yAxis[2], zAxis[2], 0,
      -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]),
      -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]),
      -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]),
      1
    ]);
  }

  function getLookDirection() {
    const cosinePitch = Math.cos(player.pitch);
    return [
      Math.sin(player.yaw) * cosinePitch,
      Math.sin(player.pitch),
      Math.cos(player.yaw) * cosinePitch
    ];
  }

  function configureVertexAttributes() {
    const stride = 8 * Float32Array.BYTES_PER_ELEMENT;
    gl.enableVertexAttribArray(locations.position);
    gl.enableVertexAttribArray(locations.normal);
    gl.enableVertexAttribArray(locations.material);
    gl.enableVertexAttribArray(locations.shade);
    gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(locations.normal, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(locations.material, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(locations.shade, 1, gl.FLOAT, false, stride, 7 * Float32Array.BYTES_PER_ELEMENT);
  }

  function getSkyState() {
    const cycle = (worldElapsed / 180 + 0.18) % 1;
    const sunWave = Math.sin(cycle * Math.PI * 2);
    const daylight = clamp(0.72 + sunWave * 0.28, 0.45, 1);
    const blueAmount = clamp((daylight - 0.45) / 0.55, 0, 1);
    return {
      color: [
        mix(0.10, 0.43, blueAmount),
        mix(0.15, 0.70, blueAmount),
        mix(0.29, 0.85, blueAmount)
      ],
      daylight: daylight
    };
  }

  function resizeCanvasIfNeeded() {
    if (!resizePending) return;
    const deviceScale = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.floor(canvas.clientWidth * deviceScale * qualityScale));
    const height = Math.max(1, Math.floor(canvas.clientHeight * deviceScale * qualityScale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    resizePending = false;
  }

  function buildMobMesh() {
    if (!mobBuffer || !mobs.length) return 0;
    const vertices = [];
    for (let i = 0; i < mobs.length; i += 1) {
      const mob = mobs[i];
      const distance = Math.hypot(mob.x - player.x, mob.z - player.z);
      if (distance > renderDistance * CHUNK_SIZE + 8) continue;
      const bob = Math.sin(mob.phase) * 0.035;
      const bodyMaterial = mob.kind === 0 ? 10 : (mob.kind === 1 ? 11 : 12);
      appendBox(vertices, mob.x - 0.36, mob.y + bob, mob.z - 0.36, 0.72, 0.92, 0.72, bodyMaterial);
      appendBox(vertices, mob.x - 0.29, mob.y + 0.9 + bob, mob.z - 0.29, 0.58, 0.5, 0.58, bodyMaterial);
      appendBox(vertices, mob.x - 0.28, mob.y - 0.12 + bob, mob.z - 0.28, 0.2, 0.28, 0.2, bodyMaterial);
      appendBox(vertices, mob.x + 0.08, mob.y - 0.12 + bob, mob.z - 0.28, 0.2, 0.28, 0.2, bodyMaterial);
      if (mob.kind === 0) {
        appendBox(vertices, mob.x - 0.22, mob.y + 1.06 + bob, mob.z - 0.34, 0.11, 0.11, 0.08, 9);
        appendBox(vertices, mob.x + 0.11, mob.y + 1.06 + bob, mob.z - 0.34, 0.11, 0.11, 0.08, 9);
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, mobBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    return vertices.length / 8;
  }

  function renderWorld() {
    if (!gl || !ready) return;
    resizeCanvasIfNeeded();
    rebuildDirtyChunks(2);

    const sky = getSkyState();
    gl.clearColor(sky.color[0], sky.color[1], sky.color[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);

    const look = getLookDirection();
    const eyeY = player.y + EYE_HEIGHT + player.bobAmount;
    const eye = [player.x, eyeY, player.z];
    const center = [eye[0] + look[0], eye[1] + look[1], eye[2] + look[2]];
    const projection = perspectiveMatrix(Math.PI * 0.39, canvas.width / canvas.height, 0.08, 112);
    const view = lookAtMatrix(eye, center, [0, 1, 0]);

    gl.uniformMatrix4fv(locations.projection, false, projection);
    gl.uniformMatrix4fv(locations.view, false, view);
    gl.uniform3f(locations.camera, eye[0], eye[1], eye[2]);
    gl.uniform3f(locations.fogColor, sky.color[0], sky.color[1], sky.color[2]);
    gl.uniform1f(locations.daylight, sky.daylight);

    const playerChunkX = player.x / CHUNK_SIZE;
    const playerChunkZ = player.z / CHUNK_SIZE;
    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      if (Math.abs(chunk.cx + 0.5 - playerChunkX) > renderDistance || Math.abs(chunk.cz + 0.5 - playerChunkZ) > renderDistance) continue;
      if (chunk.count === 0) continue;
      gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffer);
      configureVertexAttributes();
      gl.drawArrays(gl.TRIANGLES, 0, chunk.count);
    }

    const mobVertexCount = buildMobMesh();
    if (mobVertexCount) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mobBuffer);
      configureVertexAttributes();
      gl.drawArrays(gl.TRIANGLES, 0, mobVertexCount);
    }

    if (currentTarget) drawTargetOutline(currentTarget);
  }

  function pushOutlineVertex(vertices, x, y, z) {
    vertices.push(x, y, z, 0, 1, 0, 10, 1);
  }

  function drawTargetOutline(target) {
    const margin = 0.003;
    const x0 = target.x - margin;
    const y0 = target.y - margin;
    const z0 = target.z - margin;
    const x1 = target.x + 1 + margin;
    const y1 = target.y + 1 + margin;
    const z1 = target.z + 1 + margin;
    const corners = [
      [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
      [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]
    ];
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    const vertices = [];
    for (let i = 0; i < edges.length; i += 1) {
      const first = corners[edges[i][0]];
      const second = corners[edges[i][1]];
      pushOutlineVertex(vertices, first[0], first[1], first[2]);
      pushOutlineVertex(vertices, second[0], second[1], second[2]);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, outlineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    configureVertexAttributes();
    gl.disable(gl.CULL_FACE);
    gl.drawArrays(gl.LINES, 0, vertices.length / 8);
    gl.enable(gl.CULL_FACE);
  }

  function playerCollides(x, y, z) {
    const minX = Math.floor(x - PLAYER_RADIUS);
    const maxX = Math.floor(x + PLAYER_RADIUS);
    const minY = Math.floor(y + 0.001);
    const maxY = Math.floor(y + PLAYER_HEIGHT - 0.001);
    const minZ = Math.floor(z - PLAYER_RADIUS);
    const maxZ = Math.floor(z + PLAYER_RADIUS);

    for (let blockY = minY; blockY <= maxY; blockY += 1) {
      for (let blockZ = minZ; blockZ <= maxZ; blockZ += 1) {
        for (let blockX = minX; blockX <= maxX; blockX += 1) {
          if (blockX < 0 || blockX >= WORLD_X || blockZ < 0 || blockZ >= WORLD_Z || blockY < 0) return true;
          if (blockY >= WORLD_Y) continue;
          if (getBlock(blockX, blockY, blockZ) !== 0) return true;
        }
      }
    }
    return false;
  }

  function movePlayerAxis(axis, amount) {
    if (amount === 0) return;
    const nextX = axis === "x" ? player.x + amount : player.x;
    const nextY = axis === "y" ? player.y + amount : player.y;
    const nextZ = axis === "z" ? player.z + amount : player.z;
    if (!playerCollides(nextX, nextY, nextZ)) {
      player[axis] += amount;
      if (axis === "y") player.grounded = false;
      return;
    }
    if (axis === "y") {
      if (amount < 0) player.grounded = true;
      player.velocityY = 0;
    }
  }

  function mobCanWalk(x, z, mob) {
    const blockX = Math.floor(x);
    const blockZ = Math.floor(z);
    if (blockX < 1 || blockX >= WORLD_X - 1 || blockZ < 1 || blockZ >= WORLD_Z - 1) return false;
    const groundY = heightMap[indexOfHeight(blockX, blockZ)];
    const oldGroundY = heightMap[indexOfHeight(Math.floor(mob.x), Math.floor(mob.z))];
    if (Math.abs(groundY - oldGroundY) > 1) return false;
    return getBlock(blockX, groundY + 1, blockZ) === 0 && getBlock(blockX, groundY + 2, blockZ) === 0;
  }

  function updateMobs(deltaTime) {
    if (!mobs.length) return;
    survival.damageCooldown = Math.max(0, survival.damageCooldown - deltaTime);
    for (let i = 0; i < mobs.length; i += 1) {
      const mob = mobs[i];
      mob.phase += deltaTime * 5;
      mob.turnTimer -= deltaTime;
      if (mob.turnTimer <= 0) {
        const turn = (hash2(Math.floor(worldElapsed * 3) + i * 13, i * 19) - 0.5) * 1.8;
        const cos = Math.cos(turn);
        const sin = Math.sin(turn);
        const nextDirX = mob.dirX * cos - mob.dirZ * sin;
        mob.dirZ = mob.dirX * sin + mob.dirZ * cos;
        mob.dirX = nextDirX;
        mob.turnTimer = 1.6 + hash2(i * 7, Math.floor(worldElapsed)) * 2.4;
      }
      const nextX = mob.x + mob.dirX * mob.speed * deltaTime;
      const nextZ = mob.z + mob.dirZ * mob.speed * deltaTime;
      if (mobCanWalk(nextX, nextZ, mob)) {
        mob.x = nextX;
        mob.z = nextZ;
      } else {
        mob.dirX *= -1;
        mob.dirZ *= -1;
        mob.turnTimer = 0.2;
      }
      const blockX = clamp(Math.floor(mob.x), 0, WORLD_X - 1);
      const blockZ = clamp(Math.floor(mob.z), 0, WORLD_Z - 1);
      mob.y = heightMap[indexOfHeight(blockX, blockZ)] + 1;

      const distanceToPlayer = Math.hypot(mob.x - player.x, mob.z - player.z);
      if (survivalMode && distanceToPlayer < 1.45 && survival.damageCooldown <= 0) {
        survival.health = Math.max(0, survival.health - 8);
        survival.damageCooldown = 0.85;
        showToast("A roaming mob hit you! Find shelter.");
        playTone(100, 0.08, "sawtooth", 0.018);
      }
    }
  }

  function updateSurvival(deltaTime) {
    if (!survivalMode || gameOver) return;
    survival.elapsed += deltaTime;
    survival.hunger = Math.max(0, survival.hunger - deltaTime * 0.42);
    if (survival.hunger <= 0) survival.health = Math.max(0, survival.health - deltaTime * 1.25);
    if (survival.health <= 0) {
      gameOver = true;
      running = false;
      resetInput();
      if (document.pointerLockElement === canvas && document.exitPointerLock) document.exitPointerLock();
      overlayKicker.textContent = "SURVIVAL RUN OVER";
      overlayTitle.innerHTML = "FRONTIER<br><span>FALLEN</span>";
      overlayCopy.textContent = "The mobs and the wilderness won this round. Restart to return to the trailhead with a full health bar.";
      enterButton.textContent = "RESTART SURVIVAL";
      overlay.hidden = false;
      playTone(72, 0.18, "sawtooth", 0.022);
    }
  }

  function updatePlayer(deltaTime) {
    if (!running) return;
    let forwardInput = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - touchMove.y;
    let strafeInput = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0) + touchMove.x;
    const inputLength = Math.hypot(forwardInput, strafeInput);
    if (inputLength > 1) {
      forwardInput /= inputLength;
      strafeInput /= inputLength;
    }

    const sprinting = keys.ShiftLeft || keys.ShiftRight;
    const speed = sprinting ? 8.1 : 5.25;
    const forwardX = Math.sin(player.yaw);
    const forwardZ = Math.cos(player.yaw);
    const rightX = Math.cos(player.yaw);
    const rightZ = -Math.sin(player.yaw);
    const moveX = (forwardX * forwardInput + rightX * strafeInput) * speed * deltaTime;
    const moveZ = (forwardZ * forwardInput + rightZ * strafeInput) * speed * deltaTime;
    movePlayerAxis("x", moveX);
    movePlayerAxis("z", moveZ);

    if (jumpQueued && player.grounded) {
      player.velocityY = 8.35;
      player.grounded = false;
      playTone(320, 0.045, "square", 0.018);
    }
    jumpQueued = false;

    player.velocityY -= 23.5 * deltaTime;
    player.velocityY = Math.max(player.velocityY, -30);
    movePlayerAxis("y", player.velocityY * deltaTime);

    const moving = Math.abs(forwardInput) + Math.abs(strafeInput) > 0.08 && player.grounded;
    if (moving) {
      player.bobTime += deltaTime * (sprinting ? 13 : 9);
      player.bobAmount = Math.sin(player.bobTime) * 0.035;
    } else {
      player.bobAmount *= Math.pow(0.02, deltaTime);
    }

    if (player.y < -5) respawnPlayer(true);
  }

  function raycast(origin, direction, maxDistance) {
    let x = Math.floor(origin[0]);
    let y = Math.floor(origin[1]);
    let z = Math.floor(origin[2]);
    const stepX = direction[0] >= 0 ? 1 : -1;
    const stepY = direction[1] >= 0 ? 1 : -1;
    const stepZ = direction[2] >= 0 ? 1 : -1;
    const deltaX = direction[0] === 0 ? Infinity : Math.abs(1 / direction[0]);
    const deltaY = direction[1] === 0 ? Infinity : Math.abs(1 / direction[1]);
    const deltaZ = direction[2] === 0 ? Infinity : Math.abs(1 / direction[2]);
    let maxX = direction[0] === 0 ? Infinity : (direction[0] > 0 ? x + 1 - origin[0] : origin[0] - x) / Math.abs(direction[0]);
    let maxY = direction[1] === 0 ? Infinity : (direction[1] > 0 ? y + 1 - origin[1] : origin[1] - y) / Math.abs(direction[1]);
    let maxZ = direction[2] === 0 ? Infinity : (direction[2] > 0 ? z + 1 - origin[2] : origin[2] - z) / Math.abs(direction[2]);
    let distance = 0;
    let previous = null;

    for (let step = 0; step < 96 && distance <= maxDistance; step += 1) {
      const block = getBlock(x, y, z);
      if (block !== 0) {
        return { x: x, y: y, z: z, block: block, previous: previous, distance: distance };
      }
      previous = { x: x, y: y, z: z };

      if (maxX < maxY && maxX < maxZ) {
        x += stepX;
        distance = maxX;
        maxX += deltaX;
      } else if (maxY < maxZ) {
        y += stepY;
        distance = maxY;
        maxY += deltaY;
      } else {
        z += stepZ;
        distance = maxZ;
        maxZ += deltaZ;
      }
    }
    return null;
  }

  function updateTarget() {
    const direction = getLookDirection();
    const origin = [player.x, player.y + EYE_HEIGHT + player.bobAmount, player.z];
    currentTarget = raycast(origin, direction, REACH);
    if (!currentTarget) {
      targetLabel.textContent = "Nothing in reach";
      return;
    }
    const block = BLOCKS[currentTarget.block];
    targetLabel.textContent = (block ? block.name : "Block") + " - " + currentTarget.distance.toFixed(1) + "m";
  }

  function blockWouldOverlapPlayer(x, y, z) {
    const playerMinX = player.x - PLAYER_RADIUS;
    const playerMaxX = player.x + PLAYER_RADIUS;
    const playerMinY = player.y;
    const playerMaxY = player.y + PLAYER_HEIGHT;
    const playerMinZ = player.z - PLAYER_RADIUS;
    const playerMaxZ = player.z + PLAYER_RADIUS;
    return x < playerMaxX && x + 1 > playerMinX &&
      y < playerMaxY && y + 1 > playerMinY &&
      z < playerMaxZ && z + 1 > playerMinZ;
  }

  function awardArcadePoints(amount, reason) {
    if (!running || !ready || !hasEntered) return false;
    if (!window.RecessPoints || typeof window.RecessPoints.award !== "function") return false;
    try {
      window.RecessPoints.award(amount, reason);
      return true;
    } catch (error) {
      return false;
    }
  }

  function awardMiningArcadePoints() {
    ordinaryBlocksSinceArcadeAward += 1;
    if (ordinaryBlocksSinceArcadeAward < MINED_BLOCKS_PER_ARCADE_AWARD) return;
    ordinaryBlocksSinceArcadeAward = 0;
    awardArcadePoints(1, "Voxel Frontier: mining streak");
  }

  function mineBlock() {
    if (!running || !ready) return;
    const now = performance.now();
    if (now - lastMineTime < 135) return;
    lastMineTime = now;
    updateTarget();
    if (!currentTarget) {
      playTone(90, 0.035, "square", 0.012);
      return;
    }
    if (currentTarget.y === 0) {
      showToast("The frontier floor cannot be mined.");
      playTone(75, 0.06, "square", 0.02);
      return;
    }

    const id = currentTarget.block;
    const block = BLOCKS[id] || BLOCKS[3];
    if (!changeBlock(currentTarget.x, currentTarget.y, currentTarget.z, 0)) return;
    stats.mined += 1;
    stats.score += block.value;
    if (id === 9) {
      stats.crystals += 1;
      awardArcadePoints(10, "Voxel Frontier: rare crystal found");
      showToast("Crystal found! +100 frontier points");
      playTone(660, 0.08, "sine", 0.025);
      window.setTimeout(function () { playTone(880, 0.11, "sine", 0.018); }, 65);
    } else {
      awardMiningArcadePoints();
      playTone(id === 3 ? 125 : 170, 0.045, "square", 0.018);
    }
    swingHeldBlock();
    updateScore();
    updateQuest();
    updateTarget();
  }

  function placeBlock() {
    if (!running || !ready) return;
    const now = performance.now();
    if (now - lastPlaceTime < 135) return;
    lastPlaceTime = now;
    updateTarget();
    if (!currentTarget || !currentTarget.previous) return;
    const location = currentTarget.previous;
    if (!isInsideWorld(location.x, location.y, location.z)) return;
    if (getBlock(location.x, location.y, location.z) !== 0) return;
    if (blockWouldOverlapPlayer(location.x, location.y, location.z)) {
      showToast("Move back before placing that block.");
      return;
    }
    const id = HOTBAR_BLOCKS[selectedHotbarIndex];
    if (!changeBlock(location.x, location.y, location.z, id)) return;
    stats.placed += 1;
    stats.score += 3;
    playTone(id === 8 ? 420 : 230, 0.04, "square", 0.016);
    swingHeldBlock();
    updateScore();
    updateQuest();
    updateTarget();
  }

  function swingHeldBlock() {
    heldBlock.classList.remove("swing");
    void heldBlock.offsetWidth;
    heldBlock.classList.add("swing");
  }

  function updateScore() {
    if (stats.score > bestScore) {
      bestScore = stats.score;
      saveBestScore(bestScore);
    }
    scoreEl.textContent = String(stats.score).padStart(4, "0");
    bestScoreEl.textContent = String(bestScore).padStart(4, "0");
  }

  function calculateQuestStage() {
    if (stats.mined < 5) return 0;
    if (stats.placed < 5) return 1;
    if (stats.crystals < 1) return 2;
    return 3;
  }

  function updateQuest() {
    const nextStage = calculateQuestStage();
    if (nextStage > questStage) {
      stats.score += 50;
      awardArcadePoints(6, "Voxel Frontier: quest complete");
      showToast("Quest complete! +50 bonus points");
      playTone(520, 0.07, "sine", 0.02);
      questStage = nextStage;
      updateScore();
    }

    if (nextStage === 0) {
      questKicker.textContent = "TRAILHEAD QUEST";
      questText.textContent = "Mine " + (5 - stats.mined) + " more block" + (5 - stats.mined === 1 ? "" : "s") + " to scout the frontier";
    } else if (nextStage === 1) {
      questKicker.textContent = "BUILDER QUEST";
      questText.textContent = "Place " + (5 - stats.placed) + " more block" + (5 - stats.placed === 1 ? "" : "s") + " to make a shelter";
    } else if (nextStage === 2) {
      questKicker.textContent = "DEEP EARTH QUEST";
      questText.textContent = "Find and mine a glowing crystal vein";
    } else {
      questKicker.textContent = "FRONTIER MASTER";
      questText.textContent = "Explore, build, and beat your best score";
    }
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2100);
  }

  function loadBestScore() {
    try {
      const value = Number(window.localStorage.getItem("recess-voxel-best") || 0);
      return Number.isFinite(value) ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBestScore(value) {
    try {
      window.localStorage.setItem("recess-voxel-best", String(value));
    } catch (error) {
      // Scores remain available for this session when browser storage is restricted.
    }
  }

  function loadWorldSettings() {
    try {
      const savedSurvival = window.localStorage.getItem("recess-voxel-survival");
      if (savedSurvival !== null) survivalMode = savedSurvival !== "false";
      const savedSensitivity = Number(window.localStorage.getItem("recess-voxel-sensitivity") || 10);
      const savedDistance = Number(window.localStorage.getItem("recess-voxel-distance") || 4);
      sensitivityRange.value = String(clamp(savedSensitivity, 1, 20));
      distanceRange.value = String(clamp(savedDistance, 2, 6));
    } catch (error) {
      // Defaults are fine when storage is restricted.
    }
    survivalToggle.checked = survivalMode;
    lookSensitivity = Number(sensitivityRange.value) * 0.000225;
    renderDistance = Number(distanceRange.value) + 0.3;
    sensitivityOutput.textContent = sensitivityRange.value;
    distanceOutput.textContent = distanceRange.value;
  }

  function saveWorldSettings() {
    try {
      window.localStorage.setItem("recess-voxel-survival", String(survivalMode));
      window.localStorage.setItem("recess-voxel-sensitivity", sensitivityRange.value);
      window.localStorage.setItem("recess-voxel-distance", distanceRange.value);
    } catch (error) {
      // Settings remain active for this session when storage is restricted.
    }
  }

  function setSettingsOpen(open) {
    settingsOpen = open;
    settingsPanel.hidden = !open;
    if (open) {
      settingsWasRunning = running;
      running = false;
      resetInput();
      if (document.pointerLockElement === canvas && document.exitPointerLock) document.exitPointerLock();
    } else if (settingsWasRunning && hasEntered && !gameOver) {
      running = true;
      overlay.hidden = true;
      lastFrameTime = performance.now();
    }
  }

  function initializeAudio() {
    if (audioContext) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      audioContext = null;
    }
  }

  function playTone(frequency, duration, type, volume) {
    if (!audioContext) return;
    try {
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      // Audio is optional; gameplay continues if a device blocks it.
    }
  }

  function selectHotbar(index) {
    selectedHotbarIndex = (index + HOTBAR_BLOCKS.length) % HOTBAR_BLOCKS.length;
    const id = HOTBAR_BLOCKS[selectedHotbarIndex];
    for (let i = 0; i < hotbarButtons.length; i += 1) {
      hotbarButtons[i].setAttribute("aria-pressed", i === selectedHotbarIndex ? "true" : "false");
    }
    heldBlock.style.backgroundColor = BLOCKS[id].hand;
    if (running) showToast(BLOCKS[id].name + " selected");
  }

  function respawnPlayer(showMessage) {
    const spawnX = Math.floor(WORLD_X / 2);
    const spawnZ = Math.floor(WORLD_Z / 2);
    player.x = spawnX + 0.5;
    player.z = spawnZ + 0.5;
    player.y = heightMap[indexOfHeight(spawnX, spawnZ)] + 1.01;
    player.velocityY = 0;
    player.grounded = false;
    player.yaw = 0;
    player.pitch = -0.08;
    if (showMessage && survivalMode) {
      survival.health = 100;
      survival.hunger = Math.max(survival.hunger, 70);
    }
    if (showMessage) showToast("Back at the trailhead.");
  }

  function updateHud(now) {
    const health = Math.round(survival.health);
    const hunger = Math.round(survival.hunger);
    healthValue.textContent = String(health);
    hungerValue.textContent = String(hunger);
    healthMeter.style.width = health + "%";
    hungerMeter.style.width = hunger + "%";
    survivalModeLabel.textContent = survivalMode ? "SURVIVAL MODE" : "CREATIVE MODE";
    mobCountEl.textContent = String(mobs.length);
    if (now - lastHudUpdate > 100) {
      coordinatesEl.textContent = "X " + Math.floor(player.x) + " / Y " + Math.floor(player.y) + " / Z " + Math.floor(player.z);
      lastHudUpdate = now;
    }
    if (now - lastWorldClockUpdate > 800) {
      const totalDay = Math.floor(worldElapsed / 180) + 1;
      const cycle = (worldElapsed / 180 + 0.18) % 1;
      let phase = "MORNING";
      if (cycle >= 0.31 && cycle < 0.58) phase = "MIDDAY";
      else if (cycle >= 0.58 && cycle < 0.77) phase = "EVENING";
      else if (cycle >= 0.77 || cycle < 0.08) phase = "NIGHT";
      clockEl.textContent = "DAY " + totalDay + " - " + phase;
      lastWorldClockUpdate = now;
    }
  }

  function updateFps(now) {
    frameCounter += 1;
    const elapsed = now - fpsWindowStart;
    if (elapsed < 1000) return;
    measuredFps = Math.round(frameCounter * 1000 / elapsed);
    fpsEl.textContent = String(measuredFps);
    frameCounter = 0;
    fpsWindowStart = now;

    if (!running) return;
    if (measuredFps < 48 && qualityScale > 0.64) {
      qualityScale = Math.max(0.64, qualityScale - 0.1);
      resizePending = true;
    } else if (measuredFps > 72 && qualityScale < 1) {
      qualityScale = Math.min(1, qualityScale + 0.05);
      resizePending = true;
    }
  }

  function gameLoop(now) {
    window.requestAnimationFrame(gameLoop);
    const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.034);
    lastFrameTime = now;

    if (running) {
      worldElapsed += deltaTime;
      updatePlayer(deltaTime);
      updateMobs(deltaTime);
      updateSurvival(deltaTime);
      updateTarget();
    }
    updateHud(now);
    updateFps(now);
    renderWorld();
  }

  function resetInput() {
    Object.keys(keys).forEach(function (key) { keys[key] = false; });
    touchMove.x = 0;
    touchMove.y = 0;
    joystickKnob.style.transform = "translate(0px, 0px)";
    jumpQueued = false;
  }

  function showPauseOverlay() {
    if (!hasEntered || touchMode) return;
    running = false;
    resetInput();
    overlayKicker.textContent = "WORLD PAUSED";
    overlayTitle.innerHTML = "VOXEL<br><span>FRONTIER</span>";
    overlayCopy.textContent = "Your world is waiting exactly as you left it. Re-enter to keep mining and building.";
    enterButton.textContent = "RESUME WORLD";
    controlLine.innerHTML = "<span>ESC TO PAUSE</span><span>R TO RESPAWN</span><span>1-8 BLOCKS</span>";
    overlay.hidden = false;
  }

  function beginPlaying() {
    if (!ready) return;
    initializeAudio();
    if (gameOver) {
      gameOver = false;
      survival.health = 100;
      survival.hunger = 100;
      survival.elapsed = 0;
      respawnPlayer(false);
    }
    hasEntered = true;
    resetInput();
    lastFrameTime = performance.now();

    if (touchMode || !canvas.requestPointerLock) {
      running = true;
      overlay.hidden = true;
      showToast(touchMode ? "Drag the world to look around." : "Drag to look - click to mine.");
      return;
    }

    const lockResult = canvas.requestPointerLock();
    if (lockResult && typeof lockResult.catch === "function") {
      lockResult.catch(function () {
        running = true;
        overlay.hidden = true;
        showToast("Pointer lock was blocked. Drag to look around.");
      });
    }
  }

  function updateLook(deltaX, deltaY, sensitivity) {
    player.yaw += deltaX * sensitivity;
    player.pitch = clamp(player.pitch - deltaY * sensitivity, -1.49, 1.49);
  }

  function updateJoystick(event) {
    const bounds = joystick.getBoundingClientRect();
    let x = event.clientX - (bounds.left + bounds.width / 2);
    let y = event.clientY - (bounds.top + bounds.height / 2);
    const maxRadius = 39;
    const distance = Math.hypot(x, y);
    if (distance > maxRadius) {
      x = x / distance * maxRadius;
      y = y / distance * maxRadius;
    }
    touchMove.x = x / maxRadius;
    touchMove.y = y / maxRadius;
    joystickKnob.style.transform = "translate(" + x + "px, " + y + "px)";
  }

  function setupControls() {
    settingsButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setSettingsOpen(!settingsOpen);
    });
    closeSettingsButton.addEventListener("click", function () {
      setSettingsOpen(false);
    });
    survivalToggle.addEventListener("change", function () {
      survivalMode = survivalToggle.checked;
      if (survivalMode) {
        survival.health = 100;
        survival.hunger = 100;
        showToast("Survival mode enabled. Watch your hunger.");
      } else {
        showToast("Creative mode enabled. Mobs cannot hurt you.");
      }
      saveWorldSettings();
    });
    sensitivityRange.addEventListener("input", function () {
      lookSensitivity = Number(sensitivityRange.value) * 0.000225;
      sensitivityOutput.textContent = sensitivityRange.value;
      saveWorldSettings();
    });
    distanceRange.addEventListener("input", function () {
      renderDistance = Number(distanceRange.value) + 0.3;
      distanceOutput.textContent = distanceRange.value;
      saveWorldSettings();
    });

    enterButton.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "touch") touchMode = true;
      else if (event.pointerType === "mouse") touchMode = false;
    });
    enterButton.addEventListener("click", beginPlaying);

    document.addEventListener("keydown", function (event) {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
      if (!keys[event.code] && event.code === "Space") jumpQueued = true;
      keys[event.code] = true;
      if (/^Digit[1-8]$/.test(event.code)) {
        selectHotbar(Number(event.code.slice(5)) - 1);
      }
      if (event.code === "KeyR" && running) respawnPlayer(true);
    });

    document.addEventListener("keyup", function (event) {
      keys[event.code] = false;
    });

    document.addEventListener("mousemove", function (event) {
      if (!running) return;
      if (document.pointerLockElement === canvas) {
        updateLook(event.movementX, event.movementY, lookSensitivity);
      } else if (draggingMouse) {
        updateLook(event.movementX, event.movementY, lookSensitivity * 1.35);
      }
    });

    document.addEventListener("mouseup", function () {
      draggingMouse = false;
    });

    document.addEventListener("pointerlockchange", function () {
      if (document.pointerLockElement === canvas) {
        running = true;
        overlay.hidden = true;
        lastFrameTime = performance.now();
      } else if (hasEntered && !document.hidden && !settingsOpen && !gameOver) {
        showPauseOverlay();
      }
    });

    document.addEventListener("pointerlockerror", function () {
      if (!hasEntered) return;
      running = true;
      overlay.hidden = true;
      showToast("Pointer lock was blocked. Hold and drag to look around.");
    });

    canvas.addEventListener("mousedown", function (event) {
      if (!ready || touchMode) return;
      if (!running) return;
      if (document.pointerLockElement !== canvas) draggingMouse = true;
      if (event.button === 0) mineBlock();
      else if (event.button === 2) placeBlock();
    });

    canvas.addEventListener("click", function () {
      if (hasEntered && running && !touchMode && canvas.requestPointerLock && document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      }
    });

    canvas.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    canvas.addEventListener("wheel", function (event) {
      if (!running) return;
      event.preventDefault();
      selectHotbar(selectedHotbarIndex + (event.deltaY > 0 ? 1 : -1));
    }, { passive: false });

    hotbarButtons.forEach(function (button, index) {
      button.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
        selectHotbar(index);
      });
    });

    joystick.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      event.stopPropagation();
      joystickPointerId = event.pointerId;
      joystick.setPointerCapture(event.pointerId);
      updateJoystick(event);
    });
    joystick.addEventListener("pointermove", function (event) {
      if (event.pointerId !== joystickPointerId) return;
      event.preventDefault();
      updateJoystick(event);
    });
    function releaseJoystick(event) {
      if (event.pointerId !== joystickPointerId) return;
      joystickPointerId = null;
      touchMove.x = 0;
      touchMove.y = 0;
      joystickKnob.style.transform = "translate(0px, 0px)";
    }
    joystick.addEventListener("pointerup", releaseJoystick);
    joystick.addEventListener("pointercancel", releaseJoystick);

    canvas.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && hasEntered && touchMode) {
        touchMode = false;
        running = true;
      }
      if (event.pointerType !== "touch" || !running || lookPointerId !== null) return;
      touchMode = true;
      lookPointerId = event.pointerId;
      lastLookX = event.clientX;
      lastLookY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", function (event) {
      if (event.pointerId !== lookPointerId) return;
      const deltaX = event.clientX - lastLookX;
      const deltaY = event.clientY - lastLookY;
      lastLookX = event.clientX;
      lastLookY = event.clientY;
      updateLook(deltaX, deltaY, 0.0052);
    });
    function releaseLook(event) {
      if (event.pointerId === lookPointerId) lookPointerId = null;
    }
    canvas.addEventListener("pointerup", releaseLook);
    canvas.addEventListener("pointercancel", releaseLook);

    touchJump.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      event.stopPropagation();
      jumpQueued = true;
    });
    touchMine.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      event.stopPropagation();
      mineBlock();
    });
    touchPlace.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      event.stopPropagation();
      placeBlock();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        running = false;
        resetInput();
      } else if (hasEntered && touchMode && !settingsOpen && !gameOver) {
        running = true;
        overlay.hidden = true;
        lastFrameTime = performance.now();
      }
    });

    window.addEventListener("blur", resetInput);
    window.addEventListener("resize", function () { resizePending = true; });
    window.addEventListener("orientationchange", function () { resizePending = true; });

    if (window.ResizeObserver) {
      const resizeObserver = new window.ResizeObserver(function () { resizePending = true; });
      resizeObserver.observe(stage);
    }

    canvas.addEventListener("webglcontextlost", function (event) {
      event.preventDefault();
      running = false;
      overlay.hidden = false;
      overlayKicker.textContent = "RENDERER PAUSED";
      overlayCopy.textContent = "The browser paused 3D graphics. Reload this page to rebuild the world.";
      enterButton.textContent = "RELOAD WORLD";
      enterButton.disabled = false;
      enterButton.onclick = function () { window.location.reload(); };
    });
  }

  function showBootError(error) {
    overlayKicker.textContent = "3D MODE UNAVAILABLE";
    overlayTitle.innerHTML = "VOXEL<br><span>FRONTIER</span>";
    overlayCopy.textContent = "This browser could not start the 3D world. Turn on hardware acceleration or try a current Chrome browser. " + error.message;
    enterButton.textContent = "BACK TO ARCADE";
    enterButton.disabled = false;
    enterButton.onclick = function () { window.location.href = "index.html#catalog"; };
  }

  function boot() {
    try {
      loadWorldSettings();
      overlayKicker.textContent = "CREATING TERRAIN AND CAVES";
      initializeRenderer();
      generateWorld();
      overlayKicker.textContent = "MESHING " + (CHUNKS_X * CHUNKS_Z) + " WORLD CHUNKS";
      initializeChunks();
      respawnPlayer(false);
      selectHotbar(0);
      updateScore();
      updateQuest();
      updateTarget();
      setupControls();
      ready = true;
      enterButton.disabled = false;
      enterButton.textContent = hasTouchPointer ? "TAP OR CLICK TO EXPLORE" : "ENTER WORLD";
      overlayKicker.textContent = WORLD_X + " x " + WORLD_Z + " WORLD READY";
      if (isCoarsePointer) {
        controlLine.innerHTML = "<span>LEFT PAD TO MOVE</span><span>DRAG TO LOOK</span><span>BUTTONS TO BUILD</span>";
      }
      resizePending = true;
      lastFrameTime = performance.now();
      window.requestAnimationFrame(gameLoop);
    } catch (error) {
      showBootError(error);
    }
  }

  bestScoreEl.textContent = String(bestScore).padStart(4, "0");
  window.requestAnimationFrame(function () {
    window.setTimeout(boot, 30);
  });
}());
