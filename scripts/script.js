//Initalizes 2D Canvas Pen
const c = document.querySelector("#c");
const ctx = c.getContext("2d");

//Defines width and height of canvas
c.width = window.innerWidth * 4 / 5;
c.height = c.width / 2;

//Defines a standard unit of measurement to make game responsive
const unit = c.width / 100;


/* ===============================
          Class Definitions
   =============================== */

//Constructs GameComp Class
class GameComponent {
  constructor(type) {
    this.type = type;
  }
}

//Constructs Physics Class
class Physics extends GameComponent {
  constructor(magnitude) {
    super(["physics"]);
    this.magnitude = magnitude;
  }
}

//Constructs Entity Class
class Structure extends GameComponent {
  constructor(type, width, height, x, y, color) {
    super(type)
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.xCenter = this.x + (this.width / 2);
    this.yCenter = this.y + (this.height / 2);
  }

  //Draws a Structure
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
  }

  //Updates the coords of the center of the structure with new coords
  updateCenter() {
    this.xCenter = this.x + this.width / 2;
    this.yCenter = this.y + this.height / 2;
  }

  //Adds glow to structure
  addGlow() {
    ctx.shadowBlur = 2 * unit;
    ctx.shadowColor = this.color;
  }
}

//Constructs Player Class
class Player extends Structure {
  constructor(width, height, x, y, direction, color) {
    super(["dynamic", "consumer"], width, height, x, y, color);
    this.direction = direction;
    this.mass = 1;
    this.airTime = 0;
    this.jumpInit = false;
    this.isJumping = false;
    this.jumpPowerInit = 1.75 * unit;
    this.jumpPower = this.jumpPowerInit;
    this.jumpPowerMax = 2.5 * unit;
    this.jumpChargeTimeInit = 5;
    this.jumpChargeTime = this.jumpChargeTimeInit;
    this.speed = 0;
    this.speedCap = this.jumpPowerInit / 2;
    this.acceleration = this.jumpPowerInit / 5;
    this.rotation = 0;
    this.rotationI = 0;
    this.rotationN = 0;
    this.score = {
      value: 0,
      valueCurr: 0,
      valueSpeed: (this.value / this.valueCurr) / 30,
      isNew: null,
    };
  }
}

//Constructs Food Class
class Food extends Structure {
  constructor() {
    let width = Math.random() * 1 * unit + 1.5 * unit;
    let height = width;
    let colors = ['#0f8', '#f88', '#ff8', '#8ff', '#f8f', '#fff'];
    super(
      "fixed",
      width,
      height,
      Math.random() * (c.width - width),
      (Math.random() * 1 / 3 * c.height - height) + 1 / 3 * c.height,
      colors[Math.floor(Math.random() * colors.length)],
    )
    this.score = Math.ceil(this.width / unit);
    this.colors = colors;
    this.exists = true;
    this.spawnTimeInit = 45;
    this.spawnTime = this.spawnTimeInit;
    this.dreg = {
      counter: 0,
      counterCap: 10,
      color: "#fff",
      draw(x, y, radius) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.shadowBlur = 2.5 * unit;
        ctx.arc(x, y, radius * 0.1 * unit, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  //Randomizes the properties of the food particle (after it has been eaten)
  updateProperties() {
    this.width = Math.random() * 1 * unit + 1.5 * unit;
    this.height = this.width;
    this.x = Math.random() * (c.width - this.width);
    this.y = (Math.random() * (1 / 3) * c.height - this.height) + (1 / 3) * c.height;
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.score = Math.ceil(this.width / unit);
  }
}


/* ===============================
      Game Objects Construction
   =============================== */

//Creates game components
const game = {
  friction: new Physics(.02 * unit),
  gravity: new Physics(.25 * unit),
  floor: new Structure(["fixed"], c.width, c.height * 1 / 3, 0, c.height * 2 / 3, "#333"),
  bg: new Structure(["fixed"], c.width, c.height * 2 / 3 + 1 * unit, 0, 0, "#222"),
  player: new Player(5 * unit, 5 * unit, 10 * unit, 8 * unit, 1, "#0ff"),
  food: [],
}

//Extracts game components from game
const { friction, gravity, floor, bg, player, food } = game;

//Creates individual food components
let numFood = 20;
for (let i = 1; i <= numFood; i++) {
  food.push(new Food());
}

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

//Keeps up with how long an object has been in the air.
const calcAirTime = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.type) {
      if (comp.type.includes("dynamic")) {
        if (comp.y < floor.y - comp.height) {
          comp.airTime++;
        } else {
          comp.airTime = 0;
        }
      }
    }
  }
}

//Creates a downward pull on dynamic structures
const applyGravity = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.type) {
      if (comp.type.includes("dynamic") && comp.y < floor.y - comp.height) {
        comp.y += gravity.magnitude * comp.airTime;
      }
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
        comp.jumpPower += (comp.jumpPowerMax - comp.jumpPowerInit) / 5;
        if (comp.jumpPower > comp.jumpPowerMax) {
          comp.jumpPower = comp.jumpPowerMax;
        }
      }

      //Declares simulation variables
      let simPow = comp.jumpPower;
      let simY = 0;
      let simG = gravity.magnitude;
      let simAir = -1;

      //Runs a simulation to predict the airTime of the box before it hits the ground
      do {
        simAir++;
        simY -= simPow;
        simY += simG * simAir;
      } while (simY < 0);
      player.rotationI = simAir;
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
        comp.rotationN += comp.direction;
      }
    }
    if (comp.y >= floor.y - comp.height && comp.isJumping === false) {
      comp.jumpChargeTime--;
      if (comp.jumpChargeTime < 0) {
        comp.jumpChargeTime = 0;
      }
      if (comp.jumpChargeTime === 0) {
        comp.jumpPower -= .05 * unit;
        if (comp.jumpPower < comp.jumpPowerInit) {
          comp.jumpPower = comp.jumpPowerInit;
        }
      }
    }
  }
}

//Allows dynamic structures to move forward
const applyShift = () => {
  for (let comp in game) {
    comp = game[comp];
    if (comp.speed) {
      comp.x += comp.speed * comp.direction;
    }
  }
}

//Allows dynamic structures to get hit off wall
const applyWallHitBox = () => {
  for (let comp in game) {
    comp = game[comp];
    let { type, x, direction, width } = comp;
    if (type) {
      if (type.includes('dynamic')) {
        if (x < 0 && direction === -1) {
          comp.x = 0;
          comp.direction = 1;
        }
        if (x > c.width - width && direction === 1) {
          comp.x = c.width - width;
          comp.direction = -1;
        }
      }
    }
  }
}

//Prevents structures from clipping through the ground
const applyFloorHitBox = () => {
  for (let comp in game) {
    comp = game[comp];
    let { type, y, height } = comp;
    if (type) {
      if (type.includes("dynamic") && y > floor.y - height) {
        comp.y = floor.y - height;
      }
    }
  }
}

//Draws Player
const drawPlayer = () => {
  player.updateCenter();
  player.addGlow();

  //Calculates the degree by which player should be rotated
  if (player.y < floor.y - player.height) {
    player.rotation += 90 / player.rotationI;
  } else {
    player.rotation = 90 * player.rotationN;
  }

  //Appropriately rotates the player
  ctx.translate(player.xCenter, player.yCenter);
  ctx.rotate(player.rotation * player.direction * (Math.PI / 180));
  ctx.translate(-player.xCenter, -player.yCenter);

  player.draw();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

//Allows food to be eaten
const applyFoodEdibility = () => {
  for (let food in game.food) {
    food = game.food[food];
    for (let comp in game) {
      comp = game[comp];
      if (comp.type) {
        if (comp.type.includes("consumer")) {
          if (comp.x <= food.x + food.width &&
            comp.x + comp.width >= food.x &&
            comp.y <= food.y + food.height &&
            comp.y + comp.height >= food.y) {
            food.exists = false;
            comp.score.value += food.score;
            food.score = 0;
            food.spawnTime = food.spawnTimeInit;
          }
        }
      }
    }
  }
}

//Draws the player's score
const drawScore = () => {
  const score = game.player.score;
  score.valueSpeed = (score.value - score.valueCurr) / 30;
  if (score.valueSpeed < game.food[0].score / 30) {
    score.valueSpeed = game.food[0].score / 30;
  }
  score.valueCurr += score.valueSpeed;
  if (score.valueCurr > score.value) {
    score.valueCurr = score.value;
  }
  ctx.beginPath();
  ctx.fillStyle = player.color;
  ctx.font = `normal 300 ${5 * unit}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${parseInt(score.valueCurr)} Points`, c.width / 2, c.width / 13.33333);
  ctx.closePath();
}

//Draws food
const drawFood = () => {
  for (let food in game.food) {
    food = game.food[food];
    if (food.spawnTime === 0) {
      food.spawnTime = food.spawnTimeInit;
      food.exists = true;
      food.dreg.counter = 0;
      food.updateProperties();
    }
    if (food.exists) {
      food.addGlow();
      food.draw();
    }
    if (food.exists === false) {
      food.dreg.counter++;
      if (food.spawnTime > 0) {
        food.spawnTime--;
      }
      if (food.dreg.counter <= food.dreg.counterCap) {
        food.updateCenter();
        food.dreg.draw(food.xCenter, food.yCenter, food.dreg.counter);
      }
    }
  }
}

/* ===============================
    Game Functions Implementation 
   =============================== */

//Calls all game functions every frame.
const animate = () => {

  window.requestAnimationFrame(animate);

  clearCanvas();
  calcAirTime();
  applyGravity();
  applyFriction();
  applyJump();
  applyShift();
  applyWallHitBox();
  applyFloorHitBox();
  applyFoodEdibility();
  drawMap();
  drawScore();
  drawFood();
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

  if (e.key == "a" || e.key == "ArrowLeft" || e.key == "A") {
    player.direction = -1;
  }

  if (e.key == "s" || e.key == "ArrowDown" || e.key == "S") {
    player.speed = 0;
    player.jumpPower = player.jumpPowerInit;
    player.jumpChargeTime = 0;
  }

  if (e.key == "d" || e.key == "ArrowRight" || e.key == "D") {
    player.direction = 1;
  }
});