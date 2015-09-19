var express = require('express');
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	// Broadcast a new user has connected to all connected users
	socket.broadcast.emit('chat message', 'a user connected')

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg)
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('chat message', 'a user disconnected');
	});
});

http.listen(3000, function () {
  var host = http.address().address;
  var port = http.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

