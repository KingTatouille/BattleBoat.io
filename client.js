// Création du socket
const socket = io();

function startGame() {
    const nameForm = document.getElementById('nameForm');
    const gameContainer = document.getElementById('gameContainer');

    nameForm.style.display = 'none';
    gameContainer.style.display = 'block';

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updateGame();
}

document.getElementById('startButton').addEventListener('click', function(e) {
    e.preventDefault();
    const playerName = document.getElementById('nameInput').value;
    if (playerName.trim() === '') {
        alert('Veuillez entrer votre pseudo.');
        return;
    }

    player.name = playerName;
    startGame();
});


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
    player = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        speed: 5,
        lives: 100
    };

    // Initialise le contexte du canvas
    canvas = document.getElementById('gameCanvas');
    context = canvas.getContext('2d');
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
}

function handleChat() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value;
        chatMessages.innerHTML += `<p>${message}</p>`;
        chatInput.value = '';
    });
}

function handleLeaderboard() {
    let players = [
        { name: 'Joueur1', score: 20 },
        { name: 'Joueur2', score: 40 },
        { name: 'Joueur3', score: 30 },
    ];

    players.sort(function(a, b) {
        return b.score - a.score;
    });

    let leaderboard = document.getElementById('leaderboard');

    while (leaderboard.firstChild) {
        leaderboard.firstChild.remove();
    }

    for (let i = 0; i < players.length; i++) {
        let playerElement = document.createElement('li');
        playerElement.textContent = players[i].name + ': ' + players[i].score;
        leaderboard.appendChild(playerElement);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initGame();
    handleChat();
    handleLeaderboard();
});