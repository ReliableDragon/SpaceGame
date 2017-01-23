var X_MAX = 200;
var Y_MAX = 100;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static zero() {
    return new Vector(0, 0);
  }
  static unitVector(dir) {
    return Vector.zero().addInDirection(1, dir);
  }
  static random(max) {
    return Vector.zero().addInDirection(Math.random() * max, Math.random() * Math.PI * 2);
  }
  static dirMag(dir, speed) {
    return new Vector(Math.cos(dir) * speed, Math.sin(dir) * speed);
  }
  static angleBetween(v1, v2) {
    return Math.atan2(v1.x, v2.y) - Math.atan2(v2.x, v2.y);
  }
  equals(v2) {
    return this.x === v2.x && this.y === v2.y;
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
  magnitude() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  // Projects this onto vector v2.
  dotProduct(v2) {
    var angle = Vector.angleBetween(this, v2);
    var mag = this.magnitude();
    return mag * Math.cos(angle);
  }
  clamp(abs) {
    var mag = this.magnitude();
    if (!mag) {
      return;
    } else if (mag > abs) {
      this.x = this.x * abs / mag;
      this.y = this.y * abs / mag;
    }
  }
  times(scalar) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
  }
  times2(s1, s2) {
    this.x = this.x * s1;
    this.y = this.y * s2;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static random(maxX, maxY, minX, minY) {
    var xScaling = maxX || X_MAX;
    var yScaling = maxY || Y_MAX;
    var xTranslation = minX || 0;
    var yTranslation = minY || 0;
    return new Point(Math.floor(Math.random() * xScaling + xTranslation), Math.floor(Math.random() * yScaling + yTranslation));
  }
  equals(p2) {
    return this.x === p2.x && this.y === p2.y;
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
  times(scalar) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
  }
  times2(s1, s2) {
    return new Point(this.x * s1, this.y * s2);
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








