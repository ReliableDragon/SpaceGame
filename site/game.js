var sock;
var x,y;
var dir; // In radians.
var speed;
var kaleidoscopeMode = false;
var logSocketCalls = false;
var lives = 3;
var score = 0;
var level = 1;
var socket;
var gameId = -1;
var username = "testy mc test";
var levelover = false;
var time;
var dt = 0;
var fps = 60;
var data;

var ship;
var waiting = false;
var asteroids = [];
var gameOver = false;

var ASTEROID_SIZE = 45;
var NUM_ASTEROIDS = 1;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

var currentFunction = false;
var resumeFunction = false;

var gameData;

//TODO: Have server provide these in the initial data package.
// Okay, I need to define movement speeds in server units per millisecond instead of client units per frame,
// so that we can translate between the server and client more accurately.
// Canonical constants:
var ACCELERTATION = 0.005;
var TURN_SPEED = 0.0075;
var SHIP_TOP_SPEED = 5;
var BULLET_SPEED = 0.05;

window.onload = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  openSocket();
  setInterval(sendData, 100);
  
  startGame();
  loop();
};

function openSocket() {
  socket = new WebSocket('ws://spacegame.com:8080');
  socket.onopen = function() {
    opened = true;
    socket.send(JSON.stringify({
      id: 1,
      data: "test",
      gamestate: "new",
      name: username,
      }));
  };
  socket.onmessage = function(s) {
    if (logSocketCalls) {
      console.log("Received Message: " + s.data);
    }
    var data = JSON.parse(s.data);
    startGameFromData(data);
  };

  socket.onclose = function() {
    if (logSocketCalls) {
      console.log("State is " + socket.readyState + ", restarting in 250ms.");
    }
    setTimeout(openSocket, 250);
  };
}

function sendData() {
  if (socket.readyState == 1) {
    var message = JSON.stringify({
      keys: {
        up: upPressed,
        down: downPressed,
        left: leftPressed,
        right: rightPressed,
        space: spacePressed,
      },
      gamestate: "ongoing",
      name: username,
      game_id: gameId,
    });
    //console.log("Sending message:\n" + message);
    socket.send(message);
  }
}

function startGameFromData(data) {
  //var serverSpeed = new Vector(data.ship.speed.x, data.ship.speed.y);
  //if (!serverSpeed.equals(ship.speed)) {
  //  console.log("Speed:");
  //  console.log("Server: " + serverSpeed.x + ", " + serverSpeed.y);
  //  console.log("Local:  " + ship.speed.x + ", " + ship.speed.y);
  //  console.log("Diff:   " + (ship.speed.x - serverSpeed.x) + ", " + (ship.speed.y - serverSpeed.y));
  //}
  //var serverPosition = new Point(data.ship.center.x, data.ship.center.y);
  //if (!serverPosition.equals(ship.center)) {
  //  console.log("Position:");
  //  console.log("Server: " + serverPosition.x + ", " + serverPosition.y);
  //  console.log("Local:  " + ship.center.x + ", " + ship.center.y);
  //  console.log("Diff:   " + (ship.center.x - serverPosition.x) + ", " + (ship.center.y - serverPosition.y));
  //}
  
  if (data.ships[0]) {
    var shipData = data.ships[0];
    ship.setPosition(
                     new Point(shipData.center.x, shipData.center.y),
                     shipData.dir,
                     new Vector(shipData.speed.x, shipData.speed.y));
  }
  if (data.game_id) {
    gameId = data.game_id;
  } else {
    console.log("Error! No game id provided by server.");
  }
  if (data.asteroids) {
    asteroids = [];
    for (var i = 0; i < data.asteroids.length; i++) {
      dataAsteroid = data.asteroids[i];
      asteroids.push(new Asteroid(
                                  new Point(dataAsteroid.center.x, dataAsteroid.center.y),
                                  new Vector(dataAsteroid.speed.x, dataAsteroid.speed.y),
                                  dataAsteroid.size,
                                  dataAsteroid.stage,
                                  dataAsteroid.num_children));
    }
  }
}

function loop() {
  var now = new Date().getTime();
  dt = now - (time || now);
  time = now;
  
  if (currentFunction) {
    currentFunction();
  }
  requestId = setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / fps);
}

function animate(f) {
  currentFunction = f;
}

function startGame() {
  newShip();
  //makeAsteroids(level);
  //startGameFromData(data);
  
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  
  animate(gameLoop);
}

//function makeAsteroids(num) {
//  var asteroidsMade = [];
//  var asteroidSize = ASTEROID_SIZE + Math.random() * 10 - 5;
//  
//  while (asteroidsMade.length < num) {
//    var asteroid = new Asteroid(Point.random(), Vector.random(2), asteroidSize, 3, Math.floor(Math.random() * 2) + 2);
//    if (!asteroidIntersectsShip(asteroid, ship)) {
//      asteroidsMade.push(asteroid);
//    }
//  }
//  
//  asteroids.push.apply(asteroids, asteroidsMade);
//}

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
  x = X_MAX / 2;
  y = Y_MAX / 2;
  dir = -Math.PI/2;
  speed = Vector.zero();
  
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
  drawLives(lives);
  drawScore(score);
}

function handleInput() {
  if (rightPressed) {
    ship.rotate(TURN_SPEED * dt);
  }
  if (leftPressed) {
    ship.rotate(TURN_SPEED * -dt);
  }
  if (upPressed) {
    ship.accelerate(ACCELERTATION * dt);
  }
  if (downPressed) {
    ship.accelerate(ACCELERTATION * -dt);
  }
  if (spacePressed) {
    ship.fire();
  }
  ship.speed.clamp(SHIP_TOP_SPEED);
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
  if (levelover === true && !waiting) {
    level++;
    drawLevelPassedText();
    waiting = true;
    animate(false);
    levelover = false;
    setTimeout(function() {
      //makeAsteroids(level);
      newShip();
      waiting = false;
      animate(gameLoop);
    }, 1500);
  }
  if (ship.dead && !waiting) {
    keysOff();
    waiting = true;
    ship.speed = Vector.zero();
    //document.removeEventListener("keydown", keyDownHandler, false);
    //document.removeEventListener("keyup", keyUpHandler, false);
    setTimeout(function() {
      lives--;
      handleDeath();
      waiting = false;
      }, 1500);
  } else if (ship.dead) {
    // Spin because it makes an "animation" on death.
    ship.rotate(0.05);
  }
}

function keyDownHandler(e) {
  switch(e.keyCode) {
    case 39:
      if (!waiting)
        rightPressed = true;
      break;
    case 37:
      if (!waiting)
        leftPressed = true;
      break;
    case 38:
      if (!waiting)
        upPressed = true;
      break;
    case 40:
      if (!waiting)
        downPressed = true;
      break;
    case 32:
      if (!waiting)
        spacePressed = true;
      break;
    case 76: // "l", for log.
      log();
      break;
    case 75:
      kaleidoscopeMode = !kaleidoscopeMode;
      break;
    case 80:
      if (currentFunction) {
        resumeFunction = currentFunction;
        animate(false);
      } else {
        animate(resumeFunction);
      }
      break;
    default:
      console.log(e.keyCode);
  }
}

function log() {
  console.log("X: " + x + "\nY:" + y);
  console.log("Ship:\n", ship);
  console.log("X-Max: " + canvas.width + "\nY-Max: " + canvas.height);
  console.log("Websocket:\n", socket);
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
        score += Math.floor(100 * (5 - asteroid.stage) * Math.pow(1.2, level-1));
        bullet.dead = true;
        asteroid.dead = true;
        var newAsteroids = asteroid.split();
        asteroids.push.apply(asteroids, newAsteroids);
        if (asteroids.length === 0) {
          levelover = true;
        }
      }
    }
  }
  for (i = 0; i < asteroids.length; i++) {
    asteroid = asteroids[i];
    if (!asteroid.dead && asteroidIntersectsShip(asteroid, ship)) {
        ship.dead = true;
    }
  }
}

function asteroidIntersectsShip(asteroid, ship) {
  var shipBox = ship.getBoundingBox();
  for (j = 0; j < shipBox.points.length; j++) {
    if (asteroid.center.dist(shipBox.points[j]) < asteroid.size) {
      return true;
    }
  }
  return false;
}











