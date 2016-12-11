var X_MAX = 1000;
var Y_MAX = 600;


class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static zero() {
    return new Vector(0, 0);
  }
  // TODO: Currently this goes faster diagonally. Change it to randomly decide speed, then
  // direction properly using trig.
  static random(max) {
    return Vector.zero().addInDirection(Math.random() * max, Math.random() * Math.PI * 2);
    //return new Vector(Math.floor(Math.random() * max - max/2), Math.floor(Math.random() * max - max/2));
  }
  static dirMag(dir, speed) {
    return new Vector(Math.cos(dir) * speed, Math.sin(dir) * speed);
  }
  copy() {
    return new Vector(this.x, this.y);
  }
  // As always, dir in radians.
  addInDirection(amount, dir) {
    this.x += amount * Math.cos(dir);
    this.y += amount * Math.sin(dir);
    // For chaining purposes.
    return this;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static random() {
    return new Point(Math.floor(Math.random() * X_MAX), Math.floor(Math.random() * Y_MAX));
  }
  copy() {
    return new Point(this.x, this.y);
  }
  sub(point) {
    return new Vector(this.x - point.x, this.y - point.y);
  }
  dist(point) {
    return Math.hypot(this.x - point.x, this.y - point.y);
  }
}

class Rect {
  constructor(a, b, c, d) {
    this.points = [a, b, c, d];
  }
}
// Amount should be in radians.
function rotate(point, base, amount) {
  base = base || new Point(0, 0);
  
  var translated = new Point(point.x - base.x, point.y - base.y);
  var rotX = translated.x * Math.cos(amount) - translated.y * Math.sin(amount);
  var rotY = translated.y * Math.cos(amount) + translated.x * Math.sin(amount);
  var unTranslated = new Point(rotX + base.x, rotY + base.y);
  return unTranslated;
}

function wrapAround(point) {
    if (point.x > X_MAX || point.x < 0) {
      point.x = X_MAX - point.x;
    }
    if (point.y > Y_MAX || point.y < 0) {
      point.y = Y_MAX - point.y;
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








