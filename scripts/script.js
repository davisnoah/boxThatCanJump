//Initalizes 2D Canvas Pen
const c = document.querySelector("#c");
const ctx = c.getContext("2d");

//Defines a standard unit of measurement to make game responsive
c.width = window.innerWidth * 4 / 5;
c.height = c.width / 2;
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
  constructor (width, height, x, y, direction, color) {
    super("dynamic", width, height, x, y, color);
    this.y = c.height*2/3 - this.height;
    this.airTime = 0;
    this.direction = direction;
    this.jumpInit = false;
    this.isJumping = false;
    this.jumpPowerInit = 1.75*unit;
    this.jumpPower = this.jumpPowerInit;
    this.jumpPowerMax = 3*unit;
    this.jumpChargeTimeInit = 5;
    this.jumpChargeTime = this.jumpChargeTimeInit;
    this.speed = 0;
    this.speedCap = this.jumpPowerInit;
    this.acceleration = this.jumpPowerInit/3;
    this.mass = 1;
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
  friction: new Physics(.05*unit),
  gravity: new Physics(.25*unit),
  floor: new Structure("fixed", c.width, c.height*1/3, 0, c.height*2/3, "#333"),
  bg: new Structure("fixed", c.width, c.height*2/3 + 1*unit, 0, 0, "#222"),
  player: new Player(5*unit, 5*unit, 10*unit, null, 1, "#0ff")
}
const { friction, gravity, floor, bg, player } = game;


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


//Allows Player to Jump
const applyJump = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.y >= floor.y - comp.height && comp.jumpInit) {
      comp.isJumping = true;
      comp.speed += comp.acceleration;
      if (comp.speed > comp.speedCap) {
        comp.speed = comp.speedCap;
      }
      if (comp.jumpChargeTime > 0) {
        comp.jumpPower += (comp.jumpPowerMax - comp.jumpPowerInit)/5;
        if (comp.jumpPower > comp.jumpPowerMax) {
          comp.jumpPower = comp.jumpPowerMax;
        }
      }
    }
    if (comp.isJumping) {
      comp.y -= comp.jumpPower;
      if (comp.y <= floor.y - comp.height && comp.jumpPower > (gravity.magnitude * comp.airTime)) {
        comp.jumpInit = false;
        comp.jumpChargeTime = comp.jumpChargeTimeInit;
      }
      if (comp.y >= floor.y - comp.height) {
        if (comp.jumpInit === false) {
          comp.isJumping = false;
        }
      }
    }
    if (comp.y >= floor.y - comp.height && comp.isJumping === false) {
      comp.jumpChargeTime--;
      if (comp.jumpChargeTime < 0) {
        comp.jumpChargeTime = 0;
      }
      comp.jumpPower -= .05*unit;
      if (comp.jumpPower < comp.jumpPowerInit) {
        comp.jumpPower = comp.jumpPowerInit;
      }
    }
  }
}

//Allows player to move forward
const applyShift = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.speed) {
      comp.x += comp.speed * comp.direction;
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

//Creates a force opposing the sideways force propelling components
const applyFriction = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.y >= floor.y - comp.height) {
      if (comp.speed > 0) {
        comp.speed -= friction.magnitude;
      }
      if (comp.speed < 0) {
        comp.speed = 0;
      }
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

//Draws Player
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
  applyFriction();
  applyJump();
  applyShift();
  yCorrection();
  drawPlayer();
  
}

animate();

/* ===============================
       Game Controls Settings
   =============================== */
window.addEventListener("keydown", function (e) {
  if (e.key == "w" || e.key == "ArrowUp" || e.key == "W") {
    player.jumpInit = true;
  }
});
window.addEventListener("keydown", function (e) {
  if (e.key == "a" || e.key == "ArrowLeft" || e.key == "A") {
    player.direction = -1;
  }
});
window.addEventListener("keydown", function (e) {
  if (e.key == "d" || e.key == "ArrowRight" || e.key == "D") {
    player.direction = 1;
  }
});
window.addEventListener("keydown", function (e) {
  if (e.key == "s" || e.key == "ArrowDown" || e.key == "D") {
    player.speed = 0;
  }
})

/* ===============================
              Problems
   =============================== */
const problems = [
  'Size of game should only be changed at beginning of game',
  'Player needs to rotate 90deg after every jump',
  'Player needs to move forward after every jump',
  'Ground needs to glow when player falls',
  'There needs to be friction',
  'Walls need to bounce player off them',
  'There needs to be food',
  'Needs Improved Documentation',
  'Needs graph explaining player status',
];