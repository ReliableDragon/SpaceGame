import utils, math, json

class Ship(object):
  
  def __init__(
    self,
    center=utils.Point(0, 0),
    speed=utils.Vector(0, 0),
    rotation=-math.pi/2,
    name="testy mc testface",
    inputs = {
    "up": False,
    "down": False,
    "left": False,
    "right": False,
    "space": False}
    ):
    self.center = center
    self.speed = speed
    self.rotation = rotation
    self.name = name
    self.inputs = inputs
    
  @staticmethod
  def from_dict(data):
    return Ship(
      utils.Point(data["center"]["x"], data["center"]["y"]),
      utils.Vector(data["speed"]["x"], data["speed"]["y"]),
      data["dir"],
      data["name"],
      data["inputs"])
  
  def to_dict(self):
    return {
      "center": self.center.__dict__,
      "speed": self.speed.__dict__,
      "dir": self.rotation,
      "name": self.name,
      "inputs": self.inputs
    }
    
  def accelerate(self, amount):
    self.speed.add_in_direction(amount, self.rotation)
    
  def rotate(self, rads):
    self.rotation += rads
    
  def move(self):
    self.center.x += self.speed.x
    self.center.y += self.speed.y
    self.center = utils.wrap_around(self.center)