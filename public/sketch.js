document.body.style.margin   = 0
document.body.style.overflow = `hidden`

let x= 0;

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
}

