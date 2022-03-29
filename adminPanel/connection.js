const ws = new WebSocket("ws://localhost:5001");
// const ws = new WebSocket("wss://server.tivect.com");
var sid = "";
var getData = setInterval(function(){
    if(sid != ""){
        ws.send(`joinsession|${sid}`);
        clearInterval(getData);
    }
},100);
ws.onmessage = function (e) {
    var res = JSON.parse(e.data);
    if(res.type == "--") {
        ws.send(`--|${sid}`);
    }
    if(res.type == "block"){
        var prevBlock = map[res.sBlock.y][res.sBlock.x];
        block(res.sBlock.y,res.sBlock.x,res.sBlock.bId);
        if(activeEnBlock(res.sBlock.bId) != 0 && activeEnBlock(prevBlock[0]) == 1){
            energyRemoveT(res.sBlock.x,res.sBlock.y,res.sBlock.bId,prevBlock[2]);
        }
        if(activeEnBlock(res.sBlock.bId) != -1){
            energyPlace(res.sBlock.x,res.sBlock.y,res.sBlock.bId);
        }
        reLoadCanv();
    }
    if(res.type == "map"){
        map = res.map;
        reLoadCanv();
        multiplayer = true;
    }
    if(res.type == "sid"){
        sid = res.sid;
    }
}