const canvas = document.getElementById('runnerCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let player = {x: 50, y: 300, vy: 0, grounded: true};
let obstacles = [];
let score = 0;
const gravity = 0.5;
const jumpStrength = -12;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 350, canvas.width, 50);
    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, 30, 30);
    // Draw obstacles
    ctx.fillStyle = 'red';
    obstacles.forEach(ob => ctx.fillRect(ob.x, ob.y, ob.width, ob.height));
}

function update() {
    // Player physics
    player.vy += gravity;
    player.y += player.vy;
    if (player.y >= 320) {
        player.y = 320;
        player.vy = 0;
        player.grounded = true;
    }
    // Move obstacles
    obstacles.forEach(ob => ob.x -= 5);
    obstacles = obstacles.filter(ob => ob.x > -ob.width);
    // Add new obstacles
    if (Math.random() < 0.01) {
        obstacles.push({x: canvas.width, y: 320, width: 20, height: 30});
    }
    // Check collisions
    obstacles.forEach(ob => {
        if (player.x < ob.x + ob.width && player.x + 30 > ob.x && player.y < ob.y + ob.height && player.y + 30 > ob.y) {
            alert('Game Over! Score: ' + score);
            reset();
        }
    });
    score++;
    scoreElement.textContent = score;
}

function reset() {
    player = {x: 50, y: 300, vy: 0, grounded: true};
    obstacles = [];
    score = 0;
    scoreElement.textContent = score;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && player.grounded) {
        player.vy = jumpStrength;
        player.grounded = false;
    }
});

setInterval(() => {
    update();
    draw();
}, 20);