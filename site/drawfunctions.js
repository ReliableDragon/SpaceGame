var HEIGHT = 600;
var WIDTH = 1000;
var X_RAT = 6; // 1200 / 200 = 6
var Y_RAT = 6;  // 600 / 100 = 6

function drawShip(ship) {
  if (!ship.dead) {
    drawAliveShip(ship);
  } else {
    drawDeadShip(ship);
  }
}

function drawAliveShip(ship) {
  ctx.beginPath();
  
  // Magic numbers galore! These constants are just to make this ship fade in nicely.
  var hue = Math.floor((1000 - Math.min(ship.invulnTime, 800)) / 1000 * 192 + 64);
  var rgbValue = "rgb(" + hue + ", " + hue + ", " + hue + ")";
  
  ctx.strokeStyle = rgbValue;
  
  var nose = ship.nose().times2(X_RAT, Y_RAT);
  var backLeft = ship.backLeft().times2(X_RAT, Y_RAT);
  var backRight = ship.backRight().times2(X_RAT, Y_RAT);
  
  ctx.moveTo(nose.x, nose.y);
  ctx.lineTo(backLeft.x, backLeft.y);
  ctx.lineTo(backRight.x, backRight.y);
  ctx.closePath();
  ctx.stroke();
}

function drawDeadShip(ship) {
  console.log("Drawing dead ship!");
  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  
  var verts = deadVerts(ship);
  
  // There's three lines, and six vertices. Hence, three iterations with two steps each.
  for (var i = 0; i < 3; i++) {
    ctx.moveTo(verts[2*i].x, verts[2*i].y);
    ctx.lineTo(verts[2*i+1].x, verts[2*i+1].y);
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
    ctx.arc(X_RAT * asteroid.center.x, Y_RAT * asteroid.center.y, asteroid.size * X_RAT, 0, 2*Math.PI, true);
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

function drawRoomId(id) {
  ctx.font = "10pt Arial";
  ctx.fillStyle = "#EEEEEE";
  ctx.fillText("Room Id: " + id, 8, 590);
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
function drawRespawnText() {
  ctx.font = "32pt Arial";
  ctx.fillStyle = "#BB0000";
  ctx.fillText("RESPAWNING", canvas.width/2 - 220, canvas.height/2);
}

function deadVerts(ship) {
  var verts = [];
  verts.push(rotate(new Point(ship.center.x + 2.5*SHIP_SIZE, ship.center.y), ship.nose(), 0.2).toScreen());
  verts.push(rotate(new Point(ship.center.x - 0.5*SHIP_SIZE, ship.center.y + SHIP_SIZE), ship.nose(), 0.2).toScreen());
  verts.push(rotate(new Point(ship.center.x - 0.5*SHIP_SIZE, ship.center.y + SHIP_SIZE), ship.nose(), -0.2).toScreen());
  verts.push(rotate(new Point(ship.center.x - 0.5*SHIP_SIZE, ship.center.y - SHIP_SIZE), ship.nose(), -0.2).toScreen());
  verts.push(rotate(new Point(ship.center.x - 0.5*SHIP_SIZE, ship.center.y + SHIP_SIZE), ship.backRight(), -0.2).toScreen());
  verts.push(rotate(new Point(ship.center.x - 0.5*SHIP_SIZE, ship.center.y - SHIP_SIZE), ship.backRight(), -0.2).toScreen());
  return verts;
}
