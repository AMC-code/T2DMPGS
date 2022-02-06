const http = require("http");
var session = {
    version:"1.1",
    limit:false,
    players:[

    ]
}
var worldSpawnPoint = {x:0,y:0}
var map = [];
const WebSocketServer = require("websocket").server;
// var clients = {};
var sids = [];
var clients = [];
const httpServer = http.createServer()
const ws = new WebSocketServer({"httpServer":httpServer});
function getTime(){
    var date = new Date();
    var sec = date.getSeconds();
    if(date.getSeconds() < 10){
        sec = "0"+sec;
    }
    if(date.getHours() > 12){
        return (date.getHours() - 12)+":"+date.getMinutes()+":"+sec+" pm";
    }
    return date.getHours()+":"+date.getMinutes()+" am";
}
function genSid(){
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var credential = "";
    for(var i=0; i<32;i++){
        genNum = Math.floor(Math.random() * ((9 + letters.length) - 0) + 0);
        if(genNum > 9){
            credential += letters[genNum - 9];
        } else {
            credential += genNum;
        }
    }
    if(clients.length <= 0){
        return credential;
    }
    for(var i=0; i<clients.length;i++){
        if(credential == clients[i].sid){
            return genSid();
        } else {
            return credential;
        }
    }
}
function reGenSid(){
    for(var i=0;i<clients.length;i++){
        clients[i].prevSid = clients[i].sid;
        clients[i].sid = genSid();
    }
}
ws.on("request", req => {
    var instance = req.accept(null, req.origin);
    instance.on("message", (e) => {
        var data = e.utf8Data.split("|");
        if(data[0] == "->"){
            for(var i=0;i<clients.length;i++){
                if(data[data.length-1] == clients[i].sid || data[data.length-1] == clients[i].prevSid){
                    clients[sids[i]].sessionTimeout = 5;
                }
            }
        }
    });
    clients.push({prevSid:"",sid:genSid(),timeout:5});
    console.log("User Connected - "+getTime());
});
function sessionTimeout(){
    var players2 = [];
    var clients2 = [];
    if(clients.length > 0){
        var push = false;
        for(var i=0;i<clients.length;i++){
            clients[i].timeout -= 1;
            if(clients[sids[i]].sessionTimeout <= 3){
                clients[sids[i]].connection.send(JSON.stringify({type:"->"}));
            }
            if(clients[sids[i]].sessionTimeout > 0){
                clients2[sids[i]] = clients[sids[i]];
                // for(var l=0;l<session.players.length;l++){
                //     if(session.players[l].id == sids[i]){
                //         players2.push(session.players[l]);
                //     }
                // }
                // sids2.push(sids[i]);
            } else {
                console.log("Player Disconnected");
                push = true;
            }
        }
        if(push){
            sids = sids2;
            session.players = players2;
            clients = clients2;
        }
    }
}
setInterval(reGenSid,10000);
const PORT = 5002;
httpServer.listen(PORT, "127.0.0.1", () => console.log(`Server is on port : ${PORT}`));