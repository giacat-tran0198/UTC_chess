var http = require('http').createServer().listen(4000);
var io = require('socket.io')(http);
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var xhttp = new XMLHttpRequest();
// host of the server
var host = '127.0.0.1';
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

        game = {
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

    socket.on('endgame', function(msg){

        console.log(msg.username + ' send');

        var url = 'http://' + host +':' + port + '/game/save_game/';

        msg['white_player'] = game.setColorUser['white'];
        msg['black_player'] = game.setColorUser['black'];

        // when the request finishes
        xhttp.onreadystatechange = function() {
            // it checks if the request was succeeded
            if(this.readyState === 4 && this.status === 200) {
                // if the value returned from the view is error
                if(xhttp.responseText === "error")
                    console.log("error saving game");
                // if the value returned from the view is success
                else if(xhttp.responseText === "success")
                    console.log("the message was posted successfully");
            }
        };

        // prepares to send
        xhttp.open('POST', url, true);
        // sends the data to the view
        xhttp.send(JSON.stringify(msg));
    });
});