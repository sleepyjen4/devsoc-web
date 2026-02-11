// DOM
const horse = document.getElementById("horse");
const lantern = document.querySelector(".lantern");
const floor = document.getElementById("floor");
const sun = document.getElementById("sun");
const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");
const rooftop = document.getElementById("rooftop");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("final-score");
const restartBtn = document.getElementById("restartBtn");

// Sounds
const jumpSound = new Audio("sounds/jump.mp3");
const scoreSound = new Audio("sounds/score_ding.mp3");

// Game Constants
const GROUND_HEIGHT = 40;
const JUMP_HEIGHT = 80;
const JUMP_SPEED = 4;
const DURATION_OF_DAY = 20000;
const GAME_SPEED = 4;
const NIGHT_GAME_SPEED = 5;
const SPAWN_RATE = 1500;
const NIGHT_SPAWN_RATE = 1250;

// States
let gameStarted = false;
let isDay = true;
let isJumping = false;

// Day/Night Toggle
let lastDayNightToggle = 0;

// Rooftop
let rooftopX = 0;

// Jumping Mechanics
let jumpPosition = GROUND_HEIGHT;
let jumpSpeed = 0;
let jumpState = "on-ground"; // "on-ground", "rising", "falling"

// Score Counter
let lastScoreUpdate = 0;
let score = 1;
let bonusMultiplier = 1;

// Lanterns
let gameSpeed = GAME_SPEED;
let spawnRate = SPAWN_RATE;
let lastLanternSpawn = 0;
let nextLanternDelay = 0;
let lanternList = [];

// Animation Frame
let animationFrameId = null;

// =====================
// INTRO
// =====================

startBtn.addEventListener("click", () => {
  intro.style.opacity = "0";

  setTimeout(() => {
    intro.style.display = "none";
    gameStarted = true;
    startGame();
  }, 800);
});

// =====================
// GAME LOOP
// =====================

function startGame() {
  gameStarted = true;
  sun.classList.add("sun-moving");

  const startTime = performance.now();
  lastDayNightToggle = startTime;
  lastLanternSpawn = startTime;
  lastScoreUpdate = startTime;

  nextLanternDelay = Math.random() * spawnRate + 760;

  gameLoop(startTime);
}

function gameLoop(currentTime) {
  if (!gameStarted) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    return;
  }

  moveRooftop();
  updateScore(currentTime);
  updateDayNight(currentTime);
  updateJump();
  updateLanterns();
  checkCollisions();

  animationFrameId = requestAnimationFrame(gameLoop);
}

// =====================
// ROOFTOP MOVEMENT
// =====================

function moveRooftop() {
  rooftopX -= gameSpeed;
  rooftop.style.backgroundPositionX = rooftopX + "px";
}

// =====================
// SCORE COUNTER
// =====================

function updateScore(currentTime) {
  // Note-to-self: Check if the current time has passed by 1 second
  if (currentTime - lastScoreUpdate >= 1000) {
    score += 1 * bonusMultiplier;
    scoreDisplay.textContent = "Year: " + score;

    if (score > 0 && score % 100 === 0) {
      scoreDisplay.classList.remove("celebrate");
      void scoreDisplay.offsetWidth;
      scoreDisplay.classList.add("celebrate");

      scoreSound.currentTime = 0;
      scoreSound.play();
    }

    lastScoreUpdate = currentTime;
  }
}

// =====================
// DAY AND NIGHT TOGGLE
// =====================

function updateDayNight(currentTime) {
  if (currentTime - lastDayNightToggle >= DURATION_OF_DAY) {
    toggleDayNight();
    lastDayNightToggle = currentTime;
  }
}

function toggleDayNight() {
  isDay = !isDay;

  if (!isDay) {
    // Change to Night
    game.classList.add("night");
    sun.style.backgroundColor = "white";
    horse.classList.add("glow");

    gameSpeed = NIGHT_GAME_SPEED;
    spawnRate = NIGHT_SPAWN_RATE;
    bonusMultiplier = 10;
  } else {
    // Change to Day
    game.classList.remove("night");
    sun.style.backgroundColor = "#fcffb5";
    horse.classList.remove("glow");

    gameSpeed = GAME_SPEED;
    spawnRate = SPAWN_RATE;
    bonusMultiplier = 1;
  }
}

// =====================
// HORSE JUMP MOVEMENT
// =====================

document.addEventListener("keydown", function () {
  if (!isJumping && gameStarted) {
    jump();
  }
});

function jump() {
  if (jumpState === "on-ground") {
    isJumping = true;
    jumpState = "rising";
    jumpSpeed = JUMP_SPEED;
    horse.style.backgroundImage = "url('images/horse2.png')";
    jumpSound.volume = 0.2;
    jumpSound.play();
  }
}

function updateJump() {
  if (jumpState === "grounded") {
    return;
  }

  if (jumpState === "rising") {
    jumpPosition += jumpSpeed;
    horse.style.bottom = jumpPosition + "px";

    if (jumpPosition >= GROUND_HEIGHT + JUMP_HEIGHT) {
      jumpPosition = GROUND_HEIGHT + JUMP_HEIGHT;
      jumpState = "falling";
      jumpSpeed = JUMP_SPEED;
    }
  } else if (jumpState === "falling") {
    jumpPosition -= jumpSpeed;
    horse.style.bottom = jumpPosition + "px";

    // Landed on the ground again
    if (jumpPosition <= GROUND_HEIGHT) {
      jumpPosition = GROUND_HEIGHT;
      jumpState = "on-ground";
      isJumping = false;
      horse.style.backgroundImage = "url('images/horse.png')";
    }
  }
}

// =====================
// LANTERN SPAWNING
// =====================

function updateLanterns() {
  const currentTime = performance.now();

  if (currentTime - lastLanternSpawn >= nextLanternDelay) {
    spawnLantern();
    lastLanternSpawn = currentTime;
    nextLanternDelay = Math.random() * spawnRate + 760;
  }

  lanternList.forEach((lantern, index) => {
    lantern.x -= gameSpeed;
    lantern.element.style.left = lantern.x + "px";

    if (lantern.x < -20) {
      lantern.element.remove();
      lanternList.splice(index, 1);
    }
  });
}

function spawnLantern() {
  const lantern = document.createElement("div");
  lantern.classList.add("lantern");

  if (!isDay) {
    lantern.classList.add("glow");
  }

  game.appendChild(lantern);

  const lanternObject = {
    element: lantern,
    x: 580,
  };

  lantern.style.left = lanternObject.x + "px";
  lanternList.push(lanternObject);
}

// =====================
// COLLISION DETECTION
// =====================

function checkCollisions() {
  const horseBottom = jumpPosition;

  lanternList.forEach((lantern) => {
    if (lantern.x < 110 && lantern.x > 50) {
      if (horseBottom <= GROUND_HEIGHT + 10) {
        gameOver();
      }
    }
  });
}

// ======================
// GAME OVER
// ======================

function gameOver() {
  if (!gameStarted) return;

  gameStarted = false;

  if (score >= 2026) {
    document.getElementById("gameOverText").textContent =
      "Good Fortune Awaits!";
    game.classList.add("finishingGlow");
  }

  let horseName =
    document.getElementById("horseName").value.trim() || "Your Horse";

  finalScoreDisplay.textContent = horseName + " Reached Year " + score + ".";

  gameOverDisplay.classList.add("show");
}
