var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var mysql = require('mysql');
var env = require('node-env-file');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
env(__dirname + '/.env');
//console.log(process.env.test);


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : process.env.db_user,
  password : process.env.db_password,
  database : 'backchat'
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
  },
  function(username, password, done) {


    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) { return done(null, false); }
    //   if (!user.verifyPassword(password)) { return done(null, false); }
    //   return done(null, user);
    // });
  }
));

console.log('Server up. Ready to receive connections:\n');
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


  socket.on('registration', function(data){
    // console.log(socket.id);
    // io.to(socket.id).emit('message', 'for your eyes only');
    var email = data['email'];
    var pw = data['password'];
    var username = data['username'];
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    pw = bcrypt.hashSync(pw, salt);
    var username_id = Math.floor(Math.random()*(9999-1000+1)+1000);
    var flag = true;
    connection.query('SELECT username_id FROM users WHERE username = ?', [username], function (error, results, fields) {
      if(results.length == 0){
        //no other users with that username, initial randnumb is good
      }
      else{
        while(flag){
          for(var i = 0, len = results.length; i < len; i++){
            if(results[i].username_id == username_id){
              username_id = Math.floor(Math.random()*(9999-1000+1)+1000);
            }
            else{
              flag = false;
            }
          }
        }
      }
    });

    var userInfo = {username: username, email: email, password: pw, username_id: username_id};
    connection.query('INSERT INTO users SET ?', userInfo, function (error, results, fields) {
      if(error == null){
        //no errors!!! Return good notification and action
        io.to(socket.id).emit('notification', {type: 'success', message: 'Registration Successful!', title: ''});
        //setTimeout(function(){ alert("Hello"); }, 3000);
        setTimeout(function(){
          io.to(socket.id).emit('action', {type: 'redirect', location: 'lobby.html'});
        }, 2500);
      }
      else{
        console.log(error);
        console.log('==============================================')
        console.log(error.code);
        if(error.code == 'ER_DUP_ENTRY'){
          io.to(socket.id).emit('notification', {type: 'error', message: 'It looks like that email is already in use.', title: 'Uh Oh!'});
        }
        else{
          io.to(socket.id).emit('notification', {type: 'error', message: 'An Unknown Error Occured!', title: 'Uh Oh!'});
        }
      }
    });

    

  });
});


