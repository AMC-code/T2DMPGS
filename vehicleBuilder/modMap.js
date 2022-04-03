const disp = document.getElementById("map");
const ctx = disp.getContext("2d");
ctx.imageSmoothingEnabled = false;
var multiplayer = false;
disp.height = 400;
disp.width = 650;
var blockSelect = 0;
var mapActive = 0;
var map = [
    [0,0,0],
    [0,0,0],
];
var vehicleMap = [];
var energyData = {
    type: null,
    level: null,
    available: null,
    energyUsed: null,
    power: 1000,
}
var size = 16;
var gameOffsetY = 0;
var gameOffsetX = 0;
var canClick = true;
function setUp(){
    var wMap = [];
    for(var i=0;i<300;i++){
        var ret = [];
        for(var j=0;j<1000;j++){
            ret.push(0);
        }
        wMap.push(ret);
    }
    map = wMap;
    reLoadCanv();
}
const eMap = [[0,1],[0,-1],[1,0],[-1,0]];
function energyPlace(x,y,block){
    if(activeEnBlock(block) == 1){
        energyTransfer(x,y);
    } else if(activeEnBlock(block) == 0){
        placeFrame(x,y);
    }
}
var energyBlocks = [
    [35,34],
    [40,41],
    [42,43],
];
function validCheck(y,x){
    return !(x > map[0].length-1 || x < 0 || y > map.length-1 || y < 0);
}
function activeEnBlock(val){
    for(var i=0;i<energyBlocks.length;i++){
        if(energyBlocks[i][0] == val){
            return 0;
        }
        if(energyBlocks[i][1] == val || val == 32){
            return 1;
        }
    }
    return -1;
}
function energyUseBlock(val){
    if(val == 32){
        return [32,32];
    }
    for(var i=0;i<energyBlocks.length;i++){
        if(val == energyBlocks[i][0] || val == energyBlocks[i][1]){
            return energyBlocks[i]
        }
    }
    return -1;
}
function energyRemoveT(x,y,block,energy){
    if(block != 34 || block != 32){
        removeEner(x,y,energy);
    }
}
function placeFrame(x,y){
    var largest = [0,0,0];
    for(var i=0;i<4;i++){
        if(validCheck(y+eMap[i][0],x+eMap[i][1]) && activeEnBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]) != -1 && map[y+eMap[i][0]][x+eMap[i][1]][2] > largest[2]){
            largest[0] = y+eMap[i][0];
            largest[1] = x+eMap[i][1];
            largest[2] = map[y+eMap[i][0]][x+eMap[i][1]][2];
        }
    }
    energyTransfer(largest[1],largest[0]);
}
function energyTransfer(x,y){
    var energyLevel = map[y][x][2];
    if(energyLevel-1 > 0){
        for(var i=0;i<4;i++){
            if(validCheck(y+eMap[i][0],x+eMap[i][1])){
                var type = energyUseBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]);
                if(type != 1 && energyLevel > map[y+eMap[i][0]][x+eMap[i][1]][2]){
                    map[y+eMap[i][0]][x+eMap[i][1]][0] = type[1];
                    map[y+eMap[i][0]][x+eMap[i][1]][2] = energyLevel-1;
                    energyTransfer(x+eMap[i][1],y+eMap[i][0]);
                }
            }
        }
    }
}
var energyArr = [];
function removeEner(x,y,energyLevel){
    energyArr = [];
    killEnergy(x,y,energyLevel);
    for(var i=0;i<energyArr.length;i++){
        energyTransfer(energyArr[i][1],energyArr[i][0]);
    }
}
function killEnergy(x,y,energyLevel){
    for(var i=0;i<4;i++){
        if(validCheck(y+eMap[i][0],x+eMap[i][1])){
            var type = energyUseBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]);
            if(type != -1 && activeEnBlock(map[y+eMap[i][0]][x+eMap[i][1]][0]) == 1){
                if(map[y+eMap[i][0]][x+eMap[i][1]][2] < energyLevel){
                    map[y+eMap[i][0]][x+eMap[i][1]][0] = type[0];
                    map[y+eMap[i][0]][x+eMap[i][1]][2] = 0;
                    killEnergy(x+eMap[i][1],y+eMap[i][0],energyLevel)
                } else if(map[y+eMap[i][0]][x+eMap[i][1]][2] >= energyLevel){
                    energyArr.push([y+eMap[i][0],x+eMap[i][1]]);
                }
            }
        }
    }
}
function temp(){
    ctx.clearRect(0, 0, disp.width, disp.height);
    ctx.fillStyle = "#0e9dd6";
    ctx.fillRect(0, 0, disp.width, disp.height);
}
function validBlockClick(y,x){
    var ret = y > map.length-1 || y < 0 || x > map[0].length-1 || x < 0;
    return !ret;
}
function block(y,x,num) {
    var dBlocks = [[0,false,"air"],[1,3,"grain"],[2,5,"wood"],[3,8,"stone"],[4,3,"grain"],[5,8,"stone"],[6,8,"stone"],[7,3,"brittle"],[8,7,"stone"],[9,5,"wood"],[10,3,"brittle"],[11,8,"stone"],[12,8,"stone"],[13,false,"liquid"],[14,8,"stone"],[15,4,"silk"],[16,5,"cookie"],[17,false,"unknown"],[18,32,"stone"],[19,6,"metal"],[20,3,"grain"],[21,12,"stone"],[22,10,"stone"],[23,10,"stone"],[24,10,"stone"],[25,10,"stone"],[26,9,"stone"],[27,9,"stone"],[28,9,"stone"],[29,2,"grain"],[30,7,0,false,"stone"],[31,7,0,false,"stone"],[32,7,energyData.power,"stone"],[33,7,"stone"],[34,7,1,"stone"],[35,7,0,"stone"],[36,2,"silk"],[37,12,{type:"storage",purpose:"storage",mouseX:0,mouseY:0,row:0,highlighted:0,tabs:0,inventory:[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]},"metal"],[38,7,0,false,"stone"],[39,5,"wood"],[40,6,0,{type:"interface",purpose:"storage",mouseX:0,mouseY:0,tabs:0,select:[0,0],rows:[[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]]]},"stone"],[41,6,1,{type:"interface",purpose:"storage",mouseX:0,mouseY:0,tabs:0,select:[0,0],rows:[[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]],[[0,"TYPE:"],[1,30,""]]]},"stone"],[42,6,0,[""],"stone"],[43,6,1,[""],"stone"],[44,6,"metal"],[45,6,"metal"],[46,6,"metal"],[47,6,"metal"]];
    if(num > dBlocks.length-1 || num < 0){
        return;
    }
    map[y][x] = dBlocks[num][0];
}
function clickEvent(ev) {
    var rect = disp.getBoundingClientRect();
    var xPos = ev.clientX - rect.left + gameOffsetX*size;
    var yPos = ev.clientY - rect.top - gameOffsetY*size;
    // var yAttackPos = gameOffsetY*size + disp.height - ev.clientY;
    var blockX = Math.floor(xPos / size);
    var blockY = Math.floor((yPos - disp.height) / size) + map.length;
    var placeBlock = true;
    if(canClick){
        canClick = false;
        setTimeout(function(){
            canClick = true;
        },100);
        if (placeBlock && validBlockClick(blockY,blockX)) {
            if (map.length - 1 >= blockY && blockY >= 0) {
                if (map[blockY].length - 1 >= blockX && blockX >= 0) {
                    var prevBlock = map[blockY][blockX];
                    if(activated == 1){
                        block(blockY,blockX,blockSelect);
                        if(multiplayer){
                            ws.send(`build|${blockY}|${blockX}|${blockSelect}|${sid}`);
                        }
                        if(activeEnBlock(blockSelect) != 0 && activeEnBlock(prevBlock[0]) == 1){
                            energyRemoveT(blockX,blockY,blockSelect,prevBlock[2]);
                        }
                        if(activeEnBlock(blockSelect) != -1){
                            energyPlace(blockX,blockY,blockSelect);
                        }
                    } else if(activated == 0){
                        var data = [];
                        data.push(blockX);
                        data.push(blockY);
                        data.push(prevBlock[0]);
                        if(prevBlock[0] != 0){
                            data.push(colors[prevBlock[0]-1][2]);
                        } else {
                            data.push("air");
                        }
                        data.push(prevBlock[1]);
                        displayBData(data);
                    }
                    reLoadCanv();
                };
            };
        }
    };
};
var colors = [
    [1,"#0caa21","grain"],
    [2,"#754f08","wood"],
    [3,"#525252","stone"],
    [4,"#4e3307","grain"],
    [5,"#686868","stone"],
    [6,"#525252","stone"],
    [7,"#cef5f8","brittle"],
    [8,"#e0ebeb","stone"],
    [9,"#382404","wood"],
    [10,"#929292","brittle"],
    [11,"#444444","stone"],
    [12,"#c2c2c2","stone"],
    [13,"#1551d1","liquid"],
    [14,"#6e6e6e","stone"],
    [15,"#831e1e","silk"],
    [16,"#97612e","cookie"],
    [17,"#120425","unknown"],
    [18,"#050111","stone"],
    [19,"#e6a510","metal"],
    [20,"#f6ea7c","grain"],
    [21,"#75efff","stone"],
    [22,"#eb4848","stone"],
    [23,"#4853eb","stone"],
    [24,"#5ce473","stone"],
    [25,"#ffcb88","stone"],
    [26,"#ffe388","stone"],
    [27,"#e7e7e7","stone"],
    [28,"#b68e5b","stone"],
    [29,"#2e8618","grain"],
    [30,"#ffe54f","stone"],
    [31,"#5d5d5d","stone"],
    [32,"#ffe54f","stone"],
    [33,"#5d5d5d","stone"],
    [34,"#ffe54f","stone"],
    [35,"#5d5d5d","stone"],
    [36,"#62f050","silk"],
    [37,"#1d1d1d","metal"],
    [38,"#dfc535","stone"],
    [39,"#462f0a","wood"],
    [40,"#d5dfdf","stone"],
    [41,"#46f3f3","stone"],
    [42,"#d5dfdf","stone"],
    [43,"#46f3f3","stone"],
    [44,"#46f3f3","stone"],
    [45,"#46f3f3","stone"],
    [46,"#46f3f3","stone"],
    [47,"#e6cd43","stone"],
]
var controls = {
    keys:[["ARROWRIGHT",false],["ARROWLEFT",false],["ARROWUP",false],["ARROWDOWN",false]],
    control:function(e){
        const keyDown = (e.type == "keydown");
        for(var i=0;i<controls.keys.length;i++){
            if(controls.keys[i][0] == e.key.toUpperCase()){
                controls.keys[i][1] = keyDown;
                reLoadCanv();
                e.preventDefault();
            }
        }
    }
}
disp.addEventListener("mousedown", function (ev) {clickEvent(ev)});
window.addEventListener("keydown", controls.control);
window.addEventListener("keyup", controls.control);
function getColor(val){
    for(var i=0;i<colors.length;i++){
        if(colors[i][0] == val){
            return colors[i][1];
        }
    }
    return "#000000";
}
function drawSquare(x, y, val) {
    if (val != 0) {
        ctx.fillStyle = getColor(val);
        ctx.fillRect(x,y,size,size)
    };
};
function reLoadCanv(){
    ctx.clearRect(0, 0, disp.width, disp.height);
    ctx.fillStyle = "#0e9dd6";
    ctx.fillRect(0, 0, disp.width, disp.height);
    if(controls.keys[0][1]){
        controls.keys[0][1] = false;
        gameOffsetX += 1;
    }
    if(controls.keys[1][1]){
        controls.keys[1][1] = false;
        gameOffsetX -= 1;
    }
    if(controls.keys[2][1]){
        controls.keys[2][1] = false;
        gameOffsetY += 1;
    }
    if(controls.keys[3][1]){
        controls.keys[3][1] = false;
        gameOffsetY -= 1;
    }
    var jLeft = Math.floor(gameOffsetX*size / size);
    var jRight = jLeft + Math.ceil(disp.width / size);
    var iBottom = map.length - Math.floor(gameOffsetY*size / size)-1;
    var iTop = map.length - Math.ceil((disp.height+gameOffsetY*size) / size);
    if (jLeft < 0) {
        jLeft = 0;
    } else if (jLeft >= map[0].length) {
        jLeft = map[0].length - 1;
    };
    if (jRight >= map[0].length) {
        jRight = map[0].length - 1;
    } else if (jRight < 0) {
        jRight = 0;
    };
    if (iBottom < 0) {
        iBottom = 0;
    } else if (iBottom >= map.length) {
        iBottom = map.length - 1;
    };
    if (iTop >= map.length) {
        iTop = map.length - 1;
    } else if (iTop < 0) {
        iTop = 0;
    };
    for (var j = jLeft; j <= jRight; j++) {
        for (var i = iTop; i <= iBottom; i++) {
            var x = Math.floor(size * j - gameOffsetX*size);
            var y = Math.floor(gameOffsetY*size + disp.height - size * (map.length - i));
            if(mapActive == 0){
                drawSquare(x,y,map[i][j],2);
            }
        };
    };
}
setUp()