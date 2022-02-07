const http = require("http");
var session = {
    version:"1.7",
    limit:false,
    players:[

    ]
}
var worldSpawnPoint = {x:0,y:0}
var map = [];
//
//
//
function worldGeneration(){
    var wMap = [];
    var biomes = [1,1,1,1,1,0,1,1,2,1,1];
    var maxBiomes = 2;
    var yWaterLevel = 35;
    var curY = 80 - yWaterLevel - 2;
    var mainY = 35;
    for(var i=0;i<80;i++){
        wMap.push([])
    }
    for(var i=0;i<biomes.length;i++){
        var fallFor = 0;
        var flatFor = 0;
        var riseFor = 0;
        var loopFor = 0;
        var rise = false;
        var fall = false;
        var flat = false;
        var biome = biomes[i];
        if(biome == 0){
            mainY = 80-11;
            if(curY <= 80-11){
                fallFor = (80-11) - curY;
                fall = true;
            } else {
                flat = true;
            }
            riseFor = 0;
            flatFor = Math.floor(Math.random() * (12 - 6 + 1) + 6);
            loopFor = fallFor+flatFor+riseFor;
        } else if(biome == 1){
            mainY = 35;
            if(curY > mainY-2){
                riseFor = curY - (mainY-2);
                rise = true;
            } else if (curY < mainY+2){
                fallFor = (mainY+2) - curY;
                fall = true;
            } else {
                flat = true;
            }
            flatFor = Math.floor(Math.random() * (15 - 6 + 1) + 6);
            loopFor = fallFor+flatFor+riseFor;
        } else if(biome == 2){
            mainY = Math.floor(Math.random() * (16 - 7 + 1) + 7);
            if(curY > mainY){
                rise = true;
                riseFor = curY - mainY;
            }
            fallFor = 80 - yWaterLevel + mainY;
            loopFor = fallFor+riseFor+flatFor;
        }
        for(var l=0;l<loopFor;l++){
        var minLength = 0;
        var maxLength = 0;
        if(curY == mainY && biome == 1){
            fall = false;
            rise = false;
            flat = true;
        } else if(curY <= mainY){
            fall = true;
            rise = false;
            flat = false;
        }
        if(fall){
            var fallY = Math.floor(Math.random() * (1 - 1 + 1) + 1);
            if(biome == 0){
                if((curY+fallY)<=80-11){
                    curY += fallY;
                    minLength = 1;
                    maxLength = 4;
                } else if ((curY+fallY)>=80-11){
                    mainY = 80-11;
                    fall = false;
                    flat = true;
                }
            } else if(biome == 2){
                minLength = 0;
                maxLength = 2;
            }
        } else if(flat){
            var plainY = Math.floor(Math.random() * (1 - -1 + 1) + -1);
            if((curY+plainY) > mainY-2 && (curY+plainY) < mainY+2){
                curY += plainY;
            }
            
            minLength = 6;
            maxLength = 9;
        } else if(rise){
            var riseY = Math.floor(Math.random() * (-1 - -1 + 1) + -1);
            curY += riseY;
            if(biome == 2 && curY <= yWaterLevel){
                minLength = 0;
                maxLength = 2;
            } else {
                minLength = 1;
                maxLength = 4;
            }
        }
            var distance = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);
            if(biome == 2 && Math.floor(Math.random() * (1 - 0 + 1) + 0) == 0){
                if(Math.floor(Math.random() * (1 - 0 + 1) + 0) == 1){
                    distance = 0;
                }
            }
                for(var ji=0;ji<distance;ji++){
                    for(var j=0;j<wMap.length;j++){
                        if(j<curY){
                            wMap[j].push([0,false]);
                        } else if (j == curY){
                            wMap[j].push([1,3]);
                        } else if(j > curY && j < curY+5){
                            wMap[j].push([4,3]);
                        } else if(j >= curY+5){
                            wMap[j].push([5,8]);
                        }
                    }
                }
            }
    }
    for(var i=(80 - yWaterLevel);i<wMap.length;i++){
        for(var l=0;l<wMap[i].length;l++){
            if(wMap[i][l][0] == 0){
                wMap[i][l] = [13,false]
            } else if(wMap[i][l][0] == 1){
                wMap[i][l] = [20,3]
                wMap[i+1][l] = [20,3]
                wMap[i-1][l] = [20,3]
            }
        }
    }
    // console.log(wMap)
    var biomeLength = Math.floor((wMap[0].length-1)/biomes.length);
    var biomeSpawn = Math.random() * (biomes.length - 1) + 1;
    var xSpawnMax = biomeLength * biomeSpawn;
    var xSpawnMin = biomeLength * (biomeSpawn-1);
    var xSpawnPoint = Math.round(Math.random() * ((xSpawnMax-1) - xSpawnMin) + xSpawnMin);
    var ySpawnPoint = 0;
    for(var i=wMap.length-1;i>0;i--){
        if((wMap[i][xSpawnPoint][0] != 0 && wMap[i][xSpawnPoint][0] != 13) && wMap[i-1][xSpawnPoint][0] == 0 && wMap[i-2][xSpawnPoint][0] == 0){
            ySpawnPoint = wMap.length - i;
            break;
        }
    }
    worldSpawnPoint.x = (xSpawnPoint*36)+1;
    worldSpawnPoint.y = (ySpawnPoint*36)+1;
    map = wMap;
}
function checkOverlaps(t1, r1, b1, l1, t2, r2, b2, l2) {
    var olx = false;
    var oly = false;
    var yCenter = (t2 + b2) / 2;
    var xCenter = (l2 + r2) / 2;
    if (l1 <= l2 && l2 <= r1) {
        olx = true;
    };
    if (l1 <= r2 && r2 <= r1) {
        olx = true;
    };
    if (t1 >= t2 && t2 >= b1) {
        oly = true;
    };
    if (t1 >= b2 && b2 >= b1) {
        oly = true;
    };
    if (l1 <= xCenter && xCenter <= r1) {
        olx = true;
    };
    if (b1 <= yCenter && yCenter <= t1) {
        oly = true;
    };
    return olx && oly;
};
function overlap(i, j, l, t, r, b) {
    var bt = 36 * (map.length - i);
    var bl = j * 36;
    var bb = bt - 36;
    var br = bl + 36;
    return checkOverlaps(t, r, b, l, bt, br, bb, bl);
};
function isSolid(val) {
    if (val != 0 && val != 9 && val != 10 && val != 11 && val != 13 && val != 14 && val != 17 && val != 19 && val != 29 && val != 36) {
        return true;
    }
    return false;
};
//
//
//
worldGeneration();
const WebSocketServer = require("websocket").server;
var sids = [];
var clients = {};
const httpServer = http.createServer()
const ws = new WebSocketServer({"httpServer":httpServer});
function getTime(){
    var date = new Date();
    var sec = date.getSeconds();
    var min = date.getMinutes();
    if(date.getMinutes() < 10){
        min = "0"+min;
    }
    if(date.getSeconds() < 10){
        sec = "0"+sec;
    }
    if(date.getHours() > 12){
        return (date.getHours() - 12)+":"+min+":"+sec+" pm";
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
    for(var i=0;i<sids.length;i++){
        sendSid(sids[i][0]);
    }
}
function block(y,x,num) {
    var dBlocks = [[0,false],[1,3],[2,5],[3,8],[4,3],[5,8],[6,8],[7,3],[8,7],[9,5],[10,3],[11,8],[12,8],[13,false],[14,8],[15,4],[16,5],[17,false],[18,32],[19,false],[20,3],[21,12],[22,10],[23,10],[24,10],[25,10],[26,9],[27,9],[28,9],[29,2],[30,7],[31,7],[32,7,500],[33,7],[34,7,0],[35,7,0],[36,2],[37,12,{type:"storage",mouseX:0,mouseY:0,row:0,highlighted:0,inventory:[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],}]];
    if(y > map.length-1 || y < 0 || x > map[0].length-1 || x < 0 || num > dBlocks.length-1 || num < 0){
        console.log("Attempted block placement at invalid position and/or invalid block type");
        return;
    }
    map[y][x] = dBlocks[num];
}
function parseBool(b){
    return b == "true";
}
ws.on("request", req => {
    var instance = req.accept(null, req.origin);
    instance.on("message", (e) => {
        var data = e.utf8Data.split("|");
        for(var i=0;i<sids.length;i++){
            if(sids[i][0] == data[data.length-1] || sids[i][1] == data[data.length-1]){
                if(data[0] == "position"){
                    for(var i=0;i<session.players.length;i++){
                        if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                            session.players[i].pl = parseFloat(data[1]);
                            session.players[i].pr = parseFloat(data[2]);
                            session.players[i].pt = parseFloat(data[3]);
                            session.players[i].pb = parseFloat(data[4]);
                            session.players[i].pw = parseBool(data[5]);
                            session.players[i].ps = parseBool(data[6]);
                            session.players[i].pa = parseBool(data[7]);
                            session.players[i].pd = parseBool(data[8]);
                            session.players[i].pspace = parseBool(data[9]);
                            session.players[i].piw = parseBool(data[10]);
                            session.players[i].pil = parseBool(data[11]);
                            session.players[i].jmp = parseBool(data[12]);
                            session.players[i].pxv = parseFloat(data[13]);
                            session.players[i].pyv = parseFloat(data[14]);
                            session.players[i].select = parseFloat(data[15]);
                            session.players[i].clickAction = parseFloat(data[16]);
                            session.players[i].color = parseFloat(data[17]);
                            clients[session.players[i].id[0]].timeout = 5;
                        }
                    }
                }
                if(data[0] == "build"){
                    for(var i=0;i<session.players.length;i++){
                        if(data[data.length-1] == session.players[i].id[0] || data[data.length-1] == session.players[i].id[1]){
                            if(!PIB(data[1],data[2]) || !isSolid(data[3])){
                                block(data[1],[data[2]],data[3]);
                                updateBlock(data[1],data[2],data[3]);
                            } else {
                                undoBlock(session.players[i].id[0],data[1],data[2]);
                            }
                        }
                    }
                }
                if(data[0] == "joinsession"){
                    if(session.players.length < session.limit || session.limit == false){
                        clients[sids[i][0]].inGame = true;
                        session.players.push({id:sids[i],pr:0,pl:0,pt:0,pb:0,pxv:0,pyv:0,pw:false,ps:false,pa:false,pd:false,pspace:false,piw:false,pil:false,jmp:false,select:0,clickAction:0,color:0});
                        sendMap(sids[i][0]);
                        sendWorldSpawn(sids[i][0]);
                        console.log("User Join Game - "+clients[sids[i][0]].inSid+" - "+getTime());
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
    var newSid = genSid();
    sids.push([newSid,""]);
    clients[newSid] = {instance:instance,inSid:newSid,prevSid:"",sid:newSid,inGame:false,timeout:5};
    sendSid(newSid);
    console.log("User Connect - "+newSid+" - "+getTime());
});
function sendSid(sid){
    clients[sid].instance.send(JSON.stringify({type:"sid",sid:sid}));
}
function sendWorldSpawn(sid){
    clients[sid].instance.send(JSON.stringify({type:"worldSpawn",worldSpawnPoint:worldSpawnPoint}));
}
function sendMap(sid){
    clients[sid].instance.send(JSON.stringify({type:"map",map:map}));
}
function undoBlock(id,y,x){
    clients[id].instance.send(JSON.stringify({type:"block",sBlock:{x:x,y:y,bId:map[y][x][0]}}));
}
function PIB(y,x){
    for(var i=0;i<session.players.length;i++){
        if(overlap(y,x,session.players[i].pl,session.players[i].pt,session.players[i].pr,session.players[i].pb)){
            return true;
        }
    }
    return false;
}
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
                    if(session.players[l].id[0] == sids[i][0] || session.players[l].id[1] == sids[i][0]){
                        players2.push(session.players[l]);
                    }
                }
                sids2.push(sids[i]);
            } else {
                console.log("User Disconnect - "+clients[sids[i][0]].inSid+" - "+getTime());
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
function filter(id){
    var sendData = [];
    for(var i=0;i<session.players.length;i++){
        if(session.players[i].id[0] != id && session.players[i].id[1] != id){
            sendData.push({pl:session.players[i].pl,pr:session.players[i].pr,pt:session.players[i].pt,pb:session.players[i].pb,pw:session.players[i].pw,ps:session.players[i].ps,pa:session.players[i].pa,pd:session.players[i].pd,pspace:session.players[i].pspace,pxv:session.players[i].pxv,pyv:session.players[i].pyv,piw:session.players[i].piw,pil:session.players[i].pil,jmp:session.players[i].jmp,select:session.players[i].select,clickAction:session.players[i].clickAction,color:session.players[i].color});
        }
    }
    return sendData;
}
function updateBlock(y,x,bId){
    if(session.players.length > 0){
        for(var i=0;i<session.players.length;i++){
            clients[session.players[i].id[0]].instance.send(JSON.stringify({type:"block",sBlock:{x:x,y:y,bId:bId}}));
        }
    }
}
function updateGame(){
    if(session.players.length > 0){
        for(var i=0;i<session.players.length;i++){
            clients[session.players[i].id[0]].instance.send(JSON.stringify({type:"position",players:filter(session.players[i].id[0])}));
        }
    }
}
setInterval(updateGame, 1000/10);
setInterval(sessionTimeout,1000);
setInterval(reGenSid,6000);
const PORT = 5001;
httpServer.listen(PORT, "127.0.0.1", () => console.log(`Server is open on port : ${PORT}`));