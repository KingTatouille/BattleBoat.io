let express = require('express');
let cors = require('cors');
let app = express();
let http = require('http').Server(app);
let path = require('path');
io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:8000", "http://127.0.0.1:8000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));

let players = {};

io.on('connection', function(socket) {
    console.log('Un utilisateur vient de se connecter');
    players[socket.id] = {
        x: 0,
        y: 0,
        score: 0,
        color: 'hsl(0, 50%, 50%)'
    };
    socket.on('disconnect', function() {
        console.log('Un utilisateur vient de se déconnecter');
        delete players[socket.id];
    });
    socket.on('playerMove', function(playerInfo) {
        players[socket.id] = playerInfo;
    });
    socket.on('updateScore', function(newScore) {
        players[socket.id].score = newScore;
    });

    socket.on('start game', (name) => {
        console.log('Game started for player:', name); // Should log the player's name
        // Handle game start logic here...
    });
});

setInterval(() => {
    io.sockets.emit('players', players);
}, 100);

http.listen(8001, function() {
    console.log('Ports ouverts : *:8001');
});
