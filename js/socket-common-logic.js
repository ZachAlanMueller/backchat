
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000');

socket.on('message', function(data){
	console.log(data);
});

socket.on('connect', function (user) {
  console.log('Client connected...');
  socket.emit('testing', {username: $('#username').val(), msg: 'hello there friend'});
});

socket.on('notification', function(data){
	toastr[data['type']](data['message'], data['title']);
});

socket.on('action', function(data){
	if(data['type'] == 'redirect'){
		window.location.href = "./" + data['location'];
	}
});

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}