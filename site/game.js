var sock;
var opened = false;
var x,y;
var dir; // In radians.
var speed;
var kaleidoscopeMode = false;
var lives = 1;
var score = 0;

var ship;
var deathHandled = false;
var asteroids = [];
var gameOver = false;

var ASTEROID_SIZE = 45
var NUM_ASTEROIDS = 1;

var leftPressed, rightPressed, upPressed, downPressed, spacePressed;

var currentFunction = false;

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
  newShip();
  
  for (var i = 0; i < NUM_ASTEROIDS; i++) {
    asteroids.push(new Asteroid(Point.random(), Vector.zero(), ASTEROID_SIZE, 3));
  }
  
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  
  animate(gameLoop);
}

function handleDeath() {
  if (lives > 0) {
    newShip();
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
  } else {
    gameOver = true;
  }
}

function newShip() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  dir = 0;
  speed = 0;
  
  ship = new Ship(new Point(x, y), dir, speed);
}

function gameLoop() {
  draw();
  collisionDetection();
  handleInput();
  updateObjects();
}

function draw() {
  if (!kaleidoscopeMode) {
    ctx.clearRect(0, 0, canvas.width, canvas.width);
  }
  if (!gameOver) {
    drawShip(ship);
    drawBullets(ship.bullets);
    drawAsteroids(asteroids);
  } else {
    drawGameOverText();
  }
  drawLives();
  drawScore();
}

function drawShip(ship) {
  if (!ship.dead) {
    drawAliveShip();
  } else {
    drawDeadShip();
  }
}

function drawAliveShip() {
  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  
  var nose = ship.nose();
  var backLeft = ship.backLeft();
  var backRight = ship.backRight();
  
  ctx.moveTo(nose.x, nose.y);
  ctx.lineTo(backLeft.x, backLeft.y);
  ctx.lineTo(backRight.x, backRight.y);
  ctx.closePath();
  ctx.stroke();
}

function drawDeadShip() {
  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  
  var verts = ship.deadVerts();
  
  ctx.moveTo(verts[0].x, verts[0].y);
  ctx.lineTo(verts[1].x, verts[1].y);
  ctx.moveTo(verts[2].x, verts[2].y);
  ctx.lineTo(verts[3].x, verts[3].y);
  ctx.moveTo(verts[4].x, verts[4].y);
  ctx.lineTo(verts[5].x, verts[5].y);
  ctx.closePath();
  ctx.stroke();
}

function drawBullets(bullets) {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.arc(bullet.center.x, bullet.center.y, bullet.size, 0, 2*Math.PI, true);
    ctx.stroke();
  }
}

// TODO: Make asteroids jaggier and more fun looking. Circles are boring, and the rotation
// function means we can just do the draw work once, then rotate around the center each time.
function drawAsteroids(asteroids) {
  for (var i = 0; i < asteroids.length; i++) {
    var asteroid = asteroids[i];
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.arc(asteroid.center.x, asteroid.center.y, asteroid.size, 0, 2*Math.PI, true);
    ctx.stroke();
  }
}

function drawLives() {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#EEEEEE";
  ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function drawScore() {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#EEEEEE";
  ctx.fillText("Score: " + score, 8, 20);
}

// TODO: Add "YOUR SCORE:", "ENTER YOUR NAME:", "REPLAY? Y/N" fields.
function drawGameOverText() {
  ctx.font = "48pt Arial";
  ctx.fillStyle = "#BB0000";
  ctx.fillText("GAME OVER :(", canvas.width/2 - 220, canvas.height/2);
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
  clamp(ship.speed, -5, 5);
}

function updateObjects() {
  for (var i = 0; i < ship.bullets.length; i++) {
    ship.bullets[i].update();
  }
  ship.update();
  i = 0;
  var length = asteroids.length;
  while (i < length) {
    asteroids[i].update();
    if (asteroids[i].dead) {
      asteroids.splice(i, 1);
      length--;
    } else {
      i++;
    }
  }
  if (ship.dead && !deathHandled) {
    keysOff();
    deathHandled = true;
    ship.speed = 0;
    document.removeEventListener("keydown", keyDownHandler, false);
    document.removeEventListener("keyup", keyUpHandler, false);
    setTimeout(function() {
      lives--;
      handleDeath();
      deathHandled = false;
      }, 1500);
  } else if (ship.dead) {
    // Spin because it makes an "animation" on death.
    ship.rotate(0.05);
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
  console.log("X-Max: " + canvas.width + "\nY-Max: " + canvas.height);
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

function keysOff() {
  rightPressed = false;
  upPressed = false;
  leftPressed = false;
  downPressed = false;
  spacePressed = false;
}

function collisionDetection() {
  // Declared at the top because JS has no block scope, only function scope.
  var i, j, asteroid;
  for (i = 0; i < ship.bullets.length; i++) {
    var bullet = ship.bullets[i];
    for (j = 0; j < asteroids.length; j++) {
      asteroid = asteroids[j];
      var distance =
          Math.hypot(bullet.center.x - asteroid.center.x, bullet.center.y - asteroid.center.y);
      if (distance < asteroid.size && !bullet.dead && !asteroid.dead) {
        score += 100 * (5 - asteroid.stage);
        bullet.dead = true;
        asteroid.dead = true;
        var newAsteroids = asteroid.split();
        asteroids.push.apply(asteroids, newAsteroids);
      }
    }
  }
  var shipBox = ship.getBoundingBox();
  for (i = 0; i < asteroids.length; i++) {
    asteroid = asteroids[i];
    for (j = 0; j < shipBox.points.length; j++) {
      console.log(asteroid);
      console.log(shipBox);
      if (!asteroid.dead && asteroid.center.dist(shipBox.points[j]) < asteroid.size) {
        ship.dead = true;
      }
    }
  }
}











