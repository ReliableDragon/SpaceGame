var SHIP_SIZE = 10/6;
var BULLET_RECHARGE = 120;
var MAX_BULLETS = 7;
var SHIP_BULLET_SPEED = 2.5;

// TODO: Update this to include new Python methods
class Ship {
  constructor(point, facing, movementVector) {
    this.center = point;
    this.bulletCountdown = 0;
    this.dir = facing;
    this.dead = false;
    this.speed = movementVector;
    this.bullets = [];
    this.size = SHIP_SIZE;
    this.invulnTime = 2000;
    this.warpCountdown = 0;
  }
  static defaultShip() {
    return new Ship(new Point(0, 0), 0, new Vector(0, 0));
  }
  
  fromData(
    data
    //center,
    //speed,
    //rotation,
    //name,
    //inputs,
    //bullets = [],
    //bulletCountdown = 0,
    //bulletRecharge = 120,
    //bulletSpeed = 2.5,
    //lives = 3,
    //dead = False,
    //deathCountdown = 0,
    //maxBullets = 7,
    //size = 10/6,
    //lastUpdated = None,
    //leaving = False,
    //score = 0,
    //acceleration = 0.005,
    //turnSpeed = 0.0075,
    //warpCountdown = 500,
    //invulnTime = 0
    ) {
    this.center =  new Point(data.center.x, data.center.y) || new Point(X_MAX / 2, Y_MAX / 2);
    this.speed = new Vector(data.speed.x, data.speed.y) || new Vector(0, 0);
    this.dir = data.rotation || -math.pi/2;
    this.name = data.name || "testy mc testface";
    this.inputs = data.inputs || {
    "up": false,
    "down": false,
    "left": false,
    "right": false,
    "space": false,
    "F": false,};
    this.bullets = data.bullets.splice(0).map(Bullet.fromDict) || [];
    this.bulletCountdown = data.bullet_countdown || 0;
    this.bulletRecharge = data.bullet_recharge || BULLET_RECHARGE;
    this.bulletSpeed = data.bullet_speed || SHIP_BULLET_SPEED;
    this.lives = data.lives || 3;
    this.dead = data.dead || false;
    this.deathCountdown = data.death_countdown || 0;
    this.maxBullets = data.max_bullets || MAX_BULLETS;
    this.size = data.size || SHIP_SIZE;
    this.leaving = data.leaving || false;
    this.score = data.score || 0;
    this.acceleration = data.acceleration || ACCELERATION;
    this.turnSpeed = data.turn_speed || TURN_SPEED;
    this.warpCountdown = data.warp_countdown || 0;
    this.invulnTime = data.invuln_time || 0;
    
    return this;
  }

  rotate(rads) {
    this.dir += rads;
  }
  accelerate(amount) {
    this.speed.addInDirection(amount, this.dir);
  }
  update(dt) {
    if (this.dead && this.deathCountdown == 0) {
      this.bullets = [];
      this.bulletCountdown = this.bulletRecharge;
      this.deathCountdown = 3000;
      this.speed = new Vector(0, 0);
      // Set to 5000 so that after the death countdown finishes, we still have 2000 left over.
      this.invuln_time = 5000;
      this.lives -= 1;
    }
    if (this.bulletCountdown > 0) {
      this.bulletCountdown -= Math.min(this.bulletCountdown, dt);
    }
    if (this.deathCountdown > 0) {
      this.deathCountdown -= Math.min(this.deathCountdown, dt);
      if (this.deathCountdown === 0) {
        this.dead = false;
        this.center = new Point(X_MAX / 2, Y_MAX / 2);
        this.rotation = -Math.PI/2;
      }
    }
    if (this.warpCountdown > 0) {
      this.warpCountdown -= Math.min(this.warpCountdown, dt);
    }
    if (this.invulnTime > 0) {
      this.invulnTime -= Math.min(this.invulnTime, dt);
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
      this.bulletCountdown = this.bulletRecharge;
    }
  }
  
  // TODO: Factor out the magic number 1000.
  warp() {
    if (this.warpCountdown <= 0) {
      this.center = Point.random();
      this.warpCountdown += 1000;
      this.invulnTime += 950;
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















