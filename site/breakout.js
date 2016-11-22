// Globals
var canvas, ctx, x, y, paddleX;
var dx = 3;
var dy = -3;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var leftPressed = false;
var rightPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];

var score = 0;
var lives = 3;

window.onload = function() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  
  x = canvas.width / 2;
  y = canvas.height - 30;
  paddleX = (canvas.width - paddleWidth) / 2;
  for (i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (j = 0; j < brickRowCount; j++) {
      bricks[i][j] = { x: 0, y: 0, status: 1};
      
      bricks[i][j].x = (i*(brickWidth + brickPadding) + brickOffsetLeft);
      bricks[i][j].y = (j*(brickHeight + brickPadding) + brickOffsetTop);
    }
  }
  
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  
  draw();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.width);

  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();
  collisionDetection();
  
  if (y + dy < ballRadius)  {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight && dy > 0) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      var paddleFrac = 1 - (x - paddleX) / paddleWidth;
      paddleFrac = clamp(paddleFrac, 0.1, 0.9);
      if (paddleFrac > 0.6 || paddleFrac < 0.4) {
        dx = Math.cos(paddleFrac * Math.PI) * 5;
        dy = -Math.sin(paddleFrac * Math.PI) * 5;
      } else {
        dy = -dy;
      }
    } else if (y + dy > canvas.height - ballRadius) {
      lives--;
      if (!lives) {
      //alert("GAME OVER");
      //document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth)/2;
      }
    }
  }
  if (x + dx < ballRadius|| x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }
  
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  
  x += dx;
  y += dy;
  
  requestAnimationFrame(draw);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (i = 0; i < brickColumnCount; i++) {
    for (j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status == 1) {
        ctx.beginPath();
        ctx.rect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (i = 0; i < brickColumnCount; i++) {
    for (j = 0; j < brickRowCount; j++) {
      var b = bricks[i][j];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score == brickColumnCount*brickRowCount) {
            //alert("YOU WIN");
            document.location.reload();
          }
        }
      }
    }
  }
}

function clamp(val, min, max) {
  if (val > max) {
    return max;
  } else if (val < min) {
    return min;
  } else {
    return val;
  }
}



