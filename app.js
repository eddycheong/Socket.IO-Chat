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

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		socket.broadcast.emit('chat message', msg)
	});

	socket.on('disconnect', function(){
		console.log(users[socket.id] +' disconnected');
		io.emit('chat message', users[socket.id] + ' disconnected');
	});
});

http.listen(3000, function () {
  var host = http.address().address;
  var port = http.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

