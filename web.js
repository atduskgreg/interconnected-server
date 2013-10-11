#!/usr/bin/env node

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 1337});


var clients = [];
var currentId = 0;

wss.on('connection', function(ws) {
    var clientId = ++currentId;
	console.log("socket connection");
    ws.clientId = clientId;
    clients.push(ws);

    ws.on('message', function(message) {
        var parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
 
        console.log("broadcasting to "+ clients.length + " clients");
        for(var i = 0; i< clients.length; i++){
            clients[i].send(JSON.stringify(parsedMessage));
        }
    });

    ws.on('close', function(){
        var indexToRemove = 0;
        var shouldRemoveClient = false

        for(var i = 0; i < clients.length; i++){
            console.log(clients[i].clientId);
            if(clients[i].clientId == clientId){
                indexToRemove = i;
                shouldRemoveClient = true;
            }
        }
        if(shouldRemoveClient){
            clients.splice(indexToRemove, 1);
        }
    });
});
