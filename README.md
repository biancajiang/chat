chat
====

A simple chat application developed using Node.js and socket.io. 

This application has been deployed on IBM Bluemix: 

http://bianca-node-chat.mybluemix.net/chat

To get the source code of this application:
  1. Clone the GitHub repo. (install and setup Git client: https://help.github.com/articles/set-up-git/)
  
      $ git clone https://github.com/biancajiang/chat.git
  2. In the terminal window, change your directory to the directory containing the chat code
  
      $ cd git/chat
This application was originally from https://github.com/vijayannadi/chat, with updates and improvements.

To deploy this chat application on IBM Bluemix:
  1. From bluemix.net catalog, select "SDK for Node.js runtime from IBM". 
  2. Create a new Node.js application on bluemix by giving it an app name "node-chat", and a host name <prefix>-node-chat.
  3. Install Cloud Foundry Command Line from https://www.ng.bluemix.net/docs/#starters/install_cli.html 
  4. Open a terminal window, login to bluemix (apply for free trial bluemix account from: https://bluemix.net/):
  
      $ cf login -a api.ng.bluemix.net
  5. Deploy the application to Bluemix using the Cloud Foundry CLI by running the following command:
  
      $ cf push node-chat -c "node app.js"

After about 30 seconds your node-chat app should be deployed to Bluemix. The chat application wll be:

      http://<prefix>-node-chat.mybluemix.net/chat

TODO:
- unit tests
- logging
- error handling
- encription (optional)
- auto. deploy (chef?)
- documentation
