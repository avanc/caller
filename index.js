var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var url = require('url');

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(null, UIDGenerator.BASE36, 8);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/send', function(req, res){
  var room=uidgen.generateSync();
  var redirect_url= url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: "send/"+room
  });
  //req.protocol +"://" +req.headers.host + req.url + "/" + room;
  console.log("First")
  console.log(redirect_url);
  res.redirect(redirect_url);
});



function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

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
