let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname));

let players = {};

io.on('connection', function(socket) {
    console.log('Un utilisateur vient de se connecter');
    players[socket.id] = {
        x: 0,
        y: 0,
        color: 'hsl(0, 50%, 50%)'
    };
    socket.on('disconnect', function() {
        console.log('Un utilisateur vient de se déconnecter');
        delete players[socket.id];
    });
    socket.on('playerMove', function(playerInfo) {
        players[socket.id] = playerInfo;
    });
});

setInterval(() => {
    io.sockets.emit('players', players);
}, 100);

http.listen(8001, function() {
    console.log('Ports ouverts : *:8001');
});
