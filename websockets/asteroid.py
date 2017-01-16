import random
import utils

class Asteroid(object):
  def __init__(
      self,
      uid = -1,
      point = utils.Point(0, 0),
      speed = utils.Vector(0, 0),
      size = 45,
      stage = 3,
      num_children = 2,
      rotation = 0,
      dead = False):
    self.id = uid
    self.center = point
    self.speed = speed
    self.size = size
    self.stage = stage
    self.num_children = num_children
    self.rotation = rotation
    self.dead = dead
    
  def update(self):
    self.center.x += self.speed.x
    self.center.y += self.speed.y
    self.rotation += random.random()
    
    self.center = utils.wrap_around(self.center)
    
  def to_dict(self):
    return {
      "id": self.id,
      "center": self.center.__dict__,
      "speed": self.speed.__dict__,
      "size": self.size,
      "stage": self.stage,
      "num_children": self.num_children,
      "rotation": self.rotation,
      "dead": self.dead,
    }
  
  @staticmethod
  def from_dict(data):
    return Asteroid(
      data["id"],
      utils.Point.from_dict(data["center"]),
      utils.Vector.from_dict(data["speed"]),
      data["size"],
      data["stage"],
      data["num_children"],
      data["rotation"],
      data["dead"]
    )
    
    
    
    
    
    
    
    