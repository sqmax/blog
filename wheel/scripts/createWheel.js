// Global variables

var colour=[]; // predifined colour set
var itmes=[]; // items on the wheel
var slices;
var sliceAngle;
var angle;
var spinningSpeed;
var deceleration;
var wheelCanvas; // wheel canvas
var width; // wheel size
var center; // center point
var stop;
var lock;

var index;
var result;


// constructor
function createWheel(canvas,list) {
    itmes = list;
    wheelCanvas = canvas.getContext('2d');
    initialize();
    eventsListenner(canvas);
    animation();
}


// initialization
function initialize() {
    for(index=0;index<itmes.length;index++){
        colour[index] = getRandColour();
    }
    slices = colour.length;
    sliceAngle = 360/slices;
    angle = rand(0, 360);
    spinningSpeed = 0;
    deceleration = 0;
    width = canvas.width; // size
    center = width/2;      // center
    stop = false;
    lock = false;
    
}

function eventsListenner(canvas) {
    $(canvas).click(function(){
        stop = true;
        // jQueryUI lib pulsate effct:
        $(this).effect("pulsate", { times:6 }, 2000);
});
}

function setStyle(canvas) {
    
}

function animation() {
  angle += spinningSpeed;
  angle %= 360;

  // Increment spinningSpeed
  if(!stop && spinningSpeed<3){
    spinningSpeed = spinningSpeed+1 * 0.1;
  }
  // Decrement Speed
  if(stop){
    if(!lock){
      lock = true;
      deceleration = rand(0.994, 0.999);
    } 
    spinningSpeed = spinningSpeed>0.2 ? spinningSpeed*=deceleration : 0;
  }
  // Stopped!
  if(lock && !spinningSpeed){
    var decisionIndex = Math.floor(((360 - angle - 90) % 360) / sliceAngle);
    decisionIndex = (slices+decisionIndex)%slices;
    // store the result:
    result = itmes[decisionIndex];
    return $('#result').html("You got:</br>"+result);
  }

  drawWheel();
  window.requestAnimationFrame(animation);
}


// Main Components

function drawSlice(angle, colour) {
  wheelCanvas.beginPath();
  wheelCanvas.fillStyle = colour;
  wheelCanvas.moveTo(center, center);
  wheelCanvas.arc(center, center, width/2, degreeToRadius(angle), degreeToRadius(angle+sliceAngle));
  wheelCanvas.lineTo(center, center);
  wheelCanvas.fill();
}

function drawText(angle, text) {
    wheelCanvas.save();
    wheelCanvas.translate(center, center);
    wheelCanvas.rotate(degreeToRadius(angle));
    wheelCanvas.textAlign = "left";
    wheelCanvas.fillStyle = "#fff";
    wheelCanvas.font = 'bold '+getFontSize(text)+'px sans-serif';
    wheelCanvas.shadowColor = "#111";
    wheelCanvas.shadowOffsetX = 4; 
    wheelCanvas.shadowOffsetY = 4; 
    wheelCanvas.shadowBlur = 10;
    wheelCanvas.fillText(text, 130, 10);
    wheelCanvas.restore();
}

function drawWheel() {
  wheelCanvas.clearRect(0, 0, width, width);
  for(var i=0; i<slices; i++){
    drawSlice(angle, colour[i]);
    drawText(angle+sliceAngle/2, itmes[i]);
    angle += sliceAngle;
  }
   
}

// Utilities


function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function degreeToRadius(angle) {
  return angle * Math.PI/180;
}


function getRandColour() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 3; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function getFontSize(text) {
    return 200*(1/text.length)+5;
}

function getCanvas() {
    return this.wheelCanvas;
}



