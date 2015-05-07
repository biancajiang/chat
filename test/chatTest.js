var test = require('unit.js');
var io = require('socket.io-client');
var server = require('../app');

var socketURL = 'http://localhost:3000';
var options = {
	transports: ['websocket'],
	'force new connection': true
};
var user1 = 'Andy';
var user2 = 'Ben';
var user3 = 'Clare';

describe('Bianca chat server', function() {
	it('can broadcast new user to all when added.', function(done){
		var client1 = io.connect(socketURL);
		
		client1.on('connect', function(data) {
			console.log('client1 is connected!' + data);
			client1.emit('set username', user1);
			
			
		});
		client1.on('userJoined', function(user){
			console.log(user['userName'] + ' has joined from client1!');
			test.string(user['userName'])
				.is(user2);
			client1.disconnect();
			done();
		}); 
		
		var client2 = io.connect(socketURL, options);
			client2.on('connect', function(data){
				console.log('client2 is connected!');
				client2.emit('set username', user2);
			});	
			client2.on('userJoined', function(user){
				console.log(user['userName'] + ' has joined from client2!');
				test.string(user['userName'])
					.is(user2);
				client2.disconnect();
			});			
	});
	
	it('can broadcast new message to All', function(done){
		var client1, client2, client3;
		var message = 'Hello World';
		var messages = 0;

		var checkMessage = function(client){
		  client.on('message', function(msg){
			console.log(msg.target + " received: "+msg.message + " from " + msg.source);
			test.string(msg.message).is(message);
			client.disconnect();
			messages++;
			if(messages === 3){
			  done();
			};
		  });
		};

		client1 = io.connect(socketURL, options);
		checkMessage(client1);

		client1.on('connect', function(data){
		  client2 = io.connect(socketURL, options);
		  checkMessage(client2);

		  client2.on('connect', function(data){
			client3 = io.connect(socketURL, options);
			checkMessage(client3);

			client3.on('connect', function(data){
			  client2.emit('message', {
				  'target': 'All',
				  'message': message,
				  'source': user2
			  });
			});
		  });
		});
	});
	
	it('can send private message from one user to another.', function(done){
		var client1, client2, client3;
		var message = {target: user1, source: user3, message:'Private Hello World'};
		var messages = 0;

		var completeTest = function(){
		  test.number(messages).is(1);
		  client1.disconnect();
		  client2.disconnect();
		  client3.disconnect();
		  done();
		};

		var checkPrivateMessage = function(client){
		  client.on('message', function(msg){
			console.log(msg.target + " received from " + msg.source + ": " + msg.message);
			test.string(msg.message).is(message.message);
			test.string(msg.source).is(user3);
			test.string(msg.target).is(user1);
			messages++;
			if(client === client1){
			  /* The first client has received the message
			  we give some time to ensure that the others
			  will not receive the same message. */
			  test.wait(40, completeTest);
			};
		  });
		};

		client1 = io.connect(socketURL, options);
		checkPrivateMessage(client1);

		client1.on('connect', function(data){
			console.log("client1 connected!");
		  client1.emit('set username', user1);
		  client2 = io.connect(socketURL, options);
		  checkPrivateMessage(client2);

		  client2.on('connect', function(data){
			  console.log("client2 connected!");
			client2.emit('set username', user2);
			client3 = io.connect(socketURL, options);
			checkPrivateMessage(client3);

			client3.on('connect', function(data){
				console.log("client3 connected!");
			  client3.emit('set username', user3);
			  client3.emit('message', message)
			});
		  });
		});
	});
	
	
});