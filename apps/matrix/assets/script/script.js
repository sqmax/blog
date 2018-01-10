var win,
    canvas,
    ctx,
    ratio;

var color = ['#00ff67','#40ff3d','white','yellow','Blue','BlueViolet','Coral','DarkGreen','Gold','LightSeaGreen','Lime','YellowGreen','Turquoise','SteelBlue','Salmon','PowderBlue'];

var katakana = [];
var katSize;
// components

var matrices = [];
var matSize;
var matFontSize;
var matIncre;

var fps, fpsInterval, startTime, now, then, elapsed;

(buildGame)();

function buildGame(){
    init();
    katSize = genKatakana();
    build();
    draw();
    
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    
    startAnimation();
    addEventListener();
}

function init(){
    $('body').append('<canvas id="canvas"></canvas>');
    canvas = $('#canvas')[0];
    ctx = canvas.getContext('2d');
    setScreenRes();
    matSize = window.innerWidth;
    fps = 60;
    matFontSize = 0;
    matIncre = 0.2555;
}

function genKatakana(){
    var offset = "abcdef",
        index = "0123456789abcdef";
    for (var o = 0 ; o < offset.length ; o++){
        for(var i = 0 ; i < index.length ; i++){
            katakana.push(eval("'\\u30" + offset[o] + index[i] + "'"));
        }
    }
    return katakana.length;
}

function build(){
    for(var n = 0 ; n < matSize ; n++){
        var set = [];
        for(var i = 0 ; i < ri(50,200) ; i++){
            set.push(katakana[ri(0,katakana.length-1)]);
        }
        matrices.push({x:n*7,y:ri(-1000,1000),sets:set,v:rf(10,20),size:8});
    }
}


function draw(){
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,window.innerWidth,innerHeight);
    ctx.restore();
    drawKat();
}

function drawKat(){
    ctx.save();
    ctx.textAlign="center";
    for(var n = 0 ; n < matSize ; n++){
        var mat =  matrices[n];
        ctx.font = mat.size+"px Arial";
        for(var i = 0 ; i < mat.sets.length; i++){
            ctx.fillStyle= 'rgba(0, 255, 89 ,'+(i/(mat.sets.length+mat.size))+')';
            ctx.fillText(mat.sets[i],mat.x,mat.y+(i*(mat.size)));
        }
    }
    ctx.restore();
    
    ctx.save();
    ctx.textAlign="center";
    ctx.font = matFontSize+"px Arial";
    ctx.fillStyle= 'rgba(37, 140, 73, '+matFontSize/50+')';
    ctx.fillText("The Matrix",window.innerWidth/2+4,window.innerHeight/2+4);
    ctx.fillText("The Matrix",window.innerWidth/2+3,window.innerHeight/2+3);
    ctx.fillText("The Matrix",window.innerWidth/2+2,window.innerHeight/2+2);
    ctx.fillText("The Matrix",window.innerWidth/2+1,window.innerHeight/2+1);
    ctx.fillStyle= 'rgba(0, 255, 89 , '+matFontSize/80+')';
    ctx.fillText("The Matrix",window.innerWidth/2,window.innerHeight/2);
    ctx.restore();
    
    ctx.save();
    ctx.strokeStyle = 'rgba(37, 140, 73, '+matFontSize/80+')';
    ctx.lineWidth = Math.floor(matFontSize*0.05);
    ctx.strokeRect(window.innerWidth/2-(matFontSize*5.2)/2,(window.innerHeight)/2-matFontSize*1.5/1.45,matFontSize*5.2,matFontSize*1.5);
    ctx.restore();
    
}

function update(){
    draw();
}

function startAnimation(){
    requestAnimationFrame(startAnimation);
    update();
    
    
    now = Date.now();
    elapsed = now - then;
    
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        moving();
    }
    if (elapsed > 30) {
        flash();
    }
    
}

function moving(){
   
    
    if(matFontSize<80 && matIncre >0) matFontSize+=matIncre;
    if(matFontSize>0 &&  matIncre <0) matFontSize+=matIncre;
    
    for(var n = 0 ; n < matSize ; n++){
        var mat = matrices[n]
        if(mat.y<(window.innerHeight)){
            mat.y+=mat.v;
        } else {
            mat.y = -(2*mat.sets.length*mat.size);
            var set = [];
            for(var i = 0 ; i < ri(20,100) ; i++){
                set.push(katakana[ri(0,katakana.length-1)]);
            }
            mat.sets = set;
        }
    }
}

function flash(){
    for(var n = 0 ; n < matSize ; n++){
        var mat = matrices[n]
        mat.sets[ri(0,mat.sets.length-2)]= katakana[ri(0,katakana.length-1)];
    }
}

function addEventListener(){
    $(document).on('resize',function(){
        setScreenRes();
        update();
    });
    var win = document.g
    $(document).click(function(){
        matIncre = -1*matIncre;
    });
}

// inclusive[min,max] 
function ri(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rf(min, max) {
    return Math.random() * (max - min) + min;
}

function setScreenRes(){
    ratio =  window.devicePixelRatio;
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight ;
}