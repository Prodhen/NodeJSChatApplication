var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);

app.use(express.static(__dirname + '/files'));
app.get('/', function (request, response) {
response.sendFile(__dirname +'/files/default.html');
});

var usernames = {};
io.sockets.on('connection', function (socket){

    socket.on('sendchat', function (data) {
        io.sockets.emit('update', socket.username, data);
    });

    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('update', 'Chat App', 'Welcome ' + username + '  You are connected.');
        socket.broadcast.emit('update', 'Chat App', username + ' has joined the chat.');
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('update', 'Chat App', socket.username + ' has left the chat.');
    });

    socket.on('fileUpload', (data, imgurl) => {
        io.sockets.emit('fileUpload', socket.username, data, imgurl);
    });

});


server.listen(9191,'localhost');
console.log('Server Running at : http://localhost:9191' );
