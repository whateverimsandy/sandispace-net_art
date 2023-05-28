document.body.style.margin   = 0
document.body.style.overflow = `hidden`

 
let yoff = 0;
let shape;
let zoff = 0;
let extraCanvas;
let audio;
const flock = [];

function preload () {
  audio = loadSound ('sadaudio.mp3');
}


function setup () {
  createCanvas (innerWidth, innerHeight);
  extraCanvas = createGraphics(innerWidth, innerHeight);
  extraCanvas.clear();
  shape = new waver();
  for (let i = 0; i < 200; i++) {
    flock.push(new Boid());
  }
   
}


function draw() {
  background('black');  
  myLoop();
  image(extraCanvas, 0, 0)  
  fly();
  myMonarch();  

  if (mouseIsPressed){
    if (audio.isPlaying() ==false){
      audio.loop()
    }
  } 
}

function myMonarch(){   
    translate(width / 2, height / 2);
	stroke(255,50);
	fill(random(255), 50);
	strokeWeight(2);

	let da = PI / 200;
	let dx = 0.09;
	let xoff = 0;
	beginShape();
	for (let a = 0; a <= TWO_PI; a += da) {
		let n = noise(xoff, yoff);
		let r = sin(2 * a) * map(n, 0, 1, 100, 200);
		let x = r * cos(a);
		let y = r * sin(a);
		if (a < PI) {
			xoff += dx;
		} else {
			xoff -= dx;
		}
		
		vertex(x, y);
	}
	endShape();

	yoff += 0.01;
} 



function myLoop(){
 
  shape.make();
  
  push();
  extraCanvas.stroke(25,255);
  extraCanvas.strokeWeight(5);
  extraCanvas.fill(3,255);
  
  let ps = map (noise (frameCount*0.001),0,1,0.1,0.5);
  
  extraCanvas.circle(width/2,height/2,height*ps);
  extraCanvas.noFill();
  extraCanvas.noStroke();
  extraCanvas.circle(width/2,height/2,height*1.15);
  pop(); 
  
}

function waver() {

  this.x = 0;
  this.y = 0;
  this.yoff = 0;
  this.s = 0;
  this.len = height*0.78;
  this.theta = 0;
  this.ts = 0.01;

  this.r = random(255); 
  this.g = random(255);
  this.b =255; 
   
   
  this.make = function(){

  let xoff = 0;

  this.s = map (extraCanvas.noise (frameCount * 0.5), 0, 1, 10, 75);

  this.theta += this.ts;
    
  if (this.theta > 1){
    this.theta = 0;
    this.colorer();
  }
    
  extraCanvas.push();
  extraCanvas.translate(width/2,height/2);
  extraCanvas.rotate(TWO_PI*this.theta);
  extraCanvas.stroke(this.r,this.g,this.b,75);
  extraCanvas.strokeWeight(7);
  extraCanvas.noFill();

  extraCanvas.beginShape();

    let sz = map(noise(frameCount*0.1),0,1,10,this.len);
    let rgap = map(noise(frameCount*0.01),0,1,3,15);
    for (let x = 0; x < sz; x += rgap){
      this.y = map(noise(xoff,this.yoff),0,1, -this.s,this.s);
      extraCanvas.vertex(x,this.y);
      xoff += 0.05;
    }
 
    extraCanvas.endShape();
    extraCanvas.pop();
    extraCanvas.push();
    extraCanvas.translate(width/2,height/2);
    extraCanvas.rotate(-TWO_PI*this.theta);
    extraCanvas.stroke(0,200);

    extraCanvas.strokeWeight(5);
    extraCanvas.noFill();
    extraCanvas.beginShape();
    
    for (let x = 0; x < sz; x += rgap){
      this.y = map(noise(xoff,this.yoff),0,1,-this.s,this.s);
      extraCanvas.vertex(x,this.y);
      xoff += 0.05;
    }

    this.yoff += 0.01;
    
   
    extraCanvas.endShape();
    
    
    extraCanvas.pop();
  } 
  
 this.colorer = function () {
    this.r += 24;
    if (this.r > 255) {
      this.r = 0;
      this.g += 24;
      if (this.g > 255) {
        this.g = 0;
        this.b += 24;
        if (this.b > 255){
          this.b = 0; }
      }
    }
  }   
}



function fly(){
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
   boid.show();
  }  

}

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 5;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 50;
   let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

 flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);


    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  } 

 update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }
  show() {
   strokeWeight(random(6,10));
    stroke(random(255),50);
    point(this.position.x, this.position.y);
  }
}

