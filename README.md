chat
====

A simple chat application developed using Node.js (nodejs.org), express framework (expressjs.com) and socket.io (socket.io).  
This app has unit test cases on basic server functions using unit.js that can be run by Mocha (unitjs.com).  Its logging uses winston (https://github.com/winstonjs/winston).

What does this simple chat app do:
  - one chat server hosts one chat group only at http://<server_root>/chat
  - connect as a new client in a new tab or browser window
  - set a new user name from a client to join group chat
  - a user can send messages to the group, as well as private messages to another user
  - disconnect a client by closing the browser tab or window
 
What does this simple chat app NOT do:
  - can not host multiple chat groups from a server
  - can not send message among different groups/servers
  - does not refresh client status automatically when server stops
  - existing clients does not reconnect to server when server restarts (must reload client to create a new connection or start a new client).
  - senders of private messages do not see the messages themselves, only receivers do.

SOURCE CODE

1. To get the source code of this application, clone the GitHub repo. 
  
      $ git clone https://github.com/biancajiang/chat.git
      
2. This application was forked from https://github.com/vijayannadi/chat, with updates and improvements.
3. Main files:

DEPLOY

This application has been deployed on IBM Bluemix and can be accessed from: 

  http://bianca-node-chat.mybluemix.net/chat
  
To deploy this chat application on IBM Bluemix:

  1) From bluemix.net catalog, select "SDK for Node.js runtime from IBM". 
  2) Create a new Node.js application on bluemix by giving it an app name "node-chat", and a host name <prefix>-node-chat.
  3) Install Cloud Foundry Command Line from https://www.ng.bluemix.net/docs/#starters/install_cli.html 
  4) Open a terminal window, login to bluemix (apply for free trial bluemix account from: https://bluemix.net/):
  
      $ cf login -a api.ng.bluemix.net
  5) Deploy the application to Bluemix using the Cloud Foundry CLI by running the following command:
  
      $ cf push node-chat -c "node app.js"

After about 30 seconds your node-chat app should be deployed to Bluemix. The chat application wll be:

      http://<prefix>-node-chat.mybluemix.net/chat

UNIT TESTS

  Three server unit tests are available from /test/chatTest.js, using unit.js framework:

    1) server broadcasts to all users when a new user is added
    2) serer broadcasts group message to all
    3) server sends private message from one user to another
  To run the tests:
  
    1) load the source as decribed above
    2) run "npm install"
    3) start a local server by running "node app.js"
    4) from a new terminal window, run "mocha -R spec"


TODO:
- logging
- error handling
- encription (optional)
- auto. deploy (chef?)
- documentation
