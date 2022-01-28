//()
const c = document.querySelector("#c");
const ctx = c.getContext("2d");
c.width = 1000;
c.height = c.width/2;

class Box {
  constructor(width) {
    this.width = c.width/24 * width; //
    this.height = this.width; //
    this.groundY = 2*c.height/3 - this.height; //
    this.y = this.groundY; //
    this.x = c.width/12;//
    this.vStart = 0;//
    this.v = this.vStart;//
  }
} 

const box = new Box(1);

var direction = 1;
var obXCenter = box.x+(box.width/2);
var obYCenter = box.y+(box.height/2);
var score = 0;
var lOrR = 1;
var groundColor = "#333"
var scale = c.width/600;

window.addEventListener("keydown", function (e) {
  if (e.key == "w" || e.key == "ArrowUp" || e.key == "W") {
    jumpQue = 1;
  }
  
  if (e.key == "a" || e.key == "ArrowLeft" || e.key == "A") {
    left();
  }
  
  if (e.key == "s" || e.key == "ArrowDown" || e.key == "S") {
    slower(v*direction);
  }
  
  if (e.key == "d" || e.key == "ArrowRight" || e.key == "D") {
     right();
  }
}, false);

function animate() {
  window.requestAnimationFrame(animate);
  //Delete All
  ctx.clearRect(0, 0, c.width, c.height);
  wallHitBox();
  drawMap();
  createFood();
  drawOb();
  obEatFd();
  stats();
  
  /*//Auto Jump
  jumpQue = 1;*/
  
  //Friction
  slower((1/15));
  //Enable Jumping
  jumpStart();
  jump();
  
  //Fix Reverse Speed
  if (box.v*direction < 0) {
    box.v = 0;
  }
}
function wallHitBox() {
  //Hit Wall
  if (box.x + box.width >= c.width && box.v > 0) {
    box.v = -box.v;
    direction = -direction;
    lOrR = 0;
    if (jumpSeq == 0) {
      slower(1);
    }
  }
  
  if (box.x <= 0 && box.v < 0) {
    box.v = -box.v;
    direction = -direction;
    lOrR = 1;
    if (jumpSeq == 0) {
      slower(1);
    }
  }
}

function drawOb() {  
  //object
  box.x += box.v;
  ctx.shadowBlur = 12*scale;
  ctx.shadowColor = "cyan";
  ctx.fillStyle = "cyan";
  obXCenter = box.x+(box.width/2);
  obYCenter = box.y+(box.height/2);
  if (jumpSeq == 1 || jumpSeq == 2) {
    ctx.translate(obXCenter, obYCenter);
    if (lOrR == 1) {
      ctx.rotate(((90*(jumpVIncrement/jumpVStart)/2)*Math.PI/180)*jumpRotateCounter);
      ctx.translate(-obXCenter, -obYCenter);
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (lOrR == 0) {
       ctx.rotate(((-90*(jumpVIncrement/jumpVStart)/2)*Math.PI/180)*jumpRotateCounter);
      ctx.translate(-obXCenter, -obYCenter);
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  } else {
    ctx.fillRect(box.x, box.y, box.width, box.height);
  }
}

var groundY = 2*c.height/3;
var brightGround = 0;
function drawMap() {
var obBlastRange = box.width;
  //back
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, c.width, c.height);
  //ground
  ctx.shadowColor = "cyan"
  ctx.fillStyle = groundColor;
  if (brightGround > 0) {
    ctx.shadowBlur = obBlastRange/4;
    ctx.fillRect(obLastLandX-obBlastRange, obLastLandY+box.height, box.width+obBlastRange*2, 50);
    brightGround--;
  }
  ctx.shadowBlur = 0;
  ctx.fillRect(0, groundY, c.width, c.height);
}

//Food Eat Variables
var fdEtFxCounter1 = 0;
var fdEtFxCounter2 = 0;
var fdEtFxCounter3 = 0;
var fdEtFxCounter4 = 0;
var fdEtFxCounter5 = 0;

var fdBlastCounter1 = 0;
var fdBlastCounter2 = 0;
var fdBlastCounter3 = 0;
var fdBlastCounter4 = 0;
var fdBlastCounter5 = 0;

var edibility = 0.75;

//Food Variables
var fd1 = 0;
var fd2 = 0;
var fd3 = 0;
var fd4 = 0;
var fd5 = 0;

var fdHeight5 = 1;
var fdWidth5 = 1;
var fdX5 = 0;
var fdY5 = 0;

var fdHeight4 = 1;
var fdWidth4 = 1;
var fdX4 = 0;
var fdY4 = 0;

var fdHeight3 = 1;
var fdWidth3 = 1;
var fdX3 = 0;
var fdY3 = 0;

var fdHeight2 = 1;
var fdWidth2 = 1;
var fdX2 = 0;
var fdY2 = 0;

var fdHeight1 = 1;
var fdWidth1 = 1;
var fdX1 = 0;
var fdY1 = 0;

var fdSpawnReset = 30;
var fdSpawnCounter1 = 0;
var fdSpawnCounter2 = 0;
var fdSpawnCounter3 = 0;
var fdSpawnCounter4 = 0;
var fdSpawnCounter5 = 0;

var fdLighter1 = 0;
var fdLighter2 = 0;
var fdLighter3 = 0;
var fdLighter4 = 0;
var fdLighter5 = 0;

var fdCircleX1 = 0;
var fdCircleY1 = 0;
var fdCircleX2 = 0;
var fdCircleY2 = 0;
var fdCircleX3 = 0;
var fdCircleY3 = 0;
var fdCircleX4 = 0;
var fdCircleY4 = 0;
var fdCircleX5 = 0;
var fdCircleY5 = 0;

function createFood() {
  var fdCreated = 0;
  var fdHeight = (Math.random()*5/600*c.width)+11/600*c.width;
  var fdWidth = fdHeight;
  var fdX = Math.random()*(c.width-fdWidth);
  var fdY = Math.random()*((groundY-fdHeight)-maxHeight)+maxHeight;
  fdSpawnCounter1--;
  fdSpawnCounter2--;
  fdSpawnCounter3--;
  fdSpawnCounter4--;
  fdSpawnCounter5--;
  
  if (fd1 == 0 && fdCreated == 0 & fdEtFxCounter1 == 0) {
    fdHeight1 = fdHeight;
    fdWidth1 = fdWidth;
    fdX1 = fdX;
    fdY1 = fdY;
    fd1 = 1;
    fdCreated = 1;
  }
  
  if (fd2 == 0 && fdCreated == 0 & fdEtFxCounter2 == 0) {
    fdHeight2 = fdHeight;
    fdWidth2 = fdWidth;
    fdX2 = fdX;
    fdY2 = fdY;
    fd2 = 1;
    fdCreated = 1;
  }
  
  if (fd3 == 0 && fdCreated == 0 & fdEtFxCounter3 == 0) {
    fdHeight3 = fdHeight;
    fdWidth3 = fdWidth;
    fdX3 = fdX;
    fdY3 = fdY;
    fd3 = 1;
    fdCreated = 1;
  }
  
  if (fd4 == 0 && fdCreated == 0 & fdEtFxCounter4 == 0) {
    fdHeight4 = fdHeight;
    fdWidth4 = fdWidth;
    fdX4 = fdX;
    fdY4 = fdY;
    fd4 = 1;
    fdCreated = 1;
  } 
  if (fd5 == 0 && fdCreated == 0 & fdEtFxCounter5 == 0) {
    fdHeight5 = fdHeight;
    fdWidth5 = fdWidth;
    fdX5 = fdX;
    fdY5 = fdY;
    fd5 = 1;
    fdCreated = 1;
  }
  if (fdSpawnCounter1 > 1) {
    fdLighter1 = 0;
  }
  if (fdSpawnCounter1 < 1) {
      ctx.shadowColor = "rgba(0, 255, 0, 255)";
      ctx.shadowBlur = 10*scale;
    if (fdLighter1 == 0) {
      ctx.fillStyle = "rgb(" + String(255+fdSpawnCounter1) + ", 255, " + String(255+fdSpawnCounter1) + ")";
      if (fdSpawnCounter1 <= -69) {
        fdLighter1 = 1;
      }
    } else if (fdLighter1 == 1) {
      ctx.fillStyle = "rgb(" + String(186-fdSpawnCounter1-70) + ", 255, " + String(186-fdSpawnCounter1-70) + ")";
      if (fdSpawnCounter1 <= -139) {
        fdLighter1 = 0;
        fdSpawnCounter1 = 0;
      }
    }
    ctx.fillRect(fdX1, fdY1, fdWidth1, fdHeight1);
  }
  if (fdSpawnCounter2 > 1) {
    fdLighter2 = 0;
  }
  if (fdSpawnCounter2 < 1) {
    //violet
    ctx.shadowColor = "rgba(255, 0, 255, 255)";
    ctx.shadowBlur = 10*scale;
    if (fdLighter2 == 0) {
      ctx.fillStyle = "rgb(255, " + String(255+fdSpawnCounter2) + ", 255)";
      if (fdSpawnCounter2 <= -69) {
        fdLighter2 = 1;
      }
    } else if (fdLighter2 == 1) {
      ctx.fillStyle = "rgb(255, " + String(186-fdSpawnCounter2-70) + ", 255)";
      if (fdSpawnCounter2 <= -139) {
        fdLighter2 = 0;
        fdSpawnCounter2 = 0;
      }
    }
    ctx.fillRect(fdX2, fdY2, fdWidth2, fdHeight2);
  }
  if (fdSpawnCounter3 > 1) {
    fdLighter3 = 0;
  }
  if (fdSpawnCounter3 < 1) {
    //blue
    ctx.shadowColor = "rgba(0, 255, 255, 255)";
    ctx.shadowBlur = 10*scale;
    if (fdLighter3 == 0) {
      ctx.fillStyle = "rgb(" + String(255+fdSpawnCounter3) + ", 255, 255)";
      if (fdSpawnCounter3 <= -69) {
        fdLighter3 = 1;
      }
    } else if (fdLighter3 == 1) {
      ctx.fillStyle = "rgb(" + String(186-fdSpawnCounter3-70) + ", 255,255)";
      if (fdSpawnCounter3 <= -139) {
        fdLighter3 = 0;
        fdSpawnCounter3 = 0;
      }
    }
    ctx.fillRect(fdX3, fdY3, fdWidth3, fdHeight3);
  }
  if (fdSpawnCounter4 > 1) {
    fdLighter4 = 0;
  }
  if (fdSpawnCounter4 < 1) {
    //yellow
    ctx.shadowColor = "rgba(255, 255, 0, 255)";
    ctx.shadowBlur = 10*scale;
    if (fdLighter4 == 0) {
      ctx.fillStyle = "rgb(255, 255, " + String(255+fdSpawnCounter4) + ")";
      if (fdSpawnCounter4 <= -69) {
        fdLighter4 = 1;
      }
    } else if (fdLighter4 == 1) {
      ctx.fillStyle = "rgb(255, 255, " + String(186-fdSpawnCounter4-70) + ")";
      if (fdSpawnCounter4 <= -139) {
        fdLighter4 = 0;
        fdSpawnCounter4 = 0;
      }
    }
    ctx.fillRect(fdX4, fdY4, fdWidth4, fdHeight4);
  }
  if (fdSpawnCounter5 > 1) {
    fdLighter5 = 0;
  }
  if (fdSpawnCounter5 < 1) {
    //red
    ctx.shadowColor = "rgba(255, 30, 30, 255)";
    ctx.shadowBlur = 10*scale;
    if (fdLighter5 == 0) {
      ctx.fillStyle = "rgb(255, " + String(255+fdSpawnCounter5) + ", " + String(255+fdSpawnCounter5) + ")";
      if (fdSpawnCounter5 <= -69) {
        fdLighter5 = 1;
      }
    } else if (fdLighter5 == 1) {
      ctx.fillStyle = "rgb(255, " + String(186-fdSpawnCounter5-70) + ", " + String(186-fdSpawnCounter5-70) + ")";
      if (fdSpawnCounter5 <= -139) {
        fdLighter5 = 0;
        fdSpawnCounter5 = 0;
      }
    }
    ctx.fillRect(fdX5, fdY5, fdWidth5, fdHeight5);
  }
}

function obEatFd() {
var obLeft = box.x;
var obRight = box.x + box.width;
var obTop = box.y;
var obBottom = box.y + box.height;

var fdCenterX1 = fdX1 + fdWidth1/2;
var fdCenterY1 = fdY1 + fdHeight1/2;
var fdCenterX2 = fdX2 + fdWidth2/2;
var fdCenterY2 = fdY2 + fdHeight2/2;
var fdCenterX3 = fdX3 + fdWidth3/2;
var fdCenterY3 = fdY3 + fdHeight3/2;
var fdCenterX4 = fdX4 + fdWidth4/2;
var fdCenterY4 = fdY4 + fdHeight4/2;
var fdCenterX5 = fdX5 + fdWidth5/2;
var fdCenterY5 = fdY5 + fdHeight5/2;

  if ((((obLeft <= fdX1 + fdWidth1*edibility) && (obRight >= fdX1 + fdWidth1*(1-edibility))) && ((obTop <= fdY1+fdHeight1*edibility) && (obBottom >= fdY1+fdHeight1*(1-edibility))))) {
    fd1 = 0;
    score += fdHeight1/scale;
    fdSpawnCounter1 = fdSpawnReset;
    fdEtFxCounter1 += 1;
    fdCircleX1 = fdX1+fdWidth1/2;
    fdCircleY1 = fdY1+fdHeight1/2;
    fdX1 = 0;
    fdY1 = 0;
  }
  if ((((obLeft <= fdX2 + fdWidth2*edibility) && (obRight >= fdX2 + fdWidth2*(1-edibility))) && ((obTop <= fdY2+fdHeight2*edibility) && (obBottom >= fdY2+fdHeight2*(1-edibility))))) {
    fd2 = 0;
    score += fdHeight2/scale;
    fdSpawnCounter2 = fdSpawnReset;
    fdEtFxCounter2 += 1;
    fdCircleX2 = fdX2+fdWidth2/2;
    fdCircleY2 = fdY2+fdHeight2/2;
    fdX2 = 0;
    fdY2 = 0;
  }
  if ((((obLeft <= fdX3 + fdWidth3*edibility) && (obRight >= fdX3 + fdWidth3*(1-edibility))) && ((obTop <= fdY3+fdHeight3*edibility) && (obBottom >= fdY3+fdHeight3*(1-edibility))))) {
    fd3 = 0;
    score += fdHeight3/scale;
    fdSpawnCounter3 = fdSpawnReset;
    fdEtFxCounter3 += 1;
    fdCircleX3 = fdX3+fdWidth3/2;
    fdCircleY3 = fdY3+fdHeight3/2;
    fdX3 = 0;
    fdY3 = 0;
  }
  if ((((obLeft <= fdX4 + fdWidth4*edibility) && (obRight >= fdX4 + fdWidth4*(1-edibility))) && ((obTop <= fdY4+fdHeight4*edibility) && (obBottom >= fdY4+fdHeight4*(1-edibility))))) {
    fd4 = 0;
    score += fdHeight4/scale;
    fdSpawnCounter4 = fdSpawnReset;
    fdEtFxCounter4 += 1;
    fdCircleX4 = fdX4+fdWidth4/2;
    fdCircleY4 = fdY4+fdHeight4/2;
    fdX4 = 0;
    fdY4 = 0;
  }
  if ((((obLeft <= fdX5 + fdWidth5*edibility) && (obRight >= fdX5 + fdWidth5*(1-edibility))) && ((obTop <= fdY5+fdHeight5*edibility) && (obBottom >= fdY5+fdHeight5*(1-edibility))))) {
    fd5 = 0;
    score += fdHeight5/scale;
    fdSpawnCounter5 = fdSpawnReset;
    fdEtFxCounter5 += 1;
    fdCircleX5 = fdX5+fdWidth5/2;
    fdCircleY5 = fdY5+fdHeight5/2;
    fdX5 = 0;
    fdY5 = 0;
  }
  if (fdEtFxCounter1 > 0) {
    fdBlastCounter1++;
    var fdBlastGrd1 = ctx.createRadialGradient(fdCircleX1, fdCircleY1, 10*scale, fdCircleX1, fdCircleY1, ((9/1.6)**2)*scale);
    fdBlastGrd1.addColorStop(0, "rgba(255, 255, 255, 127)");
    fdBlastGrd1.addColorStop(1, "rgba(195, 255, 255, 127)");
    ctx.beginPath();
    ctx.shadowBlur = 15*scale;
    ctx.strokeStyle = fdBlastGrd1;
    ctx.arc(fdCircleX1, fdCircleY1, ((((fdEtFxCounter1/3)/1.6)**2)*scale), 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    fdEtFxCounter1++;
    if (fdEtFxCounter1 > 9) {
      fdEtFxCounter1 = 0;
      fdBlastCounter1 = 0;
    }
  }
  if (fdEtFxCounter2 > 0) {
    fdBlastCounter2++;
    var fdBlastGrd2 = ctx.createRadialGradient(fdCircleX2, fdCircleY2, 10*scale, fdCircleX2, fdCircleY2, ((9/1.6)**2)*scale);
    fdBlastGrd2.addColorStop(0, "rgba(255, 255, 255, 127)");
    fdBlastGrd2.addColorStop(1, "rgba(195, 255, 255, 127)");
    ctx.beginPath();
    ctx.shadowBlur = 15*scale;
    ctx.strokeStyle = fdBlastGrd2;
    ctx.arc(fdCircleX2, fdCircleY2, ((((fdEtFxCounter2/3)/1.6)**2)*scale), 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    fdEtFxCounter2++;
    if (fdEtFxCounter2 > 9) {
      fdEtFxCounter2 = 0;
      fdBlastCounter2 = 0;
    }
  }
  if (fdEtFxCounter3 > 0) {
    fdBlastCounter3++;
    var fdBlastGrd3 = ctx.createRadialGradient(fdCircleX3, fdCircleY3, 10*scale, fdCircleX3, fdCircleY3, ((9/1.6)**2)*scale);
    fdBlastGrd3.addColorStop(0, "rgba(255, 255, 255, 127)");
    fdBlastGrd3.addColorStop(1, "rgba(195, 255, 255, 127)");
    ctx.beginPath();
    ctx.shadowBlur = 15*scale;
    ctx.strokeStyle = fdBlastGrd3;
    ctx.arc(fdCircleX3, fdCircleY3, ((((fdEtFxCounter3/3)/1.6)**2)*scale), 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    fdEtFxCounter3++;
    if (fdEtFxCounter3 > 9) {
      fdEtFxCounter3 = 0;
      fdBlastCounter3 = 0;
    }
  }
  
  if (fdEtFxCounter4 > 0) {
    fdBlastCounter4++;
    var fdBlastGrd4 = ctx.createRadialGradient(fdCircleX4, fdCircleY4, 10*scale, fdCircleX4, fdCircleY4, ((9/1.6)**2)*scale);
    fdBlastGrd4.addColorStop(0, "rgba(255, 255, 255, 127)");
    fdBlastGrd4.addColorStop(1, "rgba(195, 255, 255, 127)");
    ctx.beginPath();
    ctx.shadowBlur = 15*scale;
    ctx.strokeStyle = fdBlastGrd4;
    ctx.arc(fdCircleX4, fdCircleY4, ((((fdEtFxCounter4/3)/1.6)**2)*scale), 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    fdEtFxCounter4++;
    if (fdEtFxCounter4 > 9) {
      fdEtFxCounter4 = 0;
      fdBlastCounter4 = 0;
    }
  }
  if (fdEtFxCounter5 > 0) {
    fdBlastCounter5++;
    var fdBlastGrd5 = ctx.createRadialGradient(fdCircleX5, fdCircleY5, 10*scale, fdCircleX5, fdCircleY5,( (9/1.6)**2)*scale);
    fdBlastGrd5.addColorStop(0, "rgba(255, 255, 255, 127)");
    fdBlastGrd5.addColorStop(1, "rgba(195, 255, 255, 127)");
    ctx.beginPath();
    ctx.shadowBlur = 15*scale;
    ctx.strokeStyle = fdBlastGrd5;
    ctx.arc(fdCircleX5, fdCircleY5, ((((fdEtFxCounter5/3)/1.6)**2)*scale), 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    fdEtFxCounter5++;
    if (fdEtFxCounter5 > 9) {
      fdEtFxCounter5 = 0;
      fdBlastCounter5 = 0;
    }
  }
}
var scoreCounter = 0;
function stats() {
  /*//Speed
  ctx.fillStyle = "white"
  ctx.font = "normal 200 15px Arial"
  ctx.shadowBlur = 0;
  var speedMeterWidth = ctx.measureText("Speed = " + String((v*direction*60/1000).toFixed(1)) + "Kpx/s").width;
  ctx.textAlign = "left";
  ctx.fillText("Speed = " + String((v*direction*60/1000).toFixed(1)) + "Kpx/s", 595-speedMeterWidth, 295);*/
  //Score
  var scoreCounterIncrement = (score - scoreCounter)/30;
  if (scoreCounterIncrement < 0.3) {
    scoreCounterIncrement = 0.3;
  }
  scoreCounter += scoreCounterIncrement;
  if (scoreCounter > score) {
    scoreCounter = score;
  }
  ctx.fillStyle = "cyan";
  ctx.font = "normal 300 " + String(c.width/20) + "px Arial";
  ctx.textAlign = "center";
  ctx.fillText(String(parseInt(scoreCounter)) + " Points", c.width/2, c.width/13.3333);
}

//Jump Variables
var jumpSeq = 0;
var jumpVStart = box.height/2.2727;
var jumpVIncrement = jumpVStart/10;
var jumpV = jumpVStart;
var jumpQue = 0;
var jumpRotateCounter = 0;

var obLastLandX = 0;
var obLastLandY = 0;
//Fake Jump Variables
var jumpVStartF = jumpVStart;
var jumpVIncrementF = jumpVIncrement;
var jumpVF = jumpV;

//Max Height Calculation
var maxHeight = box.y;
while (jumpVF > 0) {
  maxHeight -= jumpVF;
  jumpVF -= jumpVIncrementF;
}

function jumpStart() {
  if (jumpSeq == 1 && jumpQue == 1) {
    jumpQue = 0;
  }
  if (jumpSeq == 0 && jumpQue == 1) {
    jumpQue = 0;
    jumpSeq = 1;
    jump();
  }
}

function jump() {
  if (jumpSeq == 1) {
    if (jumpV == jumpVStart) {
      faster(2.1);
    }
    box.y -= jumpV;
    jumpV -= jumpVIncrement;
    jumpRotateCounter++;
    if (jumpV < 0) {
      jumpV = 0;
    }
    if (jumpV == 0) {
      jumpSeq = 2;
    }
  }
  if (jumpSeq == 2) {
    box.y += jumpV;
    jumpV += jumpVIncrement;
    jumpRotateCounter++;
    if (box.y > box.groundY) {
      box.y = box.groundY;
    }
    if (box.y == box.groundY) {
      jumpSeq = 0;
      jumpV = jumpVStart;
      jumpRotateCounter = 0;
      obLastLandX = box.x;
      obLastLandY = box.y;
      brightGround = 5;
    }
  }
}

function slower(degree) {
  box.v = (box.v - (degree*box.height/25)*direction);
  if (box.v*direction < 0) {
    box.v = 0;
  }
}

var maxSpeed = 7*scale;

function faster(degree) {
  box.v = (box.v + (degree*box.height/25)*direction);
  if (box.v*direction > maxSpeed) {
    box.v = maxSpeed*direction;
  }
}

function left() {
  if (lOrR == 1 && box.v >= 0) {
    box.v = -box.v;
    direction = -direction;
    lOrR = 0;
    slower(1);
  }
}

function right() {
  if (lOrR == 0 && box.v <= 0) {
    box.v = -box.v;
    direction = -direction;
    lOrR = 1;
    slower(1);
  }
}
animate();