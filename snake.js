const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};
let score = 0;

// Control
document.addEventListener('keydown', setDirection);
function setDirection(e) {
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

// Draw everything
function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, 400, 400);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#00ff7f' : '#32cd32';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = '#ff4040';
  ctx.fillRect(food.x, food.y, box, box);

  // Old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX -= box;
  if (direction === 'UP') snakeY -= box;
  if (direction === 'RIGHT') snakeX += box;
  if (direction === 'DOWN') snakeY += box;

  // If snake eats food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // Game over conditions
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= 400 ||
    snakeY >= 400 ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert('Game Over! Your score: ' + score);
  }

  snake.unshift(newHead);

  // Score text
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 390);
}

function collision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) return true;
  }
  return false;
}

let game = setInterval(draw, 100);
