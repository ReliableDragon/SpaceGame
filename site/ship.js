var SHIP_SIZE = 10/6;
var BULLET_COUNTDOWN = 7;
var MAX_BULLETS = 7;
var SHIP_BULLET_SPEED = 2.5;

class Ship {
  constructor(point, facing, movementVector) {
    this.center = point;
    this.bulletCountdown = 0;
    this.dir = facing;
    this.dead = false;
    this.speed = movementVector;
    this.bullets = [];
    this.size = SHIP_SIZE;
  }
  setPosition(point, facing, movementVector) {
    this.center = point;
    this.dir = facing;
    this.speed = movementVector;
  }
  setBullets(bullets) {
    this.bullets = [];
    for (var i = 0; i < bullets.length; i++) {
      this.bullets.push(bullets[i]);
    }
  }
  rotate(rads) {
    this.dir += rads;
  }
  accelerate(amount) {
    this.speed.addInDirection(amount, this.dir);
  }
  update() {
    //console.log(this.center);
    if (this.bulletCountdown > 0) {
      this.bulletCountdown -= 1;
    }
    this.move();
    this.updateBullets();
  }
  move() {
    this.center.x += this.speed.x;
    this.center.y += this.speed.y;
    
    wrapAround(this.center);
  }
  fire() {
    if (this.bulletCountdown === 0 && !ship.dead) {
      
      this.bullets.push(this.createBullet());
      if (this.bullets.length > MAX_BULLETS) {
        this.bullets.shift();
      }
      this.bulletCountdown = BULLET_COUNTDOWN;
    }
  }
  createBullet() {
    var startPoint = this.nose().copy();
    var direction = this.dir;
    var unitVectorForDirection = Vector.unitVector(direction);
    // The bullet will always fire straight, but if the ship is going fast the bullets should still outrun it.
    // To do this, we project the ships speed along the unit vector in the direction the bullet will be travelling.
    // Then we add the base bullet speed. This should only have noticable effect when travelling quickly and firing forwards.
    var bulletSpeed = this.speed.dotProduct(unitVectorForDirection) + SHIP_BULLET_SPEED;
    var speed = Vector.dirMag(direction, bulletSpeed);
    return new Bullet(startPoint, speed);
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
  getBoundingBox() {
    var backLeft = rotate(new Point(this.center.x - SHIP_SIZE, this.center.y+SHIP_SIZE), this.center, this.dir);
    var backRight = rotate(new Point(this.center.x + SHIP_SIZE, this.center.y+SHIP_SIZE), this.center, this.dir);
    var frontLeft = rotate(new Point(this.center.x - SHIP_SIZE, this.center.y-SHIP_SIZE), this.center, this.dir);
    var frontRight = rotate(new Point(this.center.x + SHIP_SIZE, this.center.y-SHIP_SIZE), this.center, this.dir);
    return new Rect(frontLeft, frontRight, backRight, backLeft);
  }
  nose() {
    return rotate(new Point(this.center.x + 2*SHIP_SIZE, this.center.y), this.center, this.dir);
  }
  backLeft() {
    return rotate(new Point(this.center.x -SHIP_SIZE , this.center.y+SHIP_SIZE), this.center, this.dir);
  }
  backRight() {
    return rotate(new Point(this.center.x -SHIP_SIZE, this.center.y-SHIP_SIZE), this.center, this.dir);
  }
}















