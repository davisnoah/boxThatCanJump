//Initalizes 2D Canvas Pen
const c = document.querySelector("#c");
const ctx = c.getContext("2d");

//Defines a standard unit of measurement to make game responsive
const unit = c.width/100;

/* ===============================
          Class Definitions
   =============================== */

//Constructs GameComp Class
class GameComponent {
  constructor (type) {
    this.type = type;
  }
}

//Constructs Entity Class
class Structure extends GameComponent {
  constructor (type, width, height, x, y, color) {
    super(type)
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.xCenter = this.x + (this.width/2);
    this.yCenter = this.y + (this.height/2);
  }

  //Draws a Structure
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
  }
}

//Constructs Player Class
class Player extends Structure {
  constructor (type, width, height, x, y, color) {
    super(type, width, height, x, y, color);
    this.yStart = floor.y - this.height;
    this.y = this.yStart;
  }

  // Adds player glow
  addGlow() {
    ctx.shadowBlur = 2*unit;
    ctx.shadowColor = this.color;
  }
}

//Constructs Food Class
class Food extends Structure {
  constructor (type, width, height, x, y, color) {
    super(type, width, height, x, y, color);
  }
}

//Game Component initializations
const floor = new Structure("fixed", c.width, c.height*1/3, 0, c.height*2/3, "#333");
const bg = new Structure("fixed", c.width, c.height*2/3, 0, 0, "#222")
const player1 = new Player("dynamic", 5*unit, 5*unit, 10*unit, null, "#0ff");

/* ===============================
      Game Functions Definition
   =============================== */

//Clears all drawings from the Canvas
const clearCanvas = () => {
  ctx.clearRect(0, 0, c.width, c.height);
}

//Draws the floor and background
const drawMap = () => {
  bg.draw();
  floor.draw()
}

//Draws Player One
const drawPlayerOne = () => {
  player1.addGlow();
  player1.draw();
}

/* ===============================
    Game Functions Implementation 
   =============================== */

//Runs all game functions every frame.
const animate = () => {
  window.requestAnimationFrame(animate);
  
  clearCanvas();
  drawMap();
  drawPlayerOne();
  
}

animate();