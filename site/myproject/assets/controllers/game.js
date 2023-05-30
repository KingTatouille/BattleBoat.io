import io from 'socket.io-client';

// Création du socket
const socket = io('http://localhost:8001');

// Variables pour le jeu
let player;
let enemies = [];
let powerUps = [];
let projectiles = [];

// Ajout de la liste des projectiles
let keys = {};

// Ajout de l'identifiant pour l'animation
let animationId;

// Variables pour le dessin
let canvas;
let context;

// Variables pour la caméra
let camera = {x: 0, y: 0};

document.addEventListener('DOMContentLoaded', (e) => {
    const nameForm = document.getElementById('nameForm');
    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
        e.preventDefault();
        console.log('Pseudo soumis :', nameInput.value); // Ajout pour le débogage
        socket.emit('start game', nameInput.value);
        initGame();
    } else {
        console.error('Element with ID "nameInput" not found');
    }
});


document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        let projectile = {
            x: player.x,
            y: player.y,
            speed: 10,
            width: 10,
            height: 10,
            direction: 'up'
        };
        projectiles.push(projectile);
    }
    keys[e.code] = true;
});

document.addEventListener('keyup', function(e) {
    keys[e.code] = false;
});

function initGame() {
    // Initialise le contexte du canvas
    canvas = document.getElementById('gameCanvas');

    // Taille du canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context = canvas.getContext('2d');
    context.fillStyle = 'red';
    context.fillRect(50, 50, 100, 100);

    player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 50,
        height: 50,
        speed: 5,
        lives: 100,
        name: nameInput.value // use nameInput.value directly here
    };

    enemies.push({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
    });

    powerUps.push({
        x: 200,
        y: 200,
        width: 20,
        height: 20,
        type: 'someType',
    });
    updateGame();
}

function checkCollision(obj1, obj2) {
    if (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y) {
        return true;
    }
    return false;
}

function endGame() {
    cancelAnimationFrame(animationId);
    alert('Game Over');
}

function updateGame() {
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    // Mettre à jour la position de la caméra
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    for (let i = 0; i < projectiles.length; i++) {
        if (projectiles[i].direction === 'up') {
            projectiles[i].y -= projectiles[i].speed;
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        if (checkCollision(player, enemies[i])) {
            player.lives--;
            if(player.lives <= 0) {
                endGame();
            }
        }
    }

    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (checkCollision(projectiles[i], enemies[j])) {
                enemies.splice(j, 1);
                projectiles.splice(i, 1);
            }
        }
    }

    for (let i = 0; i < powerUps.length; i++) {
        if (checkCollision(player, powerUps[i])) {
            player.projectileType = powerUps[i].type;
            powerUps.splice(i, 1);
        }
    }

    drawGame();
    animationId = requestAnimationFrame(updateGame);
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(-camera.x, -camera.y);

    context.fillStyle = 'blue';
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = 'red';
    for (let i = 0; i < projectiles.length; i++) {
        context.fillRect(projectiles[i].x, projectiles[i].y, projectiles[i].width, projectiles[i].height);
    }

    context.fillStyle = 'green';
    for (let i = 0; i < enemies.length; i++) {
        context.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }

    context.fillStyle = 'yellow';
    for (let i = 0; i < powerUps.length; i++) {
        context.fillRect(powerUps[i].x, powerUps[i].y, powerUps[i].width, powerUps[i].height);
    }

    context.fillRect(player.x, player.y, player.width, player.height);

    for (let i = 0; i < projectiles.length; i++) {
        context.fillRect(projectiles[i].x, projectiles[i].y, projectiles[i].width, projectiles[i].height);
    }

    for (let i = 0; i < enemies.length; i++) {
        context.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }

    for (let i = 0; i < powerUps.length; i++) {
        context.fillRect(powerUps[i].x, powerUps[i].y, powerUps[i].width, powerUps[i].height);
    }

    console.log('Drawing game...');
    console.log('Player:', player);
    console.log('Projectiles:', projectiles);
    console.log('Enemies:', enemies);
    console.log('PowerUps:', powerUps);

    context.restore();
}
