var BULLET_SIZE = 3;
var BULLET_LIFE = 75;

class Bullet {
  constructor(point, direction, speed) {
    this.ticks = 0;
    this.dead = false;
    this.center = point;
    this.dir = direction;
    this.speed = speed || 10;
    this.size = BULLET_SIZE;
  }
  // Repeats ship. Look into JS inheritance.
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
  update() {
    this.move();
    this.ticks++;
    if (this.ticks > BULLET_LIFE) {
      this.dead = true;
    }
  }
}