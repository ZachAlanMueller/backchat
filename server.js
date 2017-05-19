var app = require('http').createServer(handler)
// var io = require('socket.io')(app);
var fs = require('fs');

server = app.listen(3000);
var io = require('socket.io').listen(server);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);

  });
}

io.on('connection', function (socket) {
  socket.emit('update', { datatype: 'action to take' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('test-channel', function (data) {
    console.log(data);
    io.emit('test-channel', data);
  });
});

