import utils, math
from utils import Vector, Point

class Mover(object):
  def __init__(
    self,
    center = Point(utils.X_MAX / 2, utils.Y_MAX / 2),
    speed = Vector(0, 0),
    rotation = 0,
  ):
    self.center = center
    self.speed = speed
    self.rotation = rotation
    
  def move(self):
    self.center.x += self.speed.x
    self.center.y += self.speed.y
    self.center = utils.wrap_around(self.center)
    
  def to_dict(self):
    return {
      "center": self.center.__dict__,
      "speed": self.speed.__dict__,
      "rotation": self.rotation,
    }
  
  def from_dict(self, data):
    self.center = Point(data["center"]["x"], data["center"]["y"])
    self.speed = Vector(data["speed"]["x"], data["speed"]["y"])
    self.rotation = data["rotation"]