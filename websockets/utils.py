import json, math, time

X_MAX = 200
Y_MAX = 100

class Point(object):
  def __init__(self, x, y):
    self.x = x
    self.y = y
    
  @staticmethod
  def from_dict(data):
    return Point(data["x"], data["y"])
  
  @staticmethod
  def rotate(point, base = None, amount = 0):
    if base == None:
      base = Point(0, 0)
    translated = Point(point.x - base.x, point.y - base.y)
    rot_X = translated.x * math.cos(amount) - translated.y * math.sin(amount)
    rot_Y = translated.y * math.cos(amount) + translated.x * math.sin(amount)
    un_translated = Point(rot_X + base.x, rot_Y + base.y)
    return un_translated
    
  def to_json(self):
    return json.dumps(self.__dict__)
    return un_translated
  
  def copy(self):
    return Point(self.x, self.y)
    
class Vector(object):
  def __init__(self, x, y):
    self.x = x
    self.y = y
    
  @staticmethod
  def from_dict(data):
    return Vector(data["x"], data["y"])
    
  def to_json(self):
    return json.dumps(self.__dict__)
  
  def add_in_direction(self, amount, direction):
    self.x += amount * math.cos(direction)
    self.y += amount * math.sin(direction)
    # For chaining purposes.
    return self
  
  @staticmethod
  def zero():
    return Vector(0, 0)
  
  @staticmethod
  def unit_vector(dir):
    return Vector.zero().add_in_direction(1, dir)

  @staticmethod
  def random(max):
    return Vector.zero().add_in_direction(Math.random() * max, Math.random() * Math.PI * 2)

  @staticmethod
  def dir_mag(dir, speed):
    return Vector(math.cos(dir) * speed, math.sin(dir) * speed)

  @staticmethod
  def angle_between(v1, v2):
    return math.atan2(v1.x, v2.y) - math.atan2(v2.x, v2.y)

  def equals(self, v2):
    return self.x == v2.x and self.y == v2.y

  def copy(self):
    return Vector(self.x, self.y)

  def magnitude(self):
    return math.sqrt(self.x**2 + self.y**2)
  
  # Projects this onto vector v2.
  def dot_product(self, v2):
    angle = Vector.angle_between(self, v2)
    mag = self.magnitude()
    return mag * math.cos(angle)

  def clamp(self, max_magnitude):
    mag = self.magnitude()
    if mag == 0:
      return;
    elif mag > max_magnitude:
      this.x = this.x * max_magnitude / mag
      this.y = this.y * max_magnitude / mag

  def times(self, scalar):
    this.x = this.x * scalar
    this.y = this.y * scalar

  def times2(self, s1, s2):
    self.x = self.x * s1;
    self.y = self.y * s2;

def wrap_around(point):
  if point.x > 200:
    point.x -= 200
  elif point.x < 0:
    point.x += 200
  if point.y > 100:
    point.y -= 100
  elif point.y < 0:
    point.y += 100
  return point

def get_time():
    return int(round(time.time() * 1000))
  
  
  
  
  
  