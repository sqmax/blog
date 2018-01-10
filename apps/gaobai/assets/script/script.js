debugMode = false;

// system:
var doc,
    win,
    canvas;

var winW,
    winH;

// webgl:

var canvas,
    ctx;

var id;
var timerId;
var count=0;

// game canvas:

var canavsBG;
var mX,mY;
var mouseIn;

// game styles:

var color = ['red','white','yellow','Blue','BlueViolet','Coral','DarkGreen','Gold','LightSeaGreen','Lime','YellowGreen','Turquoise','SteelBlue','Salmon','PowderBlue'];

// characters:

var stars=[];
var starSize;

// logics:

var dead;
var mvSpeed;
var fps;
var acc;
// player info

var username;
var score;

var confe;

// Main Function:
(function(){
    buildGame();
})();

function buildGame(){
    DivInit();
    init();
    setup();
    webglInit();
    buildComponents();
    draw();
    EventListener();
    startAnimation();
}


// Functions:
function init(){
    // Window
    doc = document;
    win = window;
    // Canavs
    canavsBG = 'black';
    
    
    // Game logics
    dead = false;
    score = 0;
    acc = 10;
    starSize = 5000;
    
    mouseIn = false;
    // Player
    username = 'Unknown';
}


function buildComponents(){
    for(var n = 0 ; n < starSize ; n++){
        var star = {x:mX, y:mY, angle:getRandomInt(0,360)*(Math.PI/180) ,size:0 , color:color[getRandomInt(0,color.length-1)]};
        stars.push(star);
    }
}

function update(){  
    retinaSupport(canvas);
    collisionCheck();
    draw();
}

function DivInit(){
    //push('body','<h1>New Canvas</h1>');
    push('body','<canvas id="canvas"></canvas>')
}

function setup(){
    $('#canvas').attr('width',winW).attr('height',winH);
}

function webglInit(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    retinaSupport(canvas);
    mX = winW/2;
    mY = winH/2;
    
    confe = {angle:getRandomInt(0,360)*(Math.PI/180),x:winW/2-250,y:winH/2-100,w:500,h:200,xdic:1,ydic:1,xspeed:0.5,yspeed:0.5,xacc:0.01,yacc:0.01};
}

function draw(){
    drawScene();
    drawCharacter();
    drawObstacle();
    drawConfe();
    drawGameUI();
}

function drawScene(){
    //retinaSupport(canvas);
    ctx.save();
    ctx.fillStyle = canavsBG;
    ctx.fillRect(0,0,winW,winH);
    ctx.restore();
}

function drawObstacle(){    
    // Draw drawObstacle here:
    if(mouseIn) drawImg(mX-15,mY-15,80,'assets/images/stick.svg');
}

function drawConfe(){
    fillRoundRect(confe.x,confe.y,confe.w,confe.h,20,'rgba(255, 255, 255,0.5)');
    fillRoundRect(confe.x+10,confe.y+10,confe.w-20,confe.h-20,10,'rgba(255,255,51,0.9)');
    ctx.save()
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("妙仪~我是真心喜欢你的！",confe.x+20,confe.y+50);
    ctx.fillText("希望有一天，我可以带你去看烟花！",confe.x+20,confe.y+100);
    ctx.fillText("--雨龙",confe.x+350,confe.y+150);
    ctx.restore();
}

function drawCharacter(){
    ctx.save();
    // Draw Character Here:
    for(var n = 0 ; n < stars.length ; n++){
        drawDot(stars[n].x,stars[n].y,stars[n].size,stars[n].color);
    }
    ctx.restore();
}

function drawDot(x,y,size,color){
    ctx.save();
    fillCircle(x,y,size,color);
    ctx.restore();
}

function drawGameUI(){
    // always on:
    drawScore();
    // when game over:
    if(dead){
        drawGameOver();
    }
}

// Events handlers:

function EventListener(){
    $(window).on('resize',function(){
        update();
    });
    
    $(window).on('tap',function(){
        controlUpdate();
    });
    
    $(window).click(function(e){
        controlUpdate();
    });
    
    $(window).keypress(function(e){
        var key = e.keyCode ? e.keyCode : e.which;
        // spacebar
        if(key == 32) {
            controlUpdate();
        }
    });
    
    // add key events here:
    
    $('canvas').mousemove(function(e){
        mouseIn = true;
    });

    
   $('canvas').mouseleave(function(e){
        mouseIn = false;
    });
    
    $('body').mousemove(function(e){
        mX = e.pageX*2;
        mY = e.pageY*2;
    });
}



function screenCheckAnimation(){
    update();
}

function startAnimation(){
    // animation
    frame();
}

// Logical Updates:


function controlUpdate(){
    // Control update
}

function frame() {
    
    if (dead) {        
        clearInterval(id);
        id = setInterval(screenCheckAnimation,1);
    } else {
        // update frames here
        characterMoving();
        obsAnimation();
        count++;
        update();
    }
    
    id = requestAnimationFrame(frame);
}

function characterMoving(){
    for(var n = 0 ; n < stars.length ; n++){
        if((stars[n].x>0 && stars[n].x<winW) ||  (stars[n].y>0 && stars[n].y<winH)){
            var speed = getRandomInt(1,2);
            stars[n].x+=speed*Math.sin(stars[n].angle)*acc;
            stars[n].y+=speed*Math.cos(stars[n].angle)*acc;
            stars[n].size+=0.4;
        } else {
            stars[n].x = mX;
            stars[n].y = mY;
            stars[n].angle = getRandomInt(0,360)*(Math.PI/180);
            stars[n].size = 1;
        }
    }
    
    //getRandomInt(0,360)*(Math.PI/180)
    confe.xspeed+=confe.xacc;
    confe.yspeed+=confe.yacc;
    confe.x += confe.xdic * confe.xspeed * confe.angle;
    confe.y += confe.ydic * confe.yspeed ;
    
    if(confe.xdic == 1 && confe.x > winW-confe.w){
        confe.xdic = -1;
        confe.xspeed = 1;
    }
    if(confe.xdic == -1 && confe.x < 0){
        confe.xdic = 1;
        confe.xspeed = 1;
    }
    if(confe.ydic == 1 && confe.y > winH-confe.h){
        confe.ydic = -1;
        confe.yspeed = 1;
    }
    if(confe.ydic == -1 && confe.y < 0){
        confe.ydic = 1;
        confe.yspeed = 1;
    }
}

function obsAnimation() {
    // Animation for obstacle
    
}
function drawGameOver(){
    ctx.save()
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over!", got1.x,got1.y);
    ctx.font = "15px Arial";
    ctx.fillText("Best Score: "+score, got2.x,got2.y);
    ctx.restore();
}

function drawScore(){
//    ctx.save()
//    ctx.font = "15px Arial";
//    ctx.fillStyle = "black";
//    ctx.fillText(username,20,20);
//    ctx.fillText("Score: "+score,20,40);
//    ctx.restore();
}


function retinaSupport(canvas) {
    if (window.devicePixelRatio) {
        var realToCSSPixels = window.devicePixelRatio;
        var displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
        var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);
        // Check if the canvas is not the same size.
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            winW = displayWidth;
            canvas.height = displayHeight;
            winH = displayHeight;
        }
    }
}



function drawFuzzyLines(x1,y1,x2,y2){
    var wide = 20;
    var p1x,p1y,p2x,p2y;
    
    ctx.save;
    ctx.strokeStyle = 'PaleGoldenRod';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for(var i = 0 ; i <3 ; i++){
        p1x = getRandomInt(x1-wide,x2+wide);
        p1y = getRandomInt(y1,y2);
        p2x = getRandomInt(x1-wide,x2+wide);
        p2y = getRandomInt(y1,y2);
        ctx.quadraticCurveTo(p1x,p1y,p2x,p2y);
    }
    ctx.quadraticCurveTo(p2x,p2y,x2,y2);
    ctx.closePath;
    ctx.stroke();
    ctx.restore;
}

function drawImgAngle(x,y,size,angle,imageObj){
    if(debugMode) drawRect(x,y,size,size,2,"green")
    ctx.save();
    ctx.translate(x+size/2, y+size/2);
    ctx.rotate(angle);
    ctx.drawImage(imageObj, -size/2, -size/2,size,size);  
    ctx.restore();
}

function drawRect(x,y,width,height,lineWidth,color){
    ctx.save();
    ctx.beginPath(); 
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(x,y);
    ctx.lineTo(x+width,y);
    ctx.lineTo(x+width,y+height);
    ctx.lineTo(x,y+height);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

function fillRect(x,y,width,height,lineWidth,color){
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
    ctx.restore();
}

function fillCircle(centerX,centerY,radius,color){
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.closePath;
    ctx.fill();
    ctx.restore();
}

function drawImg(x,y,size,url){
    var imageObj = new Image();
    imageObj.src = url;
    ctx.drawImage(imageObj, x, y,size,size);   
}

function drawLine(fromx, fromy, tox, toy){
    ctx.save;
    ctx.strokeStyle = 'white';
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
    ctx.restore;
}


function collisionCheck(){
    // Check The Collision here
    
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function fillRoundRect(x, y, width, height, radius, color) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}


function push(div,elm){
    $(div).append(elm);
}

function debug(msg){
    console.log(msg);
}