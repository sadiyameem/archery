const canvas = document.getElementById('gameArea');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const timeDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('finalScore');

let score = 0;
let misses = 0;
let timeLeft = 60;
let isDragging = false;
let gameActive = true;
let startX, startY, endX, endY;
let arrows = [];
let target = {
    x: 700,
    y: 300,
    radius: 50,
    speed: 2,
    direction: 1
};

let lastTime = performance.now();
function updateTimer() {
const currentTime = performance.now();
if (currentTime - lastTime >= 1000) {
    timeLeft--;
    timeDisplay.textContent = `Time: ${timeLeft}`;
    lastTime = currentTime;
    if (timeLeft <= 0) {
        endGame();
        }
    }
}

class Arrow {
    constructor(x,y,vx,vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.hasHit = false;
    }
    update() {
        if (!gameActive) return true;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > canvas.width || this.y > canvas.height || this.x < 0 || this.y < 0) {
            if (!this.hasHit && gameActive) {
                misses++;
                scoreBoard.textContent = `Score: ${score} | Misses: ${misses}`;
                if (misses >= 3) {
                    endGame();
                }
            }
            return false;
        }
        return true;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 2, this.y - this.vy * 2);
        ctx.strokeStyle = `brown`;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

canvas.addEventListener('mousedown', (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && gameActive) {
        const rect = canvas.getBoundingClientRect();
        endX = e.clientX - rect.left;
        endY = e.clientY - rect.top;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDragging && gameActive) {
        const rect = canvas.getBoundingClientRect();
        endX = e.clientX - rect.left;
        endY = e.clientY - rect.top;
        isDragging = false;

        const vx = (endX - startX) * 0.05;
        const vy = (endY - startY) * 0.05;
        arrows.push(new Arrow(startX, startY, vx, vy));
    }
});

function update() {
    if (!gameActive) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    updateTimer();

    target.y += target.speed * target.direction;
    if (target.y + target.radius > canvas.height || target.y - target.radius < 0) {
        target.direction *= -1;
    }
    drawTarget();

    arrows = arrows.filter(arrow => arrow.update());
    arrows.forEach(arrow => {
        arrow.draw();

        if (!arrow.hasHit) {
            const dx = arrow.x - target.x;
            const dy = arrow.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < target.radius) {
                const points = Math.floor((target.radius - distance) * 2);
                score += Math.max(points, 0);
                scoreBoard.textContent = `Score: ${score} | Misses: ${misses}`;
                arrow.hasHit = true;
                arrows = arrows.filter(a => a !== arrow);
            }
        }
    });

    drawBow();

    if (isDragging && gameActive) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `black`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    requestAnimationFrame(update);
}

function drawBow() {
    ctx.beginPath();
    ctx.arc(50, canvas.height / 2, 20, 0, Math.PI * 2);
    ctx.fillStyle = `gray`;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawTarget() {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `red`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `white`;
    ctx.fill();
}

function endGame() {
    gameActive = false;
    gameOverScreen.style.display = 'block';
    gameOverScreen.textContent = `Final Score: ${score}`;
}

function resetGame() {
    score = 0;
    misses = 0;
    timeLeft = 60;
    gameActive = true;
    arrows = [];
    target.y = 300;
    target.direction = 1;
    scoreBoard.textContent =`Score: ${score} | Misses: ${misses}`;
    timeDisplay.textContent = `Time: ${timeLeft}`;
    gameOverScreen.style.display = 'none';
    lastTime = performance.now();
    update();
}

update();

// let btn = document.getElementById('btn');
// let output = document.getElementById('output');
// let quotes = [
//     'The first bows and arrows were made by ancient Egyptians, about 3,000 years ago.',
//     'Archery was an important skill during the Middle Ages. Many armies trained archers to fight in battle.',
//     'In the USA, the National Archery Association was founded in 1879. It is the oldest sport-governing body in the United States.',
//     'Archery is an official Olympic sport. It has been part of the Summer Plympic program since 1900.',
//     'The worlds fastest archer can shoot an arrow at speeds of over 300 mph.',
//     'Archery is not just a sport. Its also an art form. Many archers create beatiful works of art with their bows and arrows.',
// ];

// btn.addEventListener('click', function() {
//     var randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
//     output.innerHTML = randomQuote;
// })