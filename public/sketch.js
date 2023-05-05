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

let particles = [];
const num = 200;

const noiseScale = 0.09/2;

function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(1);
  
  
  for(let i = 0; i < num; i ++) {
    particles.push(createVector(random(width), random(height)));
  }
  
  stroke(random(255),random(255),255);
 
  clear();
  background('black'); 
}

function draw() {
   
 // background('black'); 
  //background gradient testing
 

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

function mouseDragged() {
  noiseSeed(millis());
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

