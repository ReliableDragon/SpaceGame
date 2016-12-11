var BULLET_SIZE = 3;
var BULLET_LIFE = 75;

class Bullet {
  constructor(point, direction, vector) {
    this.ticks = 0;
    this.dead = false;
    this.center = point;
    this.dir = direction;
    this.speed = vector || 10;
    this.size = BULLET_SIZE;
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