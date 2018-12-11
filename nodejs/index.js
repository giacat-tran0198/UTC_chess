var http = require('http').createServer().listen(4000);
var io = require('socket.io')(http);

// host of the server
var host = 'localhost';
var port = '8000';

//set users
var lobbyUsers = {};
var users = {};

io.on('connection', function (socket) {

    //set user
    socket.on('login', function (msg) {
        socket.username = msg;
        console.log(socket.username + ' joining lobby');
        socket.emit('login', Object.keys(lobbyUsers));

        users[socket.username] = socket;
        lobbyUsers[socket.username] = socket;

        socket.broadcast.emit('joinlobby', socket.username);
    });

    socket.on('invite', function (msg) {
        console.log(socket.username, ' invite ', msg);

        socket.broadcast.emit('leavelobby', socket.username);
        socket.broadcast.emit('leavelobby', msg);

        delete lobbyUsers[socket.username];
        delete lobbyUsers[msg];

        var oppDict = {};
        oppDict[msg] = socket.username;
        oppDict[socket.username] = msg;

        var setColorUser = {};
        setColorUser[socket.username] = 'white';
        setColorUser[msg] = 'black';
        setColorUser['white'] = socket.username;
        setColorUser['black'] = msg;

        var game = {
            Id: Math.floor((Math.random() * 100) + 1),
            oppDict: oppDict,
            setColorUser: setColorUser
        };

        socket.gameId = game.Id;
        users[msg].gameId = game.Id

        console.log('starting game: ' + game.Id);
        socket.emit('joingame', game);
        users[msg].emit('joingame', game);
    });

    //send the move of pice
    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
    });

    //disconnect when log out or exit browser
    socket.on('disconnect',function(){
        console.log(socket.username+ ' disconnected');

        socket.broadcast.emit('logout',{
            username: socket.username,
            gameId: socket.gameId
        });
    });

    socket.on('quit', function (msg) {
        console.log("quit: " + msg.username);
        socket.broadcast.emit('quit', msg);
    });
});