const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const gameCanvas = document.getElementById('gameCanvas');
const context = gameCanvas.getContext('2d');
const socket = io();

let playerName = '';

const mapWidth = Math.max(2000, window.innerWidth);
const mapHeight = Math.max(2000, window.innerHeight);

let playerImage = new Image();
playerImage.src = 'images/players/default.png';

const arrowDownImage = new Image();
arrowDownImage.src = 'images/players/ArrowDown.png';

const arrowUpImage = new Image();
arrowUpImage.src = 'images/players/ArrowUp.png';

const arrowLeftImage = new Image();
arrowLeftImage.src = 'images/players/ArrowLeft.png';

const arrowRightImage = new Image();
arrowRightImage.src = 'images/players/default.png';

const arrowRightUpImage = new Image();
arrowRightUpImage.src = 'images/players/ArrowRightUp.png';

const arrowLeftUpImage = new Image();
arrowLeftUpImage.src = 'images/players/ArrowLeftUp.png';

const arrowRightDownImage = new Image();
arrowRightDownImage.src = 'images/players/ArrowRightDown.png';

const arrowLeftDownImage = new Image();
arrowLeftDownImage.src = 'images/players/ArrowLeftDown.png';

nameForm.addEventListener('submit', (event) => {
    event.preventDefault();

    playerName = nameInput.value.trim();

    if (playerName !== '') {
        // Hide the elements on the home page
        nameForm.style.display = 'none';
        document.querySelector('.hero').style.display = 'none';

        // Show the game canvas
        gameCanvas.style.display = 'block';

        // Start the game with the player's username
        startGame(playerName);
    }
});

function startGame(playerName) {
    const player = {
        x: Math.random() * gameCanvas.width,
        y: Math.random() * gameCanvas.height,
        color: `hsl(${Math.random() * 360}, 50%, 50%)`,
    };

    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    const keys = {};

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    function drawPlayer(player, cameraX, cameraY) {
        let playerImageToDraw = playerImage;

        if (keys['ArrowRight'] && keys['ArrowUp']) {
            playerImageToDraw = arrowRightUpImage;
        } else if (keys['ArrowLeft'] && keys['ArrowUp']) {
            playerImageToDraw = arrowLeftUpImage;
        } else if (keys['ArrowRight'] && keys['ArrowDown']) {
            playerImageToDraw = arrowRightDownImage;
        } else if (keys['ArrowLeft'] && keys['ArrowDown']) {
            playerImageToDraw = arrowLeftDownImage;
        } else if (keys['ArrowUp']) {
            playerImageToDraw = arrowUpImage;
        } else if (keys['ArrowDown']) {
            playerImageToDraw = arrowDownImage;
        } else if (keys['ArrowLeft']) {
            playerImageToDraw = arrowLeftImage;
        } else if (keys['ArrowRight']) {
            playerImageToDraw = arrowRightImage;
        }

        context.drawImage(playerImageToDraw, player.x - cameraX, player.y - cameraY);
        context.fillText(playerName, player.x - cameraX - 10, player.y - cameraY - 15);
    }

    function update() {
        const speed = 5; 

        if (keys['ArrowUp'] && player.y - speed >= 0) player.y -= speed;
        if (keys['ArrowDown'] && player.y + speed <= mapHeight) player.y += speed;
        if (keys['ArrowLeft'] && player.x - speed >= 0) player.x -= speed;
        if (keys['ArrowRight'] && player.x + speed <= mapWidth) player.x += speed;

        socket.emit('playerMove', { playerName, player });
    }

    setInterval(() => {
        update();
        draw();
        drawHUD();
    }, 1000 / 60);

    let players = {};

    socket.on('players', (data) => {
        players = data;
    });

    function draw() {
        let cameraX = player.x - gameCanvas.width / 2;
        let cameraY = player.y - gameCanvas.height / 2;

        cameraX = Math.max(0, Math.min(cameraX, mapWidth - gameCanvas.width));
        cameraY = Math.max(0, Math.min(cameraY, mapHeight - gameCanvas.height));

        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        drawPlayer(player, cameraX, cameraY);

        for (let id in players) {
            if (id !== socket.id) {
                drawPlayer(players[id], cameraX, cameraY);
            }
        }
    }

    function drawHUD() {
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText(`X : ${Math.round(player.x)}, Y : ${Math.round(player.y)}`, 10, 30);
    }
}
