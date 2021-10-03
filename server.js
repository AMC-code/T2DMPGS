const http = require("http");
var session = {
    version:"0.2",
    limit:null,
    players:[

    ]
}
const WebSocketServer = require("websocket").server;
var clients = {};
var sids = [];
const httpServer = http.createServer()
const websocket = new WebSocketServer({
    "httpServer":httpServer
})
function createCredential(){
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
    if(session.players.length <= 0){
        return credential;
    }
    for(var i=0; i<session.players.length;i++){
        if(credential == session.players[i].id){
            createCredential();
        } else {
            return credential;
        }
    }
}
function parseBool(b){
    return b == "true";
}
websocket.on("request", request => {
    var connection = request.accept(null, request.origin);
    connection.on("message", (e) => {
        var data = e.utf8Data;
        var fdata = data.split("|");
        if(fdata[0] == "position"){
            for(var i=0;i<session.players.length;i++){
                if(fdata[fdata.length-1] == session.players[i].id){
                    session.players[i].pl = parseFloat(fdata[1]);
                    session.players[i].pr = parseFloat(fdata[2]);
                    session.players[i].pt = parseFloat(fdata[3]);
                    session.players[i].pb = parseFloat(fdata[4]);
                    session.players[i].pw = parseBool(fdata[5]);
                    session.players[i].ps = parseBool(fdata[6]);
                    session.players[i].pa = parseBool(fdata[7]);
                    session.players[i].pd = parseBool(fdata[8]);
                    session.players[i].pspace = parseBool(fdata[9]);
                    session.players[i].piw = parseBool(fdata[10]);
                    session.players[i].pil = parseBool(fdata[11]);
                    session.players[i].jmp = parseBool(fdata[12]);
                    session.players[i].pxv = parseFloat(fdata[13]);
                    session.players[i].pyv = parseFloat(fdata[14]);
                    session.players[i].health = parseInt(fdata[15]);
                    clients[session.players[i].id].sessiontimeout = 5;
                }
            }
        }
    });
    var sid = createCredential();
    clients[sid] = {"connection": connection,"sessiontimeout":5};
    sids.push(sid);
    session.players.push({id:sid,pr:466,pl:432,pt:934,pb:865,pxv:0,pyv:0,pw:false,ps:false,pa:false,pd:false,pspace:false,piw:false,pil:false,jmp:false,health:50});
    connection.send(JSON.stringify({type:"connect",sid:sid}));
});
function filter(id){
    var sendData = [];
    for(var i=0;i<session.players.length;i++){
        if(session.players[i].id != id){
            sendData.push({pl:session.players[i].pl,pr:session.players[i].pr,pt:session.players[i].pt,pb:session.players[i].pb,pw:session.players[i].pw,ps:session.players[i].ps,pa:session.players[i].pa,pd:session.players[i].pd,pspace:session.players[i].pspace,pxv:session.players[i].pxv,pyv:session.players[i].pyv,piw:session.players[i].piw,pil:session.players[i].pil,jmp:session.players[i].jmp,health:session.players[i].health});
        }
    }
    return sendData;
}
function sessiontimeout(){
    var sids2 = [];
    var players2 = [];
    var clients2 = [];
    if(sids.length > 0){
        var push = false;
        for(var i=0;i<sids.length;i++){
            clients[sids[i]].sessiontimeout -= 1;
            if(clients[sids[i]].sessiontimeout > 0){
                clients2[sids[i]] = clients[sids[i]];
                for(var l=0;l<session.players.length;l++){
                    if(session.players[l].id == sids[i]){
                        players2.push(session.players[l]);
                    }
                }
                sids2.push(sids[i]);
            } else {
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
function updateGame(){
    if(session.players.length > 0){
        for(var i=0;i<session.players.length;i++){
            clients[session.players[i].id].connection.send(JSON.stringify({type:"position",players:filter(session.players[i].id)}));
        }
    }
}
setInterval(sessiontimeout, 1000);
setInterval(updateGame, 1000/12);
const PORT = 5000;
httpServer.listen(PORT, () => console.log(`Server is on port : ${PORT}`));