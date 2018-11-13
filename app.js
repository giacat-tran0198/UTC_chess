var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

//set users
var numUsers = 0;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', function (socket) {

    //set user0 or user1
    socket.color = numUsers < 1 ? 'white' : 'black';
    numUsers = numUsers < 1 ? 1 : 0; //set 2 users

    //set color for user
    socket.emit('join', {
        color: socket.color
    })


    //send the move of pice
    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
    });

});

http.listen(port, function () {
    console.log('listening on *: ' + port);
}); 