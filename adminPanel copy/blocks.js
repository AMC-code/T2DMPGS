const selection = document.getElementById("blocks");
const cx = selection.getContext("2d");
selection.height = 400;
selection.width = 296;
// selection.width = 266;
var textures = [];
var data = {
    slots:6,
}
renderSize = 1
var blockSources = ["", "grass.png", "wood.png", "stonebrick.png", "dirt.png", "stone.png", "crackedstonebrick.png", "glass.png", "concrete.png", "woodwall.png", "glasswall.png", "stonewall.png", "smoothstone.png", "water.png", "smoothstonewall.png", "redwool.png", "cookie.png", "portal.png", "obsidian.png", "goldBlock.png", "sand.png", "diamondore.png", "rubyore.png", "sapphireore.png", "emeraldore.png", "energyOre.png", "goldore.png", "silverore.png", "ironore.png","leaves.png","switchOn.png","switchOff.png","goldCore.png","coreFrame.png","energyTransfer.png","transferFrame.png","greenScreen.png","storageBlock.png","switchPower.png","log.png","scoreModB.png","scoreModA.png","scoreServerB.png","scoreServerA.png"];
function setUpBlock(){
    for(var j = 0; j < blockSources.length; j++) {
        textures[j] = document.createElement("IMG");
        if (j != 0) {
            textures[j].src = 'texture/' + blockSources[j];
        };
    };
    setTimeout(render,250);
}
function buttonClick(x,y,t,b,r,l){
    return x <= r && x >= l && y <= t && y >= b;
}
function clickBtn(ev){
    var rect = selection.getBoundingClientRect();
    var xPos = ev.clientX - rect.left;
    var yPos = ev.clientY - rect.top;
    for(var j=0;j<Math.ceil(blockSources.length/data.slots);j++){
        for(var i=0;i<data.slots;i++){
            if(buttonClick(xPos,yPos,(36*j)+(16*j)+36,(36*j)+(16*j),(36*i)+(16*i)+36,(36*i)+(16*i))){
                if(j*data.slots+i < blockSources.length){
                    blockSelect = j*data.slots+i;
                    render2();
                }
            }
        }
    }
}
selection.addEventListener("mousedown", function (ev) {clickBtn(ev)});
function drawBlock(x,y,val){
    if (val != 0) {
        cx.drawImage(textures[val], 0, 0, 36, 36, Math.ceil(x*renderSize), Math.ceil(y*renderSize), Math.ceil(36*renderSize), Math.ceil(36*renderSize));
    } else {
        cx.fillStyle = "#afafaf67";
        cx.fillRect(x,y,36,36);
    }
}
function render(){
    cx.clearRect(0, 0, selection.width, selection.height);
    var val=0;
    for(var i=0;i<blockSources.length;i++){
        if((val*data.slots+data.slots)-i == 0){
            val++;
        }
        drawBlock((i-(val*data.slots))*(36+16),val*(36+16),i);
    }
}
setUpBlock();