// Globals
var canvas, ctx, x, y, paddleX;
var dx = 0;
var dy = -8;
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

var score, lives, time, name;
var highscore = 0;

var requestId;
var currentFunction;

window.onload = function() {
  window.setInterval(addSec, 1000);
  startGame();
  loop();
};

function startGame() {
  animate(false);

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
  
  score = 0;
  name = "";
  time = 0;
  lives = 3;
  leftPressed = false;
  rightPressed = false;
  dx = 0;
  dy = -5;
  
  //getHighscore();
  asyncCall(
            "highscore.html",
            "request=score",
            function(resp, code) {
              if (code == 2) {
                highscore = "Loading...";
              } else if (code == 4) {
                highscore = resp;
              }
            }
    );
  
  animate(drawGame);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.width);

  drawBall();
  drawPaddle();
  drawBricks();
  drawTime();
  drawLives();
  drawHighscore();
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
        gameOver();
      } else {
        x = canvas.width/2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth)/2;
        animate(false);
        drawGame();
        setTimeout(function() { animate(drawGame); }, 500);
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
  
  //requestId = requestAnimationFrame(drawGame);
}

function loop() {
  if (currentFunction) {
    currentFunction();
  }
  requestId = requestAnimationFrame(loop);
}

function animate(f) {
  currentFunction = f;
}

function gameOver() {
  document.removeEventListener("keydown", keyDownHandler, false);
  document.removeEventListener("keyup", keyUpHandler, false);
  
  if (score == brickRowCount * brickColumnCount) {
    document.addEventListener("keydown", letterListener, false);
    document.addEventListener("click", submitListener, false);
    
    animate(drawMenu);
  } else {
    drawFrown();
    animate(false);
    
    setTimeout(startGame, 1000);
  }
}

function drawMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  
  drawNamePrompt();
  
  //window.cancelAnimationFrame(requestId);
  //requestId = requestAnimationFrame(drawMenu);
}

function letterListener(e) {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    name += String.fromCharCode(e.keyCode);
  } else if (e.keyCode == 8) {
    name = name.substring(0, name.length-1);
  }
}

function submitListener(e) {
  var rect = canvas.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  if (x > 151 && x < 350 && y > 181 && y < 222) {
    console.log(x+ "|" + y);
      //getHighscore();
    asyncCall(
            "highscore.html",
            "submit=score&score=" + time + "&username=" + name,
            function(resp, code) {
              if (code == 2) {
                highscore = "Loading...";
              } else if (code == 4) {
                highscore = resp;
              }
            }
    );
    document.removeEventListener("keydown", letterListener, false);
    
    startGame();
  }
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

function drawTime() {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Time: " + time, 8, 20);
}

function drawLives() {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function drawHighscore() {
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Highscore: " + highscore, canvas.width/2 - 60, 20);
}

function drawFrown() {
  ctx.font = "64pt Arial";
  ctx.fillStyle = "red";
  ctx.fillText(":(", canvas.width/2 - 20, 180);
}

function drawNamePrompt() {
  ctx.font = "32pt Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("YOU WIN!", canvas.width / 2 - 140, canvas.height / 2 - 20);
  
  ctx.font = "18pt Arial";
  ctx.fillText("Your name: " + name, canvas.width/2 - 140, canvas.height / 2);
  
  ctx.beginPath();
  ctx.rect(150, 180, 200, 40);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  
  ctx.font = "16pt Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("SUBMIT", 210, 207);
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
            gameOver();
            //document.location.reload();
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

function asyncCall(url, params, callback) {
  
  // Mostly boilerplate.
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", url, true);
  xhttp.onreadystatechange = function()  {
    if (xhttp.status == 200) {
      callback(xhttp.responseText, xhttp.readyState);
    } else {
      alert("There was an error: " + xhttp.status);
    }
  };

  // These ensure that the request will be sent every time, and prevent the
  // browser from caching our page and pre-empting the ajax request.
  // TODO(gabe): Find out if there's a better way to achieve this.
  xhttp.setRequestHeader("Pragma", "no-cache");
  xhttp.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
  xhttp.setRequestHeader("Expires", 0);
  xhttp.setRequestHeader("Last-Modified", new Date(0));
  xhttp.setRequestHeader("If-Modified-Since", new Date(0));
  // Tell the XMLRequest that we're sending POST arguments.
  
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params);  
}

// AJAX testing. This is a work in progress, I'm not 100% sure how this will work with WSGI, but it should be possible.
function getHighscore() {
  
  // Mostly boilerplate.
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "highscore.html", true);
  xhttp.onreadystatechange = function()  {
    if (xhttp.status == 200) {
      if (xhttp.readyState == 4) {
        highscore = xhttp.responseText;
      } else if (xhttp.readyState == 2) {
        highscore = "Loading...";
      }
    } else {
      alert("There was an error: " + xhttp.status);
    }
  };
  
  // Set up post arguments.
  var params = "highscore=what";

  // These ensure that the request will be sent every time, and prevent the
  // browser from caching our page and pre-empting the ajax request.
  // TODO(gabe): Find out if there's a better way to achieve this.
  xhttp.setRequestHeader("Pragma", "no-cache");
  xhttp.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
  xhttp.setRequestHeader("Expires", 0);
  xhttp.setRequestHeader("Last-Modified", new Date(0));
  xhttp.setRequestHeader("If-Modified-Since", new Date(0));
  // Tell the XMLRequest that we're sending POST arguments.
  
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params);
}

function addSec() {
  time += 1;
}



