
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , chat = require('./routes/chat')
  , socketio = require('socket.io')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/chat', chat.main);
app.get('/users', user.list);

//var server = app.listen(app.get('port'), function(){
//  console.log("Express server is listening on port " + app.get('port'));
//});

//var io = socketio.listen(server);
http = http.Server(app);
var io = socketio(http);
http.listen(3000, function(){
  console.log("Express server is listening on port " + 3000);
});

var clients = {};
var socketsOfClients = {};

io.on('connection', function(socket) {
	console.log("new user connected.");
	io.emit('connect');
  socket.on('set username', function(userName) {
	console.log("setting user: " + userName);
    // Is this an existing user name?
    if (clients[userName] === undefined) {
      // Does not exist ... so, proceed
      clients[userName] = socket;
      socketsOfClients[socket.id] = userName;
      userNameAvailable(socket.id, userName);
	  userJoined(userName);
    } else
    if (clients[userName] === socket) {
      // Ignore for now
    } else {
      userNameAlreadyInUse(socket.id, userName);
    }
  });

  socket.on('message', function(msg) {
    var srcUser;
    if (msg.inferSrcUser) {
      // Infer user name based on the socket id
      srcUser = socketsOfClients[socket.id];
    } else {
      srcUser = msg.source;
    }
    if (msg.target == "All") {
      // broadcast
      io.emit('message',
          {"source": srcUser,
           "message": msg.message,
           "target": msg.target});
    } else {
      // Look up the socket id
      clients[msg.target].emit('message', 
          {"source": srcUser,
           "message": msg.message,
           "target": msg.target});
    }
  })

  socket.on('disconnect', function() {
	  var uName = socketsOfClients[socket.id];
	  delete socketsOfClients[socket.id];
    delete clients[uName];
	// relay this message to all the clients
	userLeft(uName);
  })
});

function userJoined(uName) {
	Object.keys(socketsOfClients).forEach(function(sId) {
		io.emit('userJoined', { "userName": uName });
	})
};

function userLeft(uName) {
    io.emit('userLeft', { "userName": uName });
};

function userNameAvailable(sId, uName) {
  setTimeout(function() {
    console.log('Sending welcome msg to ' + uName + ' at ' + sId);
	
    io.emit('welcome', { "userName" : uName, "currentUsers": JSON.stringify(Object.keys(clients)) });
  }, 500);
};

function userNameAlreadyInUse(sId, uName) {
  setTimeout(function() {
    io.emit('error', { "userNameInUse" : true });
  }, 500);
}
