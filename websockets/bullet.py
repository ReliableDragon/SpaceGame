import utils
from mover import Mover
from utils import Point, Vector

class Bullet(Mover):
  def __init__(
      self,
      center = Point(0, 0),
      speed = Vector(0, 0),
      bullet_size = 3,
      lifetime = 75,
      ticks = 0,
      dead = False):
    super().__init__(center, speed)
    self.size = bullet_size
    self.lifetime = lifetime
    self.ticks = ticks
    self.dead = dead
    
  def from_dict(self, data):
    super().from_dict(data)
    
    self.size = data["size"]
    self.lifetime = data["lifetime"]
    self.ticks = data["ticks"]
    self.dead = data["dead"]
    
    # For chaining and list comprehensions
    return self
  
  def to_dict(self):
    new_data = {
      "size": self.size,
      "lifetime": self.lifetime,
      "ticks": self.ticks,
      "dead": self.dead
    }
    oo_data = super().to_dict()
    return {**new_data, **oo_data}
    
  # # Repeats ship. Consider inheritance.
  # def move(self):
  #   self.center.x += self.speed.x
  #   self.center.y += self.speed.y
  #   
  #   self.center = utils.wrap_around(self.center)

  def update(self):
    super().move()
    self.ticks += 1
    if self.ticks > self.lifetime:
      self.dead = True
      
      
      
      
      
      