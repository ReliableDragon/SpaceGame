import utils, math, json

class Ship(object):
  
  def __init__(self, center=utils.Point(0, 0), speed=utils.Vector(0, 0), rotation=-math.pi/2, name="testy mc testface"):
    self.center = center
    self.speed = speed
    self.rotation = rotation
    self.name = name
    
  @staticmethod
  def from_dict(data):
    return Ship(
      utils.Point(data["center"]["x"], data["center"]["y"]),
      utils.Vector(data["speed"]["x"], data["speed"]["y"]),
      data["dir"],
      data["name"])
  
  def to_dict(self):
    return {
      "center": self.center.__dict__,
      "speed": self.speed.__dict__,
      "dir": self.rotation,
      "name": self.name
    }
    
  def accelerate(self, amount):
    self.speed.add_in_direction(amount, self.rotation)
    
  def rotate(self, rads):
    self.rotation += rads
    
  def move(self):
    self.center.x += self.speed.x
    self.center.y += self.speed.y
    self.center = utils.wrap_around(self.center)