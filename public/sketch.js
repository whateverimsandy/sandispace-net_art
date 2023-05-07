document.body.style.margin   = 0
document.body.style.overflow = `hidden`

 

/*let x= 0;

function setup () {
   createCanvas (innerWidth, innerHeight)
   background (`black`)
}

function  draw () {
   
   noStroke()
   fill (255, random(255),random(255))
   ellipse (mouseX,mouseY,100,100)

   myT();
   
}

function myT(){
   fill('black')
   textAlign('CENTER')
   textSize(200)
   text("lololololololo",300,300)
   text("hahahhahah",300,400)
} */

// declare an empty array to store the particles
let particles = [];

// declare a variable 'river'
let river;

//declare a constant variable 'num' and assign value of 200
const num = 200;


//declare a constant variable 'num' and assign value of 0.09/2
const noiseScale = 0.09/2;

//declare function preload() to load a sound file with loadSound()
function preload (){
  river = loadSound ("river.mp3")
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(5);
  for(let i = 0; i < num; i ++) {
    particles.push(createVector(random(width), random(height)));
  }
  
  stroke('blue'); 
  clear();
  background('black'); 
}

function draw() {
   
 
 if (mouseIsPressed){
    if ( river.isPlaying() ==false){
      river.loop()
    }
  }
  
 if(mouseX <=100 & mouseY <=100){
    
    stroke('red')
    
  }else if (mouseX >=300 & mouseY >=300){
    
    stroke ('blue')    
    
  }else if(mouseX > 500){
    
    stroke ('yellow')
    strokeWeight(1.5)
    
  }else { 
     stroke ('purple')
  }

  for(let i = 0; i < num; i ++) {
    let p = particles[i];
    point(p.x, p.y);
    let n = noise(p.x * noiseScale, p.y * noiseScale, frameCount * noiseScale * noiseScale);
    let a = TAU * n;
    p.x += cos(a);
    p.y += sin(a);
    if(!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
    }
  }
}


function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}



