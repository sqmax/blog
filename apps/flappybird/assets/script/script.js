debugMode = false;


// system:
var doc,
    win,
    winW,
    winH;

// webgl:

var canvas,
    ctx;

var id;
var count = 0;

// game styles

var cloudTypes = ['assets/images/cloud.svg',
                  'assets/images/cloud.svg',
                  'assets/images/cloud.svg'];

var color = ['#E08031',
             '#C7CE82',
             '#199475',
             '#0B6E48',
             '#044D22'];

var bgm;
var sounde;

var canvasBG;

// characters:

var bird,
    bx,
    by,
    angle,
    size,
    V0,
    acc,
    gravity;


var gap;
var obsW;

// logics:

var dead;
var obss = [];
var clouds = [];

var firstTime;

var mvSpeed;
var oldSpeed;
var fps;
var lastCalledTime;
var time;

// player info

var username;
var score;
var level;
var best=0;
var got;

// game rules

var gapSetting,
    gapStep,
    scoreSetting,
    scoreStep;

// Main Function:
(function(){

    //buildGame();
    homePage();
})();

function homePage(){
    
    firstTime = true;
    
    push('body','<div id="home"><div>');
    push('#home','<h1>Welcome to Yulong\'s Flappy Bird</h1>');
    push('#home','<div id="prom"><div>')
    push('#prom','<img id="logo" src="assets/images/bird002.svg" alt="">');
    push('#prom','<h1>Type Your Name:</h1>');
    push('#prom','<div id="form"></div>');
    push('#form','<input id="name" type="text"><br>');
    push('#form','<button id="enterbtn">Enter Game</button>'); 
    // properties
    $('#home').css('width','100%').css('height','100%').css('text-align','center');
    $('#prom').css('width','50%')
              .css('height','70%')
              .css('background','black')
              .css('margin-left','25%')
              .css('text-align','center')
              .css('border','1px solid black');
    $('#prom h1').css('color','white');
    $('#logo').css('max-width','30%').css('height','30%');
    $('#enterbtn').click(buildGame);
}


function getUsername(){
    username = $('#name').val();
    $('#home').remove();
}

function buildGame(){
    if(firstTime) getUsername();
    init();
    DivInit();
    webglInit();
    setup();
    draw();
    EventListener();
    startAnimation();
}

function clearUp(){
    firstTime = false;
    destroyEventListener();
    bgm.play();
}

// Functions:
function init(){
    
    doc = document;
    win = window;
    
    canvasBG = '#EAF2F8'; 
    bgm = $('#bgm')[0];
    bgm.currentTime = 0;
    sounde = $('#sounde')[0];
    sounde.currentTime = 0;
    
    bird = new Image();
    bird.src='assets/images/bird002.svg';
    size = 20;
    gravity = 0.15;
    
    // initial speed
    V0 = 0;
    bx = (winW/8)-(size/2);
    by = 0;
    angle = 0;
    dead = false;
    
    // game rules
    lastCalledTime = Date.now() ;
    gapSetting = 400;
    gapStep = 20;
    scoreSetting = 30;
    scoreStep = 30;
    
    // obs
    gap = gapSetting;
    obsW = 40;
    mvSpeed = 1;
    oldSpeed = 1;
    fps = 0;
    clouds=[]
    

    
    if((username.length<1)&&((username=='')||(username==null)||(username==undefined))) username = "Flappy Bird";
    
    score = 0;
    level = 1;
    

    
}

function createClouds(){
    // clouds
    var num = Math.round(winW/300);
    debug(num);
    var oldPos = 0;
    var cloud;
    for(var n  = 0 ; n < num ; n++){
        var len = cloudTypes.length-1;
        var index = getRandomInt(0,len);
        var size = getRandomInt(50,500);
        var speed = getRandomInt(1,6);
        if(n==0){
            cloud = {x:winW,y:getRandomInt(-size,winH/2),size:size,cloudType:index,speed:speed};
        } else {
            cloud = {x:oldPos+winW/num,y:getRandomInt(-size,winH/2),size:size,cloudType:index,speed:speed};
        }
        oldPos = cloud.x;
        clouds.push(cloud);
    }
}


function buildObstacles(){    
    debug(winW);
    obss = generateObstacle(Math.round(winW/400));
    debug(obss.length);
}


function generateObstacle(num){
    
    var newObss=[];
    var oldPos = 0;
    var obs;
    for(var n = 0 ; n < num ; n++){
        var clen = color.length-1;
        var cindex = getRandomInt(0,clen);
        if(n==0){
            obs = {x:winW+obsW,height:getRandomInt(2,winH/3),color1:color[cindex],color2:color[clen-cindex]};
        } else {
            obs = {x:oldPos+winW/num,height:getRandomInt(2,winH/3),color1:color[cindex],color2:color[clen-cindex]};
        }
        oldPos = obs.x;
        newObss.push(obs);
    }
    return newObss;
}

function update(){  
    retinaSupport(canvas);
    gameRulesCheck();
    collisionCheck();
    draw();
}

function DivInit(){
    $('#canvas').remove();
    push('body','<canvas id="canvas"></canvas>');
    push('body','<input id="btnPlayAgain" type="button" style="z-index:2; position:absolute; top:-50px; left:'+(winW/2)+'px" value="Play Again"/>');
}

function webglInit(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    retinaSupport(canvas);
}
function setup(){
    $('#canvas').attr('width',winW).attr('height',winH);
    createClouds();
    buildObstacles();
    got = {x:winW/2,y:-20};
}

function drawScene(){
    ctx.save();
    ctx.fillStyle = canvasBG;
    ctx.fillRect(0,0,winW,winH);
    ctx.restore();
    drawClouds();
}

 
function draw(){
    drawScene(); 
    drawObs();
    drawImgAngle(bx,by,size,angle,bird);
    screenCheck();
}

function controlUpdate(){
    V0 -= 12;
    angle= 1;
}


function destroyEventListener(){
     $(window).off();
}

function EventListener(){
    $(window).on('resize',function(){
        buildObstacles();
        createClouds();
        got.x = winW/2;
        update();
    });
    
    $(window).on('tap',controlUpdate);
    $(window).click(controlUpdate);

    $(window).keypress(function(e){
        var key = e.keyCode ? e.keyCode : e.which;
        // spacebar
        if(key == 32) {
            controlUpdate();
        }
        // right
        if (key == 68 || key == 39 || key == 100) {
            oldSpeed = mvSpeed;
        }
    });
    
    
    $(window).keydown(function(e){
        var key = e.keyCode ? e.keyCode : e.which;
        // right
        if (key == 68 || key == 39 || key == 100) {
            if(mvSpeed<5)
                mvSpeed += 0.1;
        }
        if (key == 65 || key == 37) {
            if(mvSpeed>1)
                mvSpeed -= 0.1;
        }
    });
    
    $(window).keyup(function(e){
        var key = e.keyCode ? e.keyCode : e.which;        
        if (key == 68 || key == 39 || key == 100){
            //
        }
        
    });
    
}

function gameRulesCheck(){
    if(score>scoreSetting && gap>120){
        gap = gapSetting;
        gapSetting -= gapStep;
        scoreSetting += scoreStep;
    }
    if(score>best) best = score;
    level = 1+Math.floor(score/scoreStep);
    mvSpeed = mvSpeed+level*0.0001;
}

function screenCheck(){
    // always on:
    drawScore();
    // when game over:
    if(dead){
        drawGameOver();
    }
}

function screenCheckAnimation(){
    if(got.y<(winH/2))
        got.y+=1;
    else{
        clearInterval(id);

        $('#btnPlayAgain').click(function(){
            $(this).off();
            $(this).remove();
            clearUp();
            buildGame();
        });
    }
    update();

}

function startAnimation(){
    // animation
    id = setInterval(frame, 1);
}


function frame() {    
    if (dead) {
        
        bgm.pause();
        bgm.currentTime = 0;
        
        clearInterval(id);
        id = setInterval(screenCheckAnimation,1);
    } else {
        // update frames here

        if(angle>0 && V0>0) angle-=0.005;
        
        moving();
        
        if(size<100){
            size+=0.5;
            bx = (winW/4)-(size/2);
        }
        cloudsAnimation();
        obsAnimation();
        count++;
        update();
    }
}

function moving(){
    if(by<winH-size+10){
       V0+=gravity;
       V0*=0.95;
       by+=V0;
    } else {
        dead = true;
    }
}

function obsAnimation() {
    if (!dead) {
        for( var n = 0 ; n < obss.length ; n ++){
            if (obss[n].x > -obsW) {
            obss[n].x -= mvSpeed;
            if(Math.floor(obss[n].x)==Math.floor(bx+obsW)){
                sounde.currentTime = 0;
                sounde.play();
                score++;
            }
        } else {
            obss[n].height = getRandomInt(10, winH*2 / 3);
            var clen = color.length-1;
            var num = getRandomInt(0,clen);
            obss[n].color1 = color[num];
            obss[n].color2 = color[clen-num];
            obss[n].x = winW ;
        }
        }
    }
}

function cloudsAnimation(){
     for( var n = 0 ; n < clouds.length ; n ++){
            if (clouds[n].x > -clouds[n].size) {
                clouds[n].x -= clouds[n].speed;
        } else {
            clouds[n].speed = getRandomInt(1,6);
            clouds[n].x = winW ;
            clouds[n].y = getRandomInt(-10, winH*2 / 4);
        }
    }
}

function getFPS(){
  var delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
    
  return Math.floor(fps);
}


function drawGameOver(){
    ctx.save();
    fillRoundRect(got.x-200+10, got.y-150+10, 400 ,300 , 20 , 'rgba(1,1,1,0.1)');
    fillRoundRect(got.x-200, got.y-150, 400 ,300 , 20 , 'rgba(255,255,255,0.8)');
    ctx.textAlign="center"; 
    ctx.font = "60px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over!", got.x,got.y-30);
    ctx.font = "30px Arial";
    ctx.fillText("Best Score: "+best, got.x,got.y+30);
    ctx.restore();
    $('#btnPlayAgain').css('top',(got.y/2+30)+'px').css('left',(got.x/2-45)+'px');
}

function drawScore(){
    ctx.save();
    
    // Copyright
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("Developer: Yulong Fang",20,winH - 45);
    ctx.font = "20px Arial";
    ctx.fillText("Copyright@Jocstech "+new Date().getFullYear(),20,winH - 20);
    
    fillRoundRect(20,20,190,135,10,'rgba(155,155,155,0.5)');
    ctx.font = "25px Arial";
    ctx.fillStyle = "gray";
    ctx.fillText("Level:  "+level,42,92);
    ctx.fillStyle = "white";
    ctx.fillText("Level:  "+level,40,90);
    ctx.fillStyle = "gray";
    ctx.fillText("Score: "+score,42,117);
    ctx.fillStyle = "white";
    ctx.fillText("Score: "+score,40,115);
    ctx.fillStyle = "gray";
    ctx.fillText("Best:   "+best,42,142);
    ctx.fillStyle = "white";
    ctx.fillText("Best:   "+best,40,140);
    ctx.font = "30px Arial";
    ctx.fillStyle = "gray";
    ctx.fillText(username,40,59);
    ctx.fillStyle = "white";
    ctx.fillText(username,42,57);
    fillRoundRect(winW-160,20,150,50,10,'rgba(0,0,0,0.6)');
    ctx.fillText('FPS:'+getFPS(),winW-140,55);
    ctx.textAlign="center"; 
    ctx.font = "80px Arial";
    ctx.fillStyle = "gray";
    ctx.fillText(Math.floor(count/100)+'m',winW/2,winH-40);
    ctx.restore();
}

function drawClouds(){
    for(var n = 0 ; n < clouds.length ; n++){
        drawImg(clouds[n].x,clouds[n].y,clouds[n].size,cloudTypes[clouds[n].cloudType]);
    }
}

function drawObs(){    
    for(var n = 0 ; n < obss.length ; n++){
        fillRect(obss[n].x,0,obsW,obss[n].height,5,obss[n].color1);
        fillRect(obss[n].x,obss[n].height+gap,obsW,winH-obss[n].height-gap,5,obss[n].color2);
    
        fillCircle(obss[n].x+obsW/2,obss[n].height-13,obss[n].color1);
        fillCircle(obss[n].x+obsW/2,obss[n].height+gap+13,obss[n].color2); 
    
        if((obss[n].x+obsW/2>bx+100)&&!dead)
            drawFuzzyLines(obss[n].x+obsW/2,obss[n].height-13,obss[n].x+obsW/2,obss[n].height+gap+13);
    }
}

function drawFuzzyLines(x1,y1,x2,y2){
    
    var wide = 25;
    var p1x,p1y,p2x,p2y;
    
    ctx.save;
    ctx.strokeStyle = 'chartreuse';
    ctx.lineWidth = 5;
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
    ctx.restore();
    
    
    
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


function fillCircle(centerX,centerY,color){
    var radius = obsW;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.closePath;
    ctx.fill();
    ctx.restore();
    
    radius = obsW - 6;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = canvasBG;
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
    ctx.restore();
}


function collisionCheck(){    
    for(var n = 0 ; n < obss.length ; n++){
        if((bx+size)>obss[n].x && (bx+size)<obss[n].x+obsW){
            if(((by)< obss[n].height)||((by+size) > obss[n].height+gap))
                dead = true;
        }
    }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


function push(div,elm){
    $(div).append(elm);
}

function debug(msg){
    console.log(msg);
}


function retinaSupport(canvas) {
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