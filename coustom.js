const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const runnerImg = new Image();
runnerImg.src = 'assets/runner.png'; // Replace with your runner face image path

const chaserImg = new Image();
chaserImg.src = 'assets/chaser.png'; // Replace with your chaser face image path

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let runner = { x: 100, y: 300, width: 60, height: 60, speedX: 3 };
let chaser = { x: 30, y: 300, width: 60, height: 60, speedX: 2.5 };

let stick = {
  length: 50,
  angle: 0,
  angleSpeed: 0.1, // radians per frame
};

let timeSurvived = 0;
let gameOver = false;

function drawRunner() {
  if (runnerImg.complete) {
    ctx.drawImage(runnerImg, runner.x, runner.y - runner.height/2, runner.width, runner.height);
  } else {
    // fallback rectangle
    ctx.fillStyle = 'blue';
    ctx.fillRect(runner.x, runner.y - runner.height/2, runner.width, runner.height);
  }
}

function drawChaser() {
  if (chaserImg.complete) {
    ctx.drawImage(chaserImg, chaser.x, chaser.y - chaser.height/2, chaser.width, chaser.height);
  } else {
    // fallback rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(chaser.x, chaser.y - chaser.height/2, chaser.width, chaser.height);
  }
}

function drawStick() {
  ctx.save();
  // Position stick pivot at chaser's right middle point
  const pivotX = chaser.x + chaser.width;
  const pivotY = chaser.y;
  ctx.translate(pivotX, pivotY);
  // Swing stick with angle oscillating
  const angle = Math.sin(stick.angle) * 0.8; 
  ctx.rotate(angle);
  ctx.strokeStyle = '#663300';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(stick.length, 0);
  ctx.stroke();
  ctx.restore();
}

function updatePositions() {
  if (gameOver) return;

  // Runner moves right continuously; loops back to start
  runner.x += runner.speedX;
  if (runner.x > canvasWidth) {
    runner.x = -runner.width;
  }

  // Chaser tries to follow runner smoothly
  if (chaser.x < runner.x - 50) {
    chaser.x += chaser.speedX;
  } else if (chaser.x > runner.x + 50) {
    chaser.x -= chaser.speedX;
  }

  // Swing stick angle
  stick.angle += stick.angleSpeed;

  // Increase survival time
  timeSurvived += 1/60; // approx 60fps
  if (timeSurvived >= 30) {
    alert('Runner wins! Survived 30 seconds!');
    gameOver = true;
  }

  // Check for hit: if chaser stick tip is close to runner's bounding box
  // Calculate stick tip position
  const stickPivotX = chaser.x + chaser.width;
  const stickPivotY = chaser.y;
  const stickTipX = stickPivotX + Math.cos(Math.sin(stick.angle)*0.8) * stick.length;
  const stickTipY = stickPivotY + Math.sin(Math.sin(stick.angle)*0.8) * stick.length;

  // Simple collision check: if stick tip overlaps runner box (expanded a bit)
  if (
    stickTipX > runner.x - 10 && stickTipX < runner.x + runner.width + 10 &&
    stickTipY > runner.y - runner.height / 2 - 10 && stickTipY < runner.y + runner.height / 2 + 10
  ) {
    alert('Chaser wins! Runner got hit after ' + Math.floor(timeSurvived) + ' seconds.');
    gameOver = true;
  }
}

function drawTime() {
  ctx.fillStyle = '#662222';
  ctx.font = '20px Arial';
  ctx.fillText('Survived: ' + timeSurvived.toFixed(1) + 's', 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  updatePositions();
  drawRunner();
  drawChaser();
  drawStick();
  drawTime();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Wait for images to load then start
let imagesLoaded = 0;
function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    gameLoop();
  }
}
runnerImg.onload = checkImagesLoaded;
chaserImg.onload = checkImagesLoaded;

// If images fail to load, still start game after a timeout fallback
setTimeout(() => {
  if (imagesLoaded < 2) {
    gameLoop();
  }
}, 2000);