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
ws.on("request", req => {
    var instance = req.accept(null, req.origin);
    instance.on("message", (e) => {

    });
    var time = new Date();
    var precise = time.getHours()+":"+time.getMinutes();
    console.log("New User Joined - Time : "+precise);
});
const PORT = 5001;
httpServer.listen(PORT, "127.0.0.1", () => console.log(`Server is on port : ${PORT}`));