var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var url = require('url');

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(null, UIDGenerator.BASE36, 8);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/index.html');
});

app.get('/send', function(req, res){
  var room=uidgen.generateSync();
  res.redirect("/send/"+room);
});

app.get('/send/*', function(req, res){
  res.sendFile(__dirname + '/templates/send.html');
});

app.get('/receive', function(req, res){
  res.redirect("/");
});

app.get('/receive/*', function(req, res){
  res.sendFile(__dirname + '/templates/receive.html');
});

io.on('connection', function(socket){
  socket.on('room', function(room){
    if (socket.room)
        socket.leave(socket.room);

    socket.room = room;

    var msg=getmsg(room);
    if (msg) {
      socket.emit('phonenumber', msg);
    }
    
    console.log("Joining room "+room);
    socket.join(room);
  });
  
  socket.on('phonenumber', function(phonenumber){
    if (socket.room) {
      addmsg(socket.room, phonenumber);
      io.sockets.to(socket.room).emit('phonenumber', phonenumber);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


var msgbuf = {}
var max_age = 5*60*1000; // 5 minutes

var addmsg = function(room, msg) {
    msgbuf[room]={
      msg: msg,
      timestamp: Date.now()
    };
}

var getmsg = function(room) {
    if (msgbuf.hasOwnProperty(room)){
      return msgbuf[room].msg;
    }
    else {
      return null;
    }
}

var cleanmsg = function() {
  var timestamp=Date.now()-max_age; //15 seconds
  for (var room in msgbuf) {
    if (msgbuf.hasOwnProperty(room)) {
      {
        if (msgbuf[room].timestamp<timestamp) {
          console.log("Removing "+ room);
          delete msgbuf[room];
        }
      }
    }
  }
}

setInterval(cleanmsg, max_age);

