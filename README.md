chat
====

A simple chat application developed using Node.js (nodejs.org), express framework (expressjs.com) and socket.io (socket.io).

This app has unit test cases on basic server functions using unit.js that can be run by Mocha (unitjs.com).  Its logging uses winston (https://github.com/winstonjs/winston).

What does this simple chat app do:
  - each chat server hosts one chat group at "http://[server_root_URL]/chat"
  - connect as a new client in a new tab or browser window
  - set a new user name from a connected client to join the group chat
  - a user can send messages to the group
  - a user can send private messages to another user
  - disconnect a client by closing the browser tab or window
 
What does this simple chat app NOT do:
  - can not host multiple chat groups from a server
  - can not send message among different groups/servers
  - once a user name is set, it can not be changed from the same client
  - does not refresh client status automatically when server stops. Messaging simply stops function.
  - existing clients does not reconnect to server automatically when server restarts (must reload client to create a new connection or start a new client).
  - senders of private messages do not see the messages themselves, only receivers do.


SOURCE CODE

1. To get the source code of this application, either clone the GitHub repo "https://github.com/biancajiang/chat.git", or got to https://github.com/biancajiang/chat to download everything as a zip directly.
2. This application was forked from https://github.com/vijayannadi/chat, with updates and improvements, added unit tests and logging.
3. Main files: 
  - Server: app.js
  - Client: public/javascripts/chat.js
  - UI: views/chat.jade 
  - unit test: test/chatTest.js


DEPLOY

This application has been deployed on IBM Bluemix and can be accessed from: 

  http://bianca-node-chat.mybluemix.net/chat
  
To deploy this chat application on IBM Bluemix as a new application:

1. From bluemix.net catalog, select "SDK for Node.js runtime from IBM". 
2. Create a new Node.js application on bluemix by giving it an app name "node-chat", and a host name <prefix>-node-chat.
3. Install Cloud Foundry Command Line from https://www.ng.bluemix.net/docs/#starters/install_cli.html 
4. Open a terminal window, login to bluemix (apply for free trial bluemix account from: https://bluemix.net/):
  
      $ cf login -a api.ng.bluemix.net
5. Deploy the application to Bluemix using the Cloud Foundry CLI by running the following command:
  
      $ cf push node-chat -c "node app.js"

After about 30 seconds your own node-chat app should be deployed to Bluemix. The chat application wll be:

      http://<prefix>-node-chat.mybluemix.net/chat


UNIT TESTS

  Three server unit tests are available from /test/chatTest.js, using unit.js framework:

    1) server broadcasts to all users when a new user is added
    2) serer broadcasts group message to all
    3) server sends private message from one user to another
  
  To run the tests:
  
    1) load the source as decribed in "SOURCE CODE" section above
    2) go to the root directory directory where the source is loaded
    3) run "npm install"
    4) start a local server by running "node app.js"
    5) from a new terminal window, run "mocha -R spec" from the source root directory
  
  You should see the three test cases run with results.


LOGGING

This app uses winston (https://github.com/winstonjs/winston) for logging.  

Server app.js produces four kinds of logging: debug, info, warn and error. 

The default logging level is "info". 

Change the logging level by passing in one of "debug", "info", "warn" and "error" when start the server.  e.g.: from the root directory of the source, start the server by running:

      $ node app.js debug
   
Logging outputs to both the console and file chat.log under the source root directory.


TODO:
- encription (optional)
