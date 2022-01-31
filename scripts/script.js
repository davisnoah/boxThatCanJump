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

//Constructs Physics Class
class Physics extends GameComponent {
  constructor (magnitude) {
    super("physics");
    this.magnitude = magnitude;
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
  constructor (width, height, x, y, color) {
    super("dynamic", width, height, x, y, color);
    this.y = c.height*2/3 - this.height;
    this.jumpInit = false;
    this.isJumping = false;
    this.jumpReady = false;
    this.jumpPower = 3*unit;
    this.jumpI = 0; 
    this.airTime = 0;
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


/* ===============================
      Game Objects Construction
   =============================== */

//Creates game components
const game = {
  gravity: new Physics(.25*unit),
  floor: new Structure("fixed", c.width, c.height*1/3, 0, c.height*2/3, "#333"),
  bg: new Structure("fixed", c.width, c.height*2/3 + 1*unit, 0, 0, "#222"),
  player: new Player(5*unit, 5*unit, 10*unit, null, "#0ff")
}
const { gravity, floor, bg, player } = game;


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
  floor.draw();
}

/*
this.jumpInit = false;
this.isJumping = false;
this.jumpReady = true;
this.jumpPower = 3*unit;
this.jumpI = 0; 

this.airTime = 0;
*/

//Allows Player to Jump
const applyJump = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.jumpReady) {
      if (comp.jumpPower > gravity.magnitude * comp.airTime) {
        comp.jumpReady = false;
        if (comp.y === floor.y - comp.height) {
          comp.jumpReady = true;
        }
      }
      //test
      console.log(comp.jumpPower, gravity.magnitude * comp.airTime, comp.jumpReady);
      if (comp.y === floor.y - comp.height) {
        comp.jumpReady = false;
        comp.isJumping = true;
      }
    }
    if (comp.isJumping) {
      comp.y -= comp.jumpPower;
      comp.jumpI++;
      if (comp.y === floor.y - comp.height) {
        comp.jumpI = 0;
        comp.isJumping = false;
      }
    }
  }
}

//Keeps up with how long an object has been in the air.
const calcAirTime = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.type === "dynamic") {
      if (comp.y < floor.y - comp.height) {
        comp.airTime++;
      } else {
        comp.airTime = 0;
      }
    }
  }
}

//Creates a downward pull on dynamic structures
const applyGravity = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.type === "dynamic" && comp.y < floor.y - comp.height) {
      comp.y += gravity.magnitude * comp.airTime;
    }
  }
}

//Prevents stcuctures from clipping through the ground
const yCorrection = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.type === "dynamic" && comp.y > floor.y - comp.height) {
      comp.y = floor.y - comp.height;
    }
  }
}

//Draws Player One
const drawPlayer = () => {
  player.addGlow();
  player.draw();
}


/* ===============================
    Game Functions Implementation 
   =============================== */
   
//Calls all game functions every frame.
const animate = () => {

  window.requestAnimationFrame(animate);
  
  clearCanvas();
  drawMap();
  calcAirTime();
  applyGravity();
  applyJump();
  yCorrection();
  drawPlayer();
  
}

animate();

//CONTROLS
window.addEventListener("keydown", function (e) {
  if (e.key == "w" || e.key == "ArrowUp" || e.key == "W") {
    player.jumpReady = true;
  }
})
/* ===============================
              Problems
   =============================== */
const problems = [
  'else???',
  'Player\'s jumpPower should build up like mario',
  'Player should only be able to jump while on the ground',
  'Player needs to rotate 90deg after every jump',
  'Player needs to move forward after every jump',
  'Player needs to be queued to jump if g is greater than jumpPower and player wants to jump',
  'Ground needs to glow when player falls',
  'There needs to be friction',
  'Walls need to bounce player off them',
  'There needs to be food',
  'Needs Improved Documentation',
];