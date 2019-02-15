var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/send', function(req, res){
  console.log(req.protocol +"://" +req.headers.host + req.url+"/123");
  res.redirect(req.protocol + "://" +req.headers.host + req.url+"/123");
});

app.get('/send/*', function(req, res){
  res.sendFile(__dirname + '/send.html');
});

app.get('/receive/*', function(req, res){
  res.sendFile(__dirname + '/receive.html');
});

io.on('connection', function(socket){
  socket.on('room', function(room){
    if (socket.room)
        socket.leave(socket.room);

    socket.room = room;
    console.log("Joining room "+room);
    
    socket.join(room);
  });
  
  socket.on('phonenumber', function(phonenumber){
    if (socket.room)
      io.sockets.to(socket.room).emit('phonenumber', phonenumber);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
