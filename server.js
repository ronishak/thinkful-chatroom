var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var totalUsers = 0;

io.on('connection', function (socket) {
    totalUsers++;
    socket.broadcast.emit('userUpdate', totalUsers);

    socket.on('typing', function(name) {
      socket.broadcast.emit('typing', name);
    });

    var message = {
      type: 'announcement',
      time: Date.now(),
      name: 'admin',
      text: 'someone joined the chatroom'
    };

    socket.broadcast.emit('message', message);

    socket.on('message', function(message) {
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function() {
      totalUsers--;
      socket.broadcast.emit('userUpdate', totalUsers);
    })
});

server.listen(8080);
