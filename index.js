var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/send', function(req, res){
  res.sendFile(__dirname + '/send.html');
});

app.get('/receive', function(req, res){
  res.sendFile(__dirname + '/receive.html');
});

io.on('connection', function(socket){
  socket.on('phonenumber', function(msg){
    io.emit('phonenumber', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
