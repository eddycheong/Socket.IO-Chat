var express = require('express');
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http)

var users = {};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	socket.on('join', function(name){
		console.log(name + ' connected');
		socket.broadcast.emit('chat message', name + ' connected');
		users[socket.id] = name;
	});

	// This rebroadcasts to everyone in the channel
	socket.on('chat message', function(msg){
		console.log('message: ' + msg.id);
		console.log('message: ' + msg.message);
		socket.broadcast.emit('chat message', msg.id + ': ' + msg.message)
	});

	socket.on('disconnect', function(){
		console.log(users[socket.id] +' disconnected');
		io.emit('chat message', users[socket.id] + ' disconnected');
	});
});

http.listen(process.env.PORT || 3000, function () {
  var host = http.address().address;
  var port = http.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

