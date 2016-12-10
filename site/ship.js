var SHIP_SIZE = 10;
var BULLET_COUNTDOWN = 7;
var MAX_BULLETS = 7;

class Ship {
  constructor(point, direction, speed) {
    this.center = point;
    this.bulletCountdown = 0;
    this.dir = dir;
    this.dead = false;
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
  deadVerts() {
    var verts = [];
    verts.push(rotate(new Point(this.center.x, this.center.y - 2.5*SHIP_SIZE), this.nose(), 0.2));
    verts.push(rotate(new Point(this.center.x - SHIP_SIZE, this.center.y + 0.5*SHIP_SIZE), this.nose(), 0.2));
    verts.push(rotate(new Point(this.center.x - SHIP_SIZE, this.center.y + 0.5*SHIP_SIZE), this.nose(), -0.2));
    verts.push(rotate(new Point(this.center.x + SHIP_SIZE, this.center.y + 0.5*SHIP_SIZE), this.nose(), -0.2));
    verts.push(rotate(new Point(this.center.x - SHIP_SIZE, this.center.y + 0.5*SHIP_SIZE), this.backRight(), -0.2));
    verts.push(rotate(new Point(this.center.x + SHIP_SIZE, this.center.y + 0.5*SHIP_SIZE), this.backRight(), -0.2));
    return verts;
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
    if (this.bulletCountdown === 0 && !ship.dead) {
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
  getBoundingBox() {
    var backLeft = rotate(new Point(this.center.x - SHIP_SIZE, this.center.y+SHIP_SIZE), this.center, this.dir);
    var backRight = rotate(new Point(this.center.x + SHIP_SIZE, this.center.y+SHIP_SIZE), this.center, this.dir);
    var frontLeft = rotate(new Point(this.center.x - SHIP_SIZE, this.center.y-SHIP_SIZE), this.center, this.dir);
    var frontRight = rotate(new Point(this.center.x + SHIP_SIZE, this.center.y-SHIP_SIZE), this.center, this.dir);
    return new Rect(frontLeft, frontRight, backRight, backLeft);
  }
}















