var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 4000);
app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
var requests = require('./requests');

io.sockets.on('connection', function (socket) {

    socket.on('disconnect', requests.stop);
    socket.on('start', requests.start);
    socket.on('stop', requests.stop);

    requests.on('result', function (result) {
       socket.emit('result', result); 
    });
});
