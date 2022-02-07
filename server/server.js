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
    for(var i=0; i<16;i++){
        genNum = Math.floor(Math.random() * ((9 + letters.length) - 0) + 0);
        if(genNum > 9){
            credential += letters[genNum - 9];
        } else {
            credential += genNum;
        }
    }
    for(var i=0; i<sids.length;i++){
        if(credential == sids[i][0] || credential == sids[i][1]){
            return genSid();
        }
    }
    return credential;
}
function reGenSid(){
    clients2 = {};
    for(var i=0;i<sids.length;i++){
        var newSid = genSid();
        clients[sids[i][0]].prevSid = clients[sids[i][0]].sid;
        clients[sids[i][0]].sid = newSid;
        clients2[newSid] = clients[sids[i][0]];
        sids[i][1] = sids[i][0];
        sids[i][0] = newSid;
        // console.log(sids[i][1]+" -> "+newSid)
    }
    clients = clients2;
}
ws.on("request", req => {
    var instance = req.accept(null, req.origin);
    instance.on("message", (e) => {
        var data = e.utf8Data.split("|");
        for(var i=0;i<sids.length;i++){
            if(sids[i][0] == data[data.length-1] || sids[i][1] == data[data.length-1]){
                if(data[0] == "joinsession"){
                    if(session.players.length < session.limit || session.limit == false){
                        session.players.push({id:sids[i],pr:0,pl:0,pt:0,pb:0,pxv:0,pyv:0,pw:false,ps:false,pa:false,pd:false,pspace:false,piw:false,pil:false,jmp:false,select:0,clickAction:0,color:0});
                        sendMap(sids[i][0]);
                        sendWorldSpawn(sids[i][0]);
                    } else {
                        clients[sids[i][0]].instance.send(JSON.stringify({type:"fullServer",message:"Server Full"}));
                    }
                }
                if(data[0] == "->"){
                    clients[sids[i][0]].timeout = 5;
                }
            }
        }
    });
    var newSid = genSid()
    sids.push([newSid,""]);
    clients[newSid] = {instance:instance,prevSid:"",sid:genSid(),inGame:false,timeout:5};
    console.log("User Connected - "+newSid+" - "+getTime());
});
function sessionTimeout(){
    var sids2 = [];
    var players2 = [];
    var clients2 = {};
    if(sids.length > 0){
        var push = false;
        for(var i=0;i<sids.length;i++){
            clients[sids[i][0]].timeout -= 1;
            if(clients[sids[i][0]].timeout <= 3){
                clients[sids[i][0]].instance.send(JSON.stringify({type:"->"}));
            }
            if(clients[sids[i][0]].timeout > 0){
                clients2[sids[i][0]] = clients[sids[i][0]];
                for(var l=0;l<session.players.length;l++){
                    if(session.players[l].id == sids[i]){
                        players2.push(session.players[l]);
                    }
                }
                sids2.push(sids[i]);
            } else {
                // console.log("Player Disconnected");
                push = true;
            }
        }
        if(push){
            sids = sids2;
            session.players = players2;
            clients = clients2;
        }
    }
    console.log(sids.length);
}
setInterval(sessionTimeout,1000);
// setInterval(reGenSid,60000);
const PORT = 5002;
httpServer.listen(PORT, "127.0.0.1", () => console.log(`Server is on port : ${PORT}`));