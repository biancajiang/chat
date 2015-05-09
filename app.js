
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , chat = require('./routes/chat')
  , socketio = require('socket.io')
  , http = require('http')
  , path = require('path')
  , logger = require('winston');

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

logger.add(logger.transports.File, { filename: 'chat.log'});
logger.level = (process.argv.slice(2) == "") ? 'info' : process.argv.slice(2);
logger.info("Logging level is set to " + logger.level);

//var server = app.listen(app.get('port'), function(){
//  logger.log("Express server is listening on port " + app.get('port'));
//});

//var io = socketio.listen(server);
http = http.Server(app);
var io = socketio(http);
http.listen(app.get('port'), function(){
  logger.info("Express server is listening on port " + app.get('port'));
});

var clients = {};
var socketsOfClients = {};

io.on('connection', function(socket) {
	logger.debug("new user connected from socket " + socket.id);
	io.emit('connect');
  socket.on('set username', function(userName) {
	if(userName === undefined) {
		logger.debug("unknown user detected, disconnecting.");
		socket.disconnect();
	}  
	else {
		logger.debug("setting user: " + userName);
		// Is this an existing user name?
		if (clients[userName] === undefined) {
		  logger.debug(userName + " does not exist, adding to chat.");
		  clients[userName] = socket;
		  socketsOfClients[socket.id] = userName;
		  userNameAvailable(socket.id, userName);
		  userJoined(userName);
		} else
		if (clients[userName].id === socket.id) {
		  logger.debug(userName + " is already in chat. Do nothing");
		} else {
		  logger.error(userName + " is not in chat. But this name is taken");
		  userNameAlreadyInUse(socket.id, userName);
		}
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
	
	//handle error condition
	if(srcUser == undefined) {
		socket.disconnect();
	}
	else {
		if (msg.target == "All") {      
		  logger.info("Broadcasting new message from " + srcUser);
		  io.emit('message',
			  {"source": srcUser,
			   "message": msg.message,
			   "target": msg.target});
		} else {      
		  logger.info("Sending private message from " + srcUser + " to " + msg.target);
		  clients[msg.target].emit('message', 
			  {"source": srcUser,
			   "message": msg.message,
			   "target": msg.target});
		}
	}
  });

  socket.on('disconnect', function() {
	var uName = socketsOfClients[socket.id];
	if(uName === undefined || uName === "")
		logger.warn("un-persisted user is now disconnected from socket " + socket.id);
	else	
	    logger.debug(uName + " is disconnected from socket " + socket.id);
	delete socketsOfClients[socket.id];
    delete clients[uName];
	// relay this message to all the clients
	userLeft(uName);
  })
});

function userJoined(uName) {
    logger.info(uName + "  joined chat.");
	Object.keys(socketsOfClients).forEach(function(sId) {
		io.emit('userJoined', { "userName": uName });
	})
};

function userLeft(uName) {
	if(uName == undefined)
		logger.warn("unknown user left chat.");
	else
		logger.info(uName + "  left chat.");
    io.emit('userLeft', { "userName": uName }); 
};

function userNameAvailable(sId, uName) {
  setTimeout(function() {
    logger.log('Welcome ' + uName + ' from socket ' + sId);
	
    io.emit('welcome', { "userName" : uName, "currentUsers": JSON.stringify(Object.keys(clients)) });
  }, 500);
};

function userNameAlreadyInUse(sId, uName) {
  setTimeout(function() {
    io.emit('error', { "userNameInUse" : true });
  }, 500);
}
