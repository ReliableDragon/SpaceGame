class Asteroid {
  constructor(point, vector, size, stage) {
    this.center = point;
    this.speed = vector;
    this.size = size;
    this.stage = stage;
    this.numChildren = 3;
    this.rotation = Math.random();
    this.dead = false;
  }
  split() {
    this.dead = true;
    if (this.stage > 0) {
      var babies = [];
      for (var i = 0; i < this.numChildren; i++) {
        babies.push(new Asteroid(this.center.copy(), Vector.random(5), this.size * 0.6, this.stage - 1));
      }
      return babies;
    } else {
      return [];
    }
  }
  update() {
    this.center.x += this.speed.x;
    this.center.y += this.speed.y;
    this.rotation += Math.random();
    
    wrapAround(this.center);
  }
}