var BULLET_SIZE = 3;
var BULLET_LIFE = 75;

class Bullet {
  constructor(point, vector) {
    this.ticks = 0;
    this.dead = false;
    this.center = point;
    this.speed = vector || BULLET_SPEED;
    this.size = BULLET_SIZE;
  }
  
  static fromDict(data) {
    var bullet = new Bullet(
      new Point(data.center.x, data.center.y),
      new Vector(data.speed.x, data.speed.y)
    );
    bullet.setTicks(data.ticks).setDead(data.dead).setSize(data.size);
    return bullet;
  }
  
  setTicks(ticks) {
    this.ticks = ticks;
    return this;
  }
  
  setDead(isDead) {
    this.dead = isDead;
    return this;
  }
  
  setSize(size) {
    this.size = size;
    return this;
  }
  // Repeats ship. Look into JS inheritance.
  move() {
    this.center.x += this.speed.x;
    this.center.y += this.speed.y;
    
    wrapAround(this.center);
  }
  update() {
    this.move();
    this.ticks++;
    if (this.ticks > BULLET_LIFE) {
      this.dead = true;
    }
  }
}