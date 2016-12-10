var sock;
var opened = false;
var x,y;
var dir; // In radians.
var speed;
var kaleidoscopeMode = false;
var ship;

var leftPressed, rightPressed, upPressed, downPressed, spacePressed;

var currentFunction = false;

var SHIP_SIZE = 10;
var BULLET_SIZE = 3;
var BULLET_COUNTDOWN = 2;
var BULLET_LIFE = 75;
var MAX_BULLETS = 7;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Bullet {
  constructor(point, direction, speed) {
    this.ticks = 0;
    this.dead = false;
    this.center = point;
    this.dir = direction;
    this.speed = speed || 10;
  }
  // Repeats ship. Look into JS inheritance.
  move() {
    this.center.x += Math.sin(this.dir) * this.speed;
    this.center.y += -Math.cos(this.dir) * this.speed;
    
    if (this.center.x > canvas.width || this.center.x < 0) {
      this.center.x = canvas.width - this.center.x;
    }
    if (this.center.y > canvas.height || this.center.y < 0) {
      this.center.y = canvas.height - this.center.y;
    }
  }
  update() {
    this.move();
    this.ticks++;
    if (this.ticks > BULLET_LIFE) {
      this.dead = true;
    }
  }
}

class Ship {
  constructor(point, direction, speed) {
    this.center = point;
    this.bulletCountdown = 0;
    this.dir = dir;
    this.speed = speed;
    this.bullets = [];
  }
  rotate(rads) {
    this.dir += rads;
  }
  nose() {
    return rotate(new Point(this.center.x, this.center.y - 2*SHIP_SIZE), this.center, this.dir);
  }
  backLeft() {
    return rotate(new Point(this.center.x - SHIP_SIZE, this.center.y+SHIP_SIZE), this.center, this.dir);
  }
  backRight() {
    return rotate(new Point(this.center.x + SHIP_SIZE, this.center.y+SHIP_SIZE), this.center, this.dir);
  }
  update() {
    if (this.bulletCountdown > 0) {
      this.bulletCountdown -= 1;
    }
    this.move();
    this.updateBullets();
  }
  move() {
    this.center.x += Math.sin(this.dir) * this.speed;
    this.center.y += -Math.cos(this.dir) * this.speed;
    
    if (this.center.x > canvas.width || this.center.x < 0) {
      this.center.x = canvas.width - this.center.x;
    }
    if (this.center.y > canvas.height || this.center.y < 0) {
      this.center.y = canvas.height - this.center.y;
    }
  }
  fire() {
    if (this.bulletCountdown === 0) {
      this.bullets.push(new Bullet(new Point(this.nose().x, this.nose().y), this.dir, 10));
      if (this.bullets.length > MAX_BULLETS) {
        this.bullets.shift();
      }
      this.bulletCountdown = BULLET_COUNTDOWN;
    }
  }
  // Note we could currently do this with a for loop, breaking when we find a dead bullet, since
  // there's a delay, but I want to support a possible future trigun or some-such.
  updateBullets() {
    var i = 0;
    var length = this.bullets.length;
    while (i < length) {
      if (this.bullets[i].dead) {
        this.bullets.splice(i, 1);
        length--;
      } else {
        i++;
      }
    }
  }
}

window.onload = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  startGame();
  loop();
};

function loop() {
  if (currentFunction) {
    currentFunction();
  }
  requestId = requestAnimationFrame(loop);
}

function animate(f) {
  currentFunction = f;
}

function onButton() {
  console.log("Started!");
  var socket = new WebSocket('ws://spacegame.com:8080');
  socket.onopen = function() {
    console.log("Opened!");
    opened = true;
    socket.send(JSON.stringify({
      id: 1,
      data: "test"
      }));
    console.log("Sent!");
  };
  socket.onmessage = function(s) {
    console.log("Received Message: " + s.data);
  };
  sock = socket;
}

function onSendButton() {
  if (opened) {
    console.log("Sending...");
    sock.send(JSON.stringify({
      id: 1,
      data: "test"
      }));
    console.log("Sent!");
  } else {
    console.log("Socket not open!");
  }
}

function startGame() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  dir = 0;
  speed = 0;
  
  ship = new Ship(new Point(x, y), dir, speed);
  
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  
  animate(gameLoop);
}

function gameLoop() {
  draw();
}

function draw() {
  if (!kaleidoscopeMode) {
    ctx.clearRect(0, 0, canvas.width, canvas.width);
  }
  
  drawShip(ship);
  drawBullets(ship.bullets);
  collisionDetection();
  handleInput();
  updateObjects();
}

function drawShip(ship) {
  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  
  //var bodyCenter = new Point(x, y);
  //var nose = rotate(new Point(x, y - 2*SHIP_SIZE), bodyCenter, dir);
  //var backLeft = rotate(new Point(x - SHIP_SIZE, y+SHIP_SIZE), bodyCenter, dir);
  //var backRight = rotate(new Point(x + SHIP_SIZE, y+SHIP_SIZE), bodyCenter, dir);
  var nose = ship.nose();
  var backLeft = ship.backLeft();
  var backRight = ship.backRight();
  
  ctx.moveTo(nose.x, nose.y);
  ctx.lineTo(backLeft.x, backLeft.y);
  ctx.lineTo(backRight.x, backRight.y);
  ctx.closePath();
  ctx.stroke();
}

function drawBullets(bullets) {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.arc(bullet.center.x, bullet.center.y, BULLET_SIZE, 0, 2*Math.PI, true);
    ctx.stroke();
  }
}

// Amount should be in radians.
function rotate(point, base, amount) {
  base = base || new Point(0, 0);
  
  var translated = new Point(point.x - base.x, point.y - base.y);
  var rotX = translated.x * Math.cos(amount) - translated.y * Math.sin(amount);
  var rotY = translated.y * Math.cos(amount) + translated.x * Math.sin(amount);
  var unTranslated = new Point(rotX + base.x, rotY + base.y);
  return unTranslated;
}

function handleInput() {
  if (rightPressed) {
    ship.rotate(0.1);
  }
  if (leftPressed) {
    ship.rotate(-0.1);
  }
  if (upPressed && speed < 5) {
    ship.speed += 0.1;
  }
  if (downPressed && speed > -5) {
    ship.speed -= 0.1;
  }
  if (spacePressed) {
    ship.fire();
  }
}

function updateObjects() {
  ship.update();
  for (var i = 0; i < ship.bullets.length; i++) {
    ship.bullets[i].update();
  }
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  } else if (e.keyCode == 38) {
    upPressed = true;
  } else if (e.keyCode == 40) {
    downPressed = true;
  } else if (e.keyCode == 32) {
    spacePressed = true;
  } else if (e.keyCode == 76) { // "l", for log.
    log();
  } else if (e.keyCode == 75) {
    kaleidoscopeMode = !kaleidoscopeMode;
  }
  else {
    console.log(e.keyCode);
  }
}

function log() {
  console.log("X: " + x + "\nY:" + y);
  console.log("Ship:\n", ship);
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  } else if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 40) {
    downPressed = false;
  } else if (e.keyCode == 32) {
    spacePressed = false;
  }
}

function collisionDetection() {
  // Pass. Only one object at the moment.
}







