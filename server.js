var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var mysql = require('mysql');
var env = require('node-env-file');
env(__dirname + '/.env');
//console.log(process.env.test);


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : process.env.db_user,
  password : process.env.db_password,
  database : 'backchat'
});

// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
 
// connection.end();

io.origins('*:*');
app.listen(3000);

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
  socket.emit('news', { hello: 'world' });
  console.log('Client connected...')
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('testing', function (data) {
    console.log(data);
  io.emit('testing', data);
  });
});

function getMessages(){

}
