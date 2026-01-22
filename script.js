const horse = document.getElementById("horse");
const barrel = document.getElementById("barrel");

const GROUND_HEIGHT = 40;
let isJumping = false;

let isDay = true;

document.addEventListener("keydown", function () {
    if (!isJumping) {
        jump();
    }
});

// HORSE JUMP MOVEMENT
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

// BARREL MOVEMENT
function moveBarrel() {
    let barrelPosition = 580;

    setInterval(() => {
        if (barrelPosition < -20) {
            barrelPosition = 580;
    }

    barrelPosition -= 5;
    barrel.style.left = barrelPosition + "px";
    }, 20);
}

moveBarrel();

// COLLISION DETECTION

setInterval(() => {
    const horseBottom = parseInt(
        window.getComputedStyle(horse).getPropertyValue("bottom")
    );
    const barrelLeft = parseInt(
        window.getComputedStyle(barrel).getPropertyValue("left")
    );
  
    if (
        barrelLeft < 110 &&
        barrelLeft > 50 &&
        horseBottom <= GROUND_HEIGHT + 10
    ) {
        location.reload();
    }
  }, 10);

// DAY AND NIGHT TOGGLE
setInterval(() => {
    if (isDay) {
        // Night
        game.style.backgroundColor = "#1b4a73";
    } else {
        // Day
        game.style.backgroundColor = "#97d0fc";
    }
    isDay = !isDay;
}, 20000); 
  