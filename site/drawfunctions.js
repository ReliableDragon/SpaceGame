var HEIGHT = 600;
var WIDTH = 1000;
var X_RAT = 6; // 1200 / 200 = 6
var Y_RAT = 6;  // 600 / 100 = 6

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
  
  var nose = ship.nose().times2(X_RAT, Y_RAT);
  var backLeft = ship.backLeft().times2(X_RAT, Y_RAT);
  var backRight = ship.backRight().times2(X_RAT, Y_RAT);
  
  ctx.moveTo(nose.x, nose.y);
  ctx.lineTo(backLeft.x, backLeft.y);
  ctx.lineTo(backRight.x, backRight.y);
  ctx.closePath();
  ctx.stroke();
}

function drawDeadShip() {
  console.log("Drawing dead ship!");
  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  
  var verts = deadVerts(ship)
  
  // There's three lines, and six vertices. Hence, three iterations with two steps each.
  for (var i = 0; i < 3; i++) {
    ctx.moveTo(X_RAT * verts[2*i].x, Y_RAT * verts[2*i].y);
    ctx.lineTo(X_RAT * verts[2*i+1].x, Y_RAT * verts[2*i+1].y);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawBullets(bullets) {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.arc(X_RAT * bullet.center.x, Y_RAT * bullet.center.y, bullet.size, 0, 2*Math.PI, true);
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
    ctx.arc(X_RAT * asteroid.center.x, Y_RAT * asteroid.center.y, asteroid.size, 0, 2*Math.PI, true);
    ctx.stroke();
  }
}

function drawLives(lives) {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#EEEEEE";
  ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function drawScore(score) {
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

function drawLevelPassedText() {
  ctx.font = "32pt Arial";
  ctx.fillStyle = "#BB0000";
  ctx.fillText("LEVEL PASSED", canvas.width/2 - 220, canvas.height/2);
}

function deadVerts(ship) {
  var verts = [];
  verts.push(rotate(new Point(ship.center.x * X_RAT + 2.5*SHIP_SIZE, ship.center.y * Y_RAT), ship.nose(), 0.2));
  verts.push(rotate(new Point(ship.center.x * X_RAT - 0.5*SHIP_SIZE, ship.center.y * Y_RAT + SHIP_SIZE), ship.nose(), 0.2));
  verts.push(rotate(new Point(ship.center.x * X_RAT - 0.5*SHIP_SIZE, ship.center.y * Y_RAT + SHIP_SIZE), ship.nose(), -0.2));
  verts.push(rotate(new Point(ship.center.x * X_RAT - 0.5*SHIP_SIZE, ship.center.y * Y_RAT - SHIP_SIZE), ship.nose(), -0.2));
  verts.push(rotate(new Point(ship.center.x * X_RAT - 0.5*SHIP_SIZE, ship.center.y * Y_RAT + SHIP_SIZE), ship.backRight(), -0.2));
  verts.push(rotate(new Point(ship.center.x * X_RAT - 0.5*SHIP_SIZE, ship.center.y * Y_RAT - SHIP_SIZE), ship.backRight(), -0.2));
  return verts;
}
