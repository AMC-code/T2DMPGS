var inspect = true;
var create = false;
var player = false;
var projectile = false;
var vehicle = false;
var logs = false;
var activated = 1;
var loadData = {
    saveFile:[]
}
function changeSize(amount){
    var change = !(size+amount <=0 || size+amount > 99)
    if(change){
        size += amount;
        reLoadCanv();
        document.getElementById("sizeVal").innerHTML = size;
    }
}
var enVals = [32,34,35,30,31,38,40,41,42,43];
function getEnergy(x,y){
    for(var i=0;i<enVals.length;i++){
        if(enVals[i] == map[y][x][0]){
            return map[y][x][2];
        }
    }
    return -1;
}
var dispVals = [37,40,41,42,43];
function getDisplay(x,y){
    for(var i=0;i<dispVals.length;i++){
        if(dispVals[i] == map[y][x][0]){
            if(map[y][x][map[y][x].length-1].type == "interface"){
                return ["interface",""+map[y][x][map[y][x].length-1].rows];
            } else if(map[y][x][map[y][x].length-1].type == "storage"){
                return ["storage",""+map[y][x][map[y][x].length-1].inventory];
            }
        }
    }
    return -1;
}
var usage = ["X  -  ","Y  -  ","Value  -  ","Type  -  ","Hit Points  -  ","Energy Value -  ","Menu Type  -  ","Menu Data  -  ",]
function displayBData(dataIn){
    var div = document.getElementById("dataOut")
    div.innerHTML = "";
    for(var i=0;i<dataIn.length;i++){
        var data = document.createElement("h1");
        data.className = "dataText";
        data.innerHTML = usage[i]+dataIn[i];
        div.appendChild(data);
    }
    var energy = getEnergy(dataIn[0],dataIn[1]);
    if(energy != -1){
        var data = document.createElement("h1");
        data.className = "dataText";
        data.innerHTML = usage[5]+energy;
        div.appendChild(data);
    }
    var display = getDisplay(dataIn[0],dataIn[1]);
    if(display != -1){
        var data = document.createElement("h1");
        data.className = "dataText";
        data.innerHTML = usage[6]+display[0];
        div.appendChild(data);
        var data1 = document.createElement("h1");
        data1.className = "dataText";
        data1.innerHTML = usage[7]+display[1];
        div.appendChild(data1);
    }
    blockSelect = dataIn[2];
    render2();
}
function genVehicle(){
    var ret = [];
    for(var i=0;i<200;i++){
        var add = [];
        for(var j=0;j<500;j++){
            add.push(0);
        }
        ret.push(add);
    }
    return ret;
}
var vals = {
    "1":function(){document.getElementById("blocks").style.display = "inline-block";document.getElementById("create").style.backgroundColor = "#c3c3c3";document.getElementById("dataOut").innerHTML="";blockSelect=0;render2();activated=1;},
}
function change(val){
    val = ""+val;
    document.getElementById("dataOut").style.display = "none";
    document.getElementById("blocks").style.display = "none";
    document.getElementById("inspect").style.backgroundColor = "#f0f0f0";
    document.getElementById("create").style.backgroundColor = "#f0f0f0";
    document.getElementById("player").style.backgroundColor = "#f0f0f0";
    document.getElementById("projectile").style.backgroundColor = "#f0f0f0";
    document.getElementById("vehicle").style.backgroundColor = "#f0f0f0";
    document.getElementById("logs").style.backgroundColor = "#f0f0f0";
    vals[val]();
}
function loadFile(){
    map = loadData.saveFile.gameMap;
    reLoadCanv();
}
function getFile() {
    document.getElementById("saveFile").click();
}
function readSave() {
    loadData.usingData = true;
    const readFile = new FileReader();
    var file = document.getElementById("saveFile").files[0];
    readFile.onload = function (ev) {
        var fullData = ev.target.result.split("|||");
        if(fullData[0] == "tivect-world"){
            // loadData.saveFile = JSON.parse(fullData[1])
            // map = loadData.saveFile.gameMap;
        }
        if(fullData[0] == "tivect-vehicle"){
            loadData.saveFile = JSON.parse(fullData[1])
            map = loadData.saveFile.vehicle;
            reLoadCanv();
        }
    }
    readFile.readAsText(file, "UTF-8");
}
function processVehicle(){
    var l=0;
    var r=0;
    var t=0;
    var b=0;
    for(var i=0;i<map.length;i++){
        for(var j=0;j<map[i].length;j++){
            if(map[i][j] != 0){
                b = i;
                break;
            }
        }
    }
    for(var i=map.length-1;i>=0;i--){
        for(var j=0;j<map[i].length;j++){
            if(map[i][j] != 0){
                t = i;
                break;
            }
        }
    }
    for(var j=0;j<map[0].length;j++){
        for(var i=0;i<map.length;i++){
            if(map[i][j] != 0){
                r = j;
                break;
            }
        }
    }
    for(var j=map[0].length-1;j>=0;j--){
        for(var i=0;i<map.length;i++){
            if(map[i][j] != 0){
                l = j;
                break;
            }
        }
    }
    var vehicleRet = [];
    for(var i=t;i<=b;i++){
        var row = [];
        for(var j=l;j<=r;j++){
            row.push(map[i][j]);
        }
        vehicleRet.push(row);
    }
    console.log(vehicleRet);
    console.log("Left : "+l+" Right : "+r+" Top : "+t+" Bottom : "+b);
    return vehicleRet;
}
function encrypt(input) {
    var data = JSON.stringify(input);
    var place = 4;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+=-{}[]|\"':;?/>.<,~`";
    var scattered = data.match(/.{1,7}/g);
    for (var l = 0; l < scattered.length; l++) {
        for (var i = 0; i < scattered[l].length; i++) {
            if (chars + place > chars.length) {

            }
        }
    }
    return data;
}
function saveVehicle() {
    var vehicle = processVehicle();
    var downloadSave = document.getElementById("downloadSave");
    downloadSave.href = "data:text/plain;charset=UTF-8," + encodeURIComponent("tivect-vehicle|||") + encodeURIComponent(
        encrypt({vehicle: vehicle})
    );
    downloadSave.click();
}