const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0, lives = 3, speed = 5, gameOver = false, timeShards = 0;
const player = { x: 50, y: 300, width: 40, height: 40, dy: 0, jumping: false };
const obstacles = [];
const shards = [];

function spawnObstacle() {
    obstacles.push({ x: canvas.width, y: 340, width: 30, height: 60 });
}

function spawnShard() {
    shards.push({ x: canvas.width, y: 200, width: 20, height: 20 });
}

function updateGame() {
    // Player movement (gravity and jumping)
    if (player.jumping) {
        player.dy += 0.5; // Gravity
        player.y += player.dy;
        if (player.y > 300) {
            player.y = 300;
            player.dy = 0;
            player.jumping = false;
        }
    }

    // Move obstacles and shards
    obstacles.forEach(o => o.x -= speed);
    shards.forEach(s => s.x -= speed);

    // Check collisions with obstacles
    obstacles.forEach(o => {
        if (player.x < o.x + o.width && player.x + player.width > o.x &&
            player.y < o.y + o.height && player.y + player.height > o.y) {
            crash();
        }
    });

    // Collect time shards
    shards.forEach((s, i) => {
        if (player.x < s.x + s.width && player.x + player.width > s.x &&
            player.y < s.y + s.height && player.y + player.height > s.y) {
            timeShards++;
            shards.splice(i, 1);
            if (timeShards >= 3) {
                speed /= 2; // Slow time for 5 seconds
                setTimeout(() => speed *= 2, 5000);
                timeShards = 0;
            }
        }
    });

    // Spawn new obstacles and shards
    if (Math.random() < 0.02) spawnObstacle();
    if (Math.random() < 0.01) spawnShard();

    // Update score
    score += 0.1;
    document.getElementById('score').textContent = `Score: ${Math.floor(score)}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
}

function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player (orange square)
    ctx.fillStyle = '#ff4500';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles (gray rectangles)
    ctx.fillStyle = '#666';
    obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));

    // Draw time shards (gold squares)
    ctx.fillStyle = '#ffd700';
    shards.forEach(s => ctx.fillRect(s.x, s.y, s.width, s.height));
}

function crash() {
    lives--;
    score = Math.floor(score * 0.5); // Penalty: lose half score
    speed += 1; // Increase difficulty
    obstacles.length = 0; // Clear obstacles
    if (lives > 0) {
        resetGame();
    } else {
        gameOver = true;
        alert('Game Over! Final Score: ' + Math.floor(score));
    }
}

function resetGame() {
    player.y = 300;
    player.dy = 0;
    player.jumping = false;
}

function gameLoop() {
    if (!gameOver) {
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
}

// Player controls (jump with spacebar)
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !player.jumping) {
        player.dy = -10; // Jump upward
        player.jumping = true;
    }
});

// Start the game loop
gameLoop();

