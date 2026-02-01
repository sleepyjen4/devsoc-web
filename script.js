// DOM
const horse = document.getElementById("horse");
const lantern = document.querySelector(".lantern");
const floor = document.getElementById("floor");
const sun = document.getElementById("sun");
const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");
const rooftop = document.getElementById("rooftop");
const scoreDisplay = document.getElementById("score");

// Game Constants
const GROUND_HEIGHT = 40;
const JUMP_HEIGHT = 80;
const JUMP_SPEED = 5;
const DURATION_OF_DAY = 20000;
const GAME_SPEED = 5;
const NIGHT_GAME_SPEED = 6;
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
    bonusMultiplier = 5;
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

// // LANTERN SPAWNING
// function spawnLantern() {
//   const lantern = document.createElement("div");
//   lantern.classList.add("lantern");

//   if (!isDay) {
//     lantern.classList.add("glow");
//   }

//   game.appendChild(lantern);

//   let lanternPosition = 580;
//   lantern.style.left = lanternPosition + "px";

//   const moveInterval = setInterval(() => {
//     lanternPosition -= gameSpeed;
//     lantern.style.left = lanternPosition + "px";

//     // remove when off-screen
//     if (lanternPosition < -20) {
//       clearInterval(moveInterval);
//       lantern.remove();
//     }
//   }, 20);

//   // random spawn time
//   const randomDelay = Math.random() * spawnRate + 760;
//   setTimeout(spawnLantern, randomDelay);
// }

// // COLLISION DETECTION
// setInterval(() => {
//   const horseBottom = parseInt(
//     window.getComputedStyle(horse).getPropertyValue("bottom"),
//   );

//   document.querySelectorAll(".lantern").forEach((lantern) => {
//     const lanternLeft = parseInt(
//       window.getComputedStyle(lantern).getPropertyValue("left"),
//     );

//     if (
//       lanternLeft < 110 &&
//       lanternLeft > 50 &&
//       horseBottom <= GROUND_HEIGHT + 10
//     ) {
//       location.reload();
//     }
//   });
// }, 10);
