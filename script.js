const horse = document.getElementById("horse");
const lantern = document.querySelector(".lantern");
const floor = document.getElementById("floor");
const sun = document.getElementById("sun");
const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");

// Jumping Mechanics
const GROUND_HEIGHT = 40;
let isJumping = false;

// Day/Night Toggle
let isDay = true;

// Score Counter
let scoreInterval;
let score = 1;
let bonusMultiplier = 1;

// Game 
let dayNightInterval;
let gameStarted = false;
let gameFinished = false;

// Lanterns
let gameSpeed = 5;
let spawnRate = 1500; 

// INTRO
startBtn.addEventListener("click", () => {
    intro.style.opacity = "0";
  
    setTimeout(() => {
        intro.style.display = "none";
        gameStarted = true;
        startGame();
    }, 800);
});

function startGame() {
    gameStarted = true;
    sun.classList.add("sun-moving");

    startDayNightCycle();
    spawnLantern();
    startScore(); 
}  

// SCORE COUNTER
function startScore() {
    scoreInterval = setInterval(() => {
        score += 1 * bonusMultiplier;
        document.getElementById("score").textContent = "Year: " + score;
    }, 1000);
}

// DAY AND NIGHT TOGGLE
function startDayNightCycle() {
    dayNightInterval = setInterval(() => {
        if (isDay) {
            // Night
            game.classList.add("night"); 
            sun.style.backgroundColor = "white";
          
            gameSpeed = 6;
            spawnRate = 1250;
            bonusMultiplier = 5;
        } else {
            // Day
            game.classList.remove("night"); 
            sun.style.backgroundColor = "#fcffb5";
    
            gameSpeed = 5;
            spawnRate = 1500;
            bonusMultiplier = 1;
        }
        isDay = !isDay;
    }, 20000); 
}

// HORSE JUMP MOVEMENT
document.addEventListener("keydown", function () {
    if (!isJumping && gameStarted) {
        jump();
    }
});

function jump() {
    let position = 40;
    isJumping = true;
    horse.style.backgroundImage = "url('images/horse2.png')";

    const upInterval = setInterval(() => {
        if (position >= GROUND_HEIGHT + 80) {
            clearInterval(upInterval);
        
            const downInterval = setInterval(() => {
                position -= 5;
                horse.style.bottom = position + "px";

                if (position < GROUND_HEIGHT) {
                    position = GROUND_HEIGHT;
                    horse.style.bottom = position + "px";
                    clearInterval(downInterval);
                    isJumping = false;
                    horse.style.backgroundImage = "url('images/horse.png')";
                }
            }, 20);
        }
    
        position += 5;
        horse.style.bottom = position + "px";
      }, 20);
}

// LANTERN SPAWNING
function spawnLantern() {
  const lantern = document.createElement("div");
  lantern.classList.add("lantern");

  if (!isDay) { lantern.classList.add("glow");}

  game.appendChild(lantern);

  let lanternPosition = 580;
  lantern.style.left = lanternPosition + "px";

  const moveInterval = setInterval(() => {
    lanternPosition -= gameSpeed;
    lantern.style.left = lanternPosition + "px";

    // remove when off-screen
    if (lanternPosition < -20) {
      clearInterval(moveInterval);
      lantern.remove();
    }
  }, 20);

  // random spawn time
  const randomDelay = Math.random() * spawnRate + 760;
  setTimeout(spawnLantern, randomDelay);
}

// COLLISION DETECTION
setInterval(() => {
    const horseBottom = parseInt(
      window.getComputedStyle(horse).getPropertyValue("bottom")
    );
  
    document.querySelectorAll(".lantern").forEach((lantern) => {
      const lanternLeft = parseInt(
        window.getComputedStyle(lantern).getPropertyValue("left")
      );
  
      if (
        lanternLeft < 110 &&
        lanternLeft > 50 &&
        horseBottom <= GROUND_HEIGHT + 10
      ) {
        // location.reload();
      }
    });
  }, 10);
  