export const templates = {
    'flappy-bird': {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
        canvas { display: block; background: #70c5ce; }
    </style>
</head>
<body>
    <audio id="game-music" loop></audio>
    <script src="js/main.js"></script>
</body>
</html>`,
        'js/main.js': `const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

// Game Parameters (will be replaced)
const SPEED = {{SPEED}};
const GRAVITY = 0.05 * {{GRAVITY}};
const GAP_SIZE = 25 + ({{GAP_SIZE}} * 10);
const SPAWN_RATE = 250 - ({{SPAWN_RATE}} * 15); // Lower is faster

// Assets (will be replaced)
const playerImg = new Image();
playerImg.src = '{{PLAYER_ASSET}}';
const pipeImg = new Image();
pipeImg.src = '{{OBSTACLE_ASSET}}';
const backgroundImg = new Image();
backgroundImg.src = '{{BACKGROUND_ASSET}}';
const gameMusic = document.getElementById('game-music');
gameMusic.src = '{{MUSIC_ASSET}}';

let bird = { x: 50, y: 150, width: 34, height: 24, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameover'

function playMusic() {
    gameMusic.play().catch(e => console.log("Music play failed:", e));
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleInput();
});
canvas.addEventListener('mousedown', handleInput);

function handleInput() {
    if (gameState === 'start') {
        gameState = 'playing';
        playMusic();
    }
    if (gameState === 'playing') {
        bird.velocity = -2.5;
    }
    if (gameState === 'gameover') {
        resetGame();
    }
}


function resetGame() {
    bird = { x: 50, y: 150, width: 34, height: 24, velocity: 0 };
    pipes = [];
    frame = 0;
    score = 0;
    gameState = 'start';
    gameMusic.currentTime = 0;
    gameMusic.pause();
}

function update() {
    if (gameState !== 'playing') return;

    // Bird
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameState = 'gameover';
    }

    // Pipes
    if (frame % SPAWN_RATE === 0) {
        const pipeY = Math.random() * (canvas.height - GAP_SIZE - 100) + 50;
        pipes.push({ x: canvas.width, y: pipeY, width: 52, scored: false });
    }

    pipes.forEach(pipe => {
        pipe.x -= SPEED / 2;

        // Collision
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + GAP_SIZE)) {
            gameState = 'gameover';
        }
        
        // Score
        if (!pipe.scored && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.scored = true;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    frame++;
}

function draw() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.y);
        ctx.drawImage(pipeImg, pipe.x, pipe.y + GAP_SIZE, pipe.width, canvas.height - pipe.y - GAP_SIZE);
    });

    ctx.drawImage(playerImg, bird.x, bird.y, bird.width, bird.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;

    if (gameState === 'start') {
        ctx.strokeText('Tap to Start', canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText('Tap to Start', canvas.width / 2 - 80, canvas.height / 2);
    } else if (gameState === 'gameover') {
        ctx.strokeText('Game Over', canvas.width / 2 - 70, canvas.height / 2 - 20);
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2 - 20);
        ctx.strokeText(\`Score: \${score}\`, canvas.width / 2 - 50, canvas.height / 2 + 20);
        ctx.fillText(\`Score: \${score}\`, canvas.width / 2 - 50, canvas.height / 2 + 20);
    } else {
        ctx.strokeText(score.toString(), canvas.width / 2, 50);
        ctx.fillText(score.toString(), canvas.width / 2, 50);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

backgroundImg.onload = () => {
    gameLoop();
};
`
    },
    'speed-runner': {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speed Runner</title>
    <style>
        body { margin: 0; overflow: hidden; background: #111; display: flex; justify-content: center; align-items: center; height: 100vh; }
        canvas { display: block; }
    </style>
</head>
<body>
    <audio id="game-music" loop></audio>
    <script src="js/main.js"></script>
</body>
</html>`,
        'js/main.js': `const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 360;

// Game Parameters
const SPEED = 1 + {{SPEED}};
const GRAVITY = 0.1 * {{GRAVITY}};
const JUMP_STRENGTH = 4 + {{SPEED}};
const OBSTACLE_SPAWN_RATE = 200 - ({{SPAWN_RATE}} * 10);

// Assets
const playerImg = new Image();
playerImg.src = '{{PLAYER_ASSET}}';
const obstacleImg = new Image();
obstacleImg.src = '{{OBSTACLE_ASSET}}';
const backgroundImg = new Image();
backgroundImg.src = '{{BACKGROUND_ASSET}}';
const gameMusic = document.getElementById('game-music');
gameMusic.src = '{{MUSIC_ASSET}}';

let player = { x: 50, y: canvas.height - 50, width: 40, height: 40, vy: 0, onGround: true };
let obstacles = [];
let frame = 0;
let score = 0;
let gameState = 'start'; // start, playing, gameover
let backgroundX = 0;

function playMusic() {
    gameMusic.play().catch(e => console.log("Music play failed:", e));
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleInput();
});
canvas.addEventListener('mousedown', handleInput);

function handleInput() {
    if (gameState === 'start') {
        gameState = 'playing';
        playMusic();
    }
    if (gameState === 'playing' && player.onGround) {
        player.vy = -JUMP_STRENGTH;
        player.onGround = false;
    }
    if (gameState === 'gameover') {
        resetGame();
    }
}

function resetGame() {
    player = { x: 50, y: canvas.height - 50, width: 40, height: 40, vy: 0, onGround: true };
    obstacles = [];
    frame = 0;
    score = 0;
    gameState = 'start';
    gameMusic.currentTime = 0;
    gameMusic.pause();
}

function update() {
    if (gameState !== 'playing') return;

    // Player physics
    player.vy += GRAVITY;
    player.y += player.vy;

    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    // Spawn obstacles
    if (frame % OBSTACLE_SPAWN_RATE === 0) {
        const height = Math.random() * 30 + 20;
        obstacles.push({ x: canvas.width, y: canvas.height - height, width: 20, height: height });
    }

    // Move obstacles and check for collision
    obstacles.forEach(obs => {
        obs.x -= SPEED;
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y + player.height > obs.y
        ) {
            gameState = 'gameover';
        }
    });

    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    
    backgroundX -= SPEED / 2;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
    
    frame++;
    score = Math.floor(frame / 10);
}

function draw() {
    ctx.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    obstacles.forEach(obs => {
        ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
    });

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;

    if (gameState === 'start') {
        ctx.strokeText('Tap to Run', canvas.width / 2 - 60, canvas.height / 2);
        ctx.fillText('Tap to Run', canvas.width / 2 - 60, canvas.height / 2);
    } else if (gameState === 'gameover') {
        ctx.strokeText('Game Over', canvas.width / 2 - 60, canvas.height / 2 - 20);
        ctx.fillText('Game Over', canvas.width / 2 - 60, canvas.height / 2 - 20);
        ctx.strokeText(\`Score: \${score}\`, canvas.width / 2 - 50, canvas.height / 2 + 20);
        ctx.fillText(\`Score: \${score}\`, canvas.width / 2 - 50, canvas.height / 2 + 20);
    } else {
        ctx.strokeText(score.toString(), 20, 30);
        ctx.fillText(score.toString(), 20, 30);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

backgroundImg.onload = () => {
    gameLoop();
};
`
    },
    'whack-a-mole': {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whack-a-Mole</title>
    <style>
        body { margin: 0; overflow: hidden; background: #228B22; display: flex; justify-content: center; align-items: center; height: 100vh; }
        canvas { display: block; cursor: crosshair; }
    </style>
</head>
<body>
    <audio id="game-music" loop></audio>
    <script src="js/main.js"></script>
</body>
</html>`,
        'js/main.js': `const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

// Game Parameters
const SPAWN_RATE = 120 - ({{SPAWN_RATE}} * 10); // Lower is faster
const MOLE_LIFETIME = 100 - ({{SPEED}} * 5); // Lower is shorter

// Assets
const moleImg = new Image();
moleImg.src = '{{PLAYER_ASSET}}'; // Player asset is the mole
const holeImg = new Image();
holeImg.src = '{{OBSTACLE_ASSET}}'; // Obstacle asset is the hole
const backgroundImg = new Image();
backgroundImg.src = '{{BACKGROUND_ASSET}}';
const gameMusic = document.getElementById('game-music');
gameMusic.src = '{{MUSIC_ASSET}}';

const grid = { rows: 3, cols: 3 };
const holeSize = 100;
const spacing = (canvas.width - grid.cols * holeSize) / (grid.cols + 1);

let moles = [];
let score = 0;
let frame = 0;
let gameState = 'start'; // start, playing, gameover
let timer = 30;

function playMusic() {
    gameMusic.play().catch(e => console.log("Music play failed:", e));
}

canvas.addEventListener('mousedown', handleInput);

function handleInput(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (gameState === 'start') {
        gameState = 'playing';
        playMusic();
    } else if (gameState === 'playing') {
        for (let i = moles.length - 1; i >= 0; i--) {
            const mole = moles[i];
            const dist = Math.sqrt((mouseX - mole.x) ** 2 + (mouseY - mole.y) ** 2);
            if (dist < mole.radius) {
                score++;
                moles.splice(i, 1);
            }
        }
    } else if (gameState === 'gameover') {
        resetGame();
    }
}

function resetGame() {
    moles = [];
    score = 0;
    frame = 0;
    timer = 30;
    gameState = 'start';
    gameMusic.currentTime = 0;
    gameMusic.pause();
}

function update() {
    if (gameState !== 'playing') return;

    if (frame % SPAWN_RATE === 0) {
        if (moles.length < 3) {
            const row = Math.floor(Math.random() * grid.rows);
            const col = Math.floor(Math.random() * grid.cols);
            const x = spacing + col * (holeSize + spacing) + holeSize / 2;
            const y = spacing + row * (holeSize + spacing) + holeSize / 2;
            
            // Avoid spawning on existing mole
            if (!moles.some(m => m.row === row && m.col === col)) {
                moles.push({ x, y, row, col, radius: 40, lifetime: frame + MOLE_LIFETIME });
            }
        }
    }
    
    moles = moles.filter(mole => mole.lifetime > frame);

    if (frame % 60 === 0) {
        timer--;
        if (timer <= 0) {
            gameState = 'gameover';
        }
    }
    frame++;
}

function drawHoles() {
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const x = spacing + col * (holeSize + spacing);
            const y = spacing + row * (holeSize + spacing);
            ctx.drawImage(holeImg, x, y, holeSize, holeSize);
        }
    }
}

function draw() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    drawHoles();

    moles.forEach(mole => {
        ctx.drawImage(moleImg, mole.x - mole.radius, mole.y - mole.radius, mole.radius * 2, mole.radius * 2);
    });

    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    
    ctx.strokeText(\`Score: \${score}\`, 10, 30);
    ctx.fillText(\`Score: \${score}\`, 10, 30);
    ctx.strokeText(\`Time: \${timer}\`, canvas.width - 120, 30);
    ctx.fillText(\`Time: \${timer}\`, canvas.width - 120, 30);
    
    if (gameState === 'start') {
        ctx.strokeText('Click to Start', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Click to Start', canvas.width / 2 - 100, canvas.height / 2);
    } else if (gameState === 'gameover') {
        ctx.strokeText('Game Over!', canvas.width / 2 - 90, canvas.height / 2);
        ctx.fillText('Game Over!', canvas.width / 2 - 90, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

backgroundImg.onload = () => {
    gameLoop();
};
`
    },
    'match-3': {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Match-3</title>
    <style>
        body { margin: 0; overflow: hidden; background: #333; display: flex; justify-content: center; align-items: center; height: 100vh; }
        canvas { display: block; }
    </style>
</head>
<body>
    <audio id="game-music" loop></audio>
    <script src="js/main.js"></script>
</body>
</html>`,
        'js/main.js': `const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const COLS = 8;
const ROWS = 8;
const GEM_SIZE = 50;
canvas.width = COLS * GEM_SIZE;
canvas.height = ROWS * GEM_SIZE;

// Parameters (mostly for theme, logic is complex)
const NUM_GEM_TYPES = 4 + Math.round({{SPEED}} / 2);

// Assets
const gemImg = new Image();
gemImg.src = '{{OBSTACLE_ASSET}}'; // Using obstacle asset for gems
const backgroundImg = new Image();
backgroundImg.src = '{{BACKGROUND_ASSET}}';
const gameMusic = document.getElementById('game-music');
gameMusic.src = '{{MUSIC_ASSET}}';

let grid = [];
let selectedGem = null;
let score = 0;
let gameState = 'playing';

function playMusic() {
    gameMusic.play().catch(e => console.log("Music play failed:", e));
}

function createGem(row, col, type = -1) {
    return {
        row,
        col,
        x: col * GEM_SIZE,
        y: row * GEM_SIZE,
        type: type === -1 ? Math.floor(Math.random() * NUM_GEM_TYPES) : type,
        size: GEM_SIZE,
        isMatched: false
    };
}

function initGrid() {
    for (let r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (let c = 0; c < COLS; c++) {
            grid[r][c] = createGem(r, c);
        }
    }
    // Avoid initial matches
    if (findAllMatches().length > 0) {
        initGrid();
    } else {
        playMusic();
    }
}

function drawGem(gem) {
    // Hue-rotate to create different gem colors from one asset
    ctx.filter = \`hue-rotate(\${gem.type * (360 / NUM_GEM_TYPES)}deg) saturate(1.5)\`;
    ctx.drawImage(gemImg, gem.x, gem.y, gem.size, gem.size);
    ctx.filter = 'none';
}

function draw() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) {
                drawGem(grid[r][c]);
            }
        }
    }

    if (selectedGem && grid[selectedGem.row]?.[selectedGem.col]) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(selectedGem.col * GEM_SIZE, selectedGem.row * GEM_SIZE, GEM_SIZE, GEM_SIZE);
    }
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(\`Score: \${score}\`, 10, canvas.height - 10);
}

function findMatches(row, col) {
    let gemType = grid[row][col].type;
    let matches = [{ row, col }];
    let toCheck = [{ row, col }];
    let checked = { [\`\${row},\${col}\`]: true };

    while (toCheck.length > 0) {
        const { row: r, col: c } = toCheck.pop();
        const neighbors = [{ r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 }];
        for (const neighbor of neighbors) {
            const { r: nr, c: nc } = neighbor;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !checked[\`\${nr},\${nc}\`] && grid[nr][nc]?.type === gemType) {
                matches.push({ row: nr, col: nc });
                toCheck.push({ row: nr, col: nc });
                checked[\`\${nr},\${nc}\`] = true;
            }
        }
    }
    return matches;
}


function findAllMatches() {
    let allMatches = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) {
                // Horizontal
                if (c < COLS - 2 && grid[r][c+1] && grid[r][c+2] && grid[r][c].type === grid[r][c+1].type && grid[r][c].type === grid[r][c+2].type) {
                    allMatches.push(grid[r][c], grid[r][c+1], grid[r][c+2]);
                }
                // Vertical
                if (r < ROWS - 2 && grid[r+1]?.[c] && grid[r+2]?.[c] && grid[r][c].type === grid[r+1][c].type && grid[r][c].type === grid[r+2][c].type) {
                    allMatches.push(grid[r][c], grid[r+1][c], grid[r+2][c]);
                }
            }
        }
    }
    return [...new Set(allMatches)]; // Remove duplicates
}


function removeMatches(matches) {
    if (matches.length > 0) {
        score += matches.length * 10;
        matches.forEach(gemPos => {
            grid[gemPos.row][gemPos.col] = null;
        });
        return true;
    }
    return false;
}

function dropGems() {
    for (let c = 0; c < COLS; c++) {
        let emptyRow = null;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][c] === null && emptyRow === null) {
                emptyRow = r;
            } else if (grid[r][c] !== null && emptyRow !== null) {
                grid[emptyRow][c] = grid[r][c];
                grid[emptyRow][c].row = emptyRow;
                grid[emptyRow][c].y = emptyRow * GEM_SIZE;
                grid[r][c] = null;
                emptyRow--;
            }
        }
    }
}

function fillGems() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === null) {
                grid[r][c] = createGem(r, c);
            }
        }
    }
}

async function handleTurn() {
    let matches = findAllMatches();
    while (matches.length > 0) {
        removeMatches(matches);
        await new Promise(res => setTimeout(res, 200)); // wait for animation
        dropGems();
        fillGems();
        await new Promise(res => setTimeout(res, 200)); // wait for animation
        matches = findAllMatches();
    }
    gameState = 'playing';
}

function swapGems(gem1, gem2) {
    const tempType = grid[gem1.row][gem1.col].type;
    grid[gem1.row][gem1.col].type = grid[gem2.row][gem2.col].type;
    grid[gem2.row][gem2.col].type = tempType;

    if (findAllMatches().length > 0) {
        handleTurn();
    } else { // Invalid swap, swap back
        setTimeout(() => {
            const tempType = grid[gem1.row][gem1.col].type;
            grid[gem1.row][gem1.col].type = grid[gem2.row][gem2.col].type;
            grid[gem2.row][gem2.col].type = tempType;
            gameState = 'playing';
        }, 200);
    }
}

canvas.addEventListener('mousedown', e => {
    if (gameState !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / GEM_SIZE);
    const row = Math.floor(y / GEM_SIZE);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;

    if (!selectedGem) {
        selectedGem = { row, col };
    } else {
        const dRow = Math.abs(row - selectedGem.row);
        const dCol = Math.abs(col - selectedGem.col);

        if ((dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1)) {
            gameState = 'swapping';
            swapGems(selectedGem, { row, col });
        }
        selectedGem = null;
    }
});


function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

backgroundImg.onload = () => {
    initGrid();
    gameLoop();
};
`
    },
    'crossy-road': {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crossy Road</title>
    <style>
        body { margin: 0; overflow: hidden; background: #333; display: flex; justify-content: center; align-items: center; height: 100vh; }
        canvas { display: block; }
    </style>
</head>
<body>
    <audio id="game-music" loop></audio>
    <script src="js/main.js"></script>
</body>
</html>`,
        'js/main.js': `const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const TILE_SIZE = 40;
canvas.width = TILE_SIZE * 11;
canvas.height = TILE_SIZE * 15;

// Parameters
const CAR_SPEED_MIN = 0.5 + ({{SPEED}} / 5);
const CAR_SPEED_MAX = 1.5 + ({{SPEED}} / 3);

// Assets
const playerImg = new Image();
playerImg.src = '{{PLAYER_ASSET}}';
const carImg = new Image();
carImg.src = '{{OBSTACLE_ASSET}}'; // Obstacle is car
const bgImg = new Image();
bgImg.src = '{{BACKGROUND_ASSET}}'; // Background is grass/road tile
const gameMusic = document.getElementById('game-music');
gameMusic.src = '{{MUSIC_ASSET}}';


let player = {
    x: 5, // grid position
    y: 14, // grid position
    width: TILE_SIZE,
    height: TILE_SIZE
};

const lanes = [];
let score = 0;
let high_score = 0;
let gameState = 'start'; // start, playing, gameover
let cameraY = 0;

function playMusic() {
    gameMusic.play().catch(e => console.log("Music play failed:", e));
}

function createLanes() {
    for (let i = 0; i < 300; i++) {
        const type = i <= 2 || i > 298 ? 'grass' : (Math.random() > 0.5 ? 'road' : 'grass');
        const direction = Math.random() > 0.5 ? 1 : -1;
        const speed = Math.random() * (CAR_SPEED_MAX - CAR_SPEED_MIN) + CAR_SPEED_MIN;
        lanes.push({ y: 13 - i, type, direction, speed, cars: [] });
    }
    // Spawn initial cars
    lanes.forEach(lane => {
        if (lane.type === 'road') {
            for(let i=0; i<Math.random() * 3 + 1; i++) {
                 lane.cars.push({ x: Math.random() * canvas.width });
            }
        }
    });
}

function resetGame() {
    player = { x: 5, y: 14, width: TILE_SIZE, height: TILE_SIZE };
    score = 0;
    cameraY = 0;
    lanes.length = 0;
    createLanes();
    gameState = 'start';
    gameMusic.currentTime = 0;
    gameMusic.pause();
}

document.addEventListener('keydown', e => {
    if (gameState === 'start') {
        gameState = 'playing';
        playMusic();
    }
    if (gameState !== 'playing') {
        if(e.key === 'r') resetGame();
        return;
    }

    const currentY = Math.floor(player.y);
    switch (e.key) {
        case 'ArrowUp':
            player.y = Math.max(player.y - 1, 0);
            if(Math.floor(player.y) < currentY) {
                score++;
                high_score = Math.max(score, high_score);
            }
            break;
        case 'ArrowDown':
            player.y = Math.min(player.y + 1, lanes.length - 1);
            break;
        case 'ArrowLeft':
            player.x = Math.max(player.x - 1, 0);
            break;
        case 'ArrowRight':
            player.x = Math.min(player.x + 1, canvas.width / TILE_SIZE - 1);
            break;
    }
});

function update() {
    if (gameState !== 'playing') return;

    // Move cars and check for collision
    const playerLane = lanes[14 - Math.floor(player.y)];

    lanes.forEach(lane => {
        if (lane.type === 'road') {
            lane.cars.forEach(car => {
                car.x += lane.speed * lane.direction;
                if (lane.direction === 1 && car.x > canvas.width) car.x = -TILE_SIZE;
                if (lane.direction === -1 && car.x < -TILE_SIZE) car.x = canvas.width;
            });
        }
    });

    // Collision detection
    if (playerLane.type === 'road') {
        playerLane.cars.forEach(car => {
            const playerScreenX = player.x * TILE_SIZE;
            if (playerScreenX < car.x + TILE_SIZE && playerScreenX + TILE_SIZE > car.x) {
                gameState = 'gameover';
            }
        });
    }

    // Update camera
    const targetCameraY = (player.y - 14) * TILE_SIZE;
    cameraY += (targetCameraY - cameraY) * 0.1;
}

function draw() {
    ctx.save();
    ctx.translate(0, cameraY);
    
    // Draw lanes
    lanes.forEach((lane, index) => {
        const y = index * TILE_SIZE;
        ctx.fillStyle = lane.type === 'road' ? '#444' : '#228B22';
        ctx.fillRect(0, y, canvas.width, TILE_SIZE);
        if (lane.type === 'road') {
            ctx.drawImage(bgImg, 0, y, canvas.width, TILE_SIZE);
            lane.cars.forEach(car => {
                ctx.drawImage(carImg, car.x, y, TILE_SIZE, TILE_SIZE);
            });
        } else {
             ctx.drawImage(bgImg, 0, y, canvas.width, TILE_SIZE);
        }
    });

    // Draw player
    ctx.drawImage(playerImg, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    
    ctx.restore();

    // Draw UI
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(\`Score: \${score}\`, 10, 30);
    ctx.fillText(\`High: \${high_score}\`, canvas.width - 100, 30);
    
    if (gameState === 'start') {
        ctx.fillText('Use Arrows to Move', canvas.width/2 - 120, canvas.height/2);
    } else if (gameState === 'gameover') {
        ctx.fillText('Game Over!', canvas.width/2 - 70, canvas.height/2);
        ctx.fillText("Press 'R' to restart", canvas.width/2 - 110, canvas.height/2 + 30);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop();
`
    }
};
