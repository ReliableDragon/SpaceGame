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
  console.log("Drawing dead ship!");
  ctx.beginPath();
  ctx.strokeStyle = "#FFFFFF";
  
  var verts = ship.deadVerts();
  
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
