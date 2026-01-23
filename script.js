const horse = document.getElementById("horse");
const lantern = document.getElementById("lantern");
const floor = document.getElementById("floor");

// Jumping Mechanics
const GROUND_HEIGHT = 40;
let isJumping = false;

// Day/Night Toggle
let isDay = true;

// Score Counter
let score = 0;
let scoreInterval;

// HORSE JUMP MOVEMENT
document.addEventListener("keydown", function () {
    if (!isJumping) {
        jump();
    }
});

function jump() {
    let position = 40;
    isJumping = true;

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
            }
          }, 20);
        }
    
        position += 5;
        horse.style.bottom = position + "px";
      }, 20);
}

// LANTERN MOVEMENT
function movelantern() {
    let lanternPosition = 580;

    setInterval(() => {
        if (lanternPosition < -20) {
            lanternPosition = 580;
    }
    lanternPosition -= 5;
    lantern.style.left = lanternPosition + "px";
    }, 20);
}

movelantern();

// COLLISION DETECTION
setInterval(() => {
    const horseBottom = parseInt(
        window.getComputedStyle(horse).getPropertyValue("bottom")
    );
    const lanternLeft = parseInt(
        window.getComputedStyle(lantern).getPropertyValue("left")
    );
  
    if (
        lanternLeft < 110 &&
        lanternLeft > 50 &&
        horseBottom <= GROUND_HEIGHT + 10
        ) {
        location.reload();
    }
  }, 10);

// DAY AND NIGHT TOGGLE
setInterval(() => {
    if (isDay) {
        // Night
        game.style.filter = "brightness(0.6)";
    } else {
        // Day
        game.style.filter = "brightness(1)";
    }
    isDay = !isDay;
}, 15000); 

// SCORE COUNTER
function startScore() {
    scoreInterval = setInterval(() => {
        score++;
        document.getElementById("score").textContent = "Year: " + score;
    }, 1000);
}

startScore(); 