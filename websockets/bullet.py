import utils

class Bullet(object):
  def __init__(
      self,
      center,
      speed,
      bullet_size = 3,
      lifetime = 75,
      ticks = 0,
      dead = False):
    self.center = center
    self.speed = speed
    self.size = bullet_size
    self.lifetime = lifetime
    self.ticks = ticks
    self.dead = dead
    
  @staticmethod
  def from_dict(data):
    return Bullet(
      utils.Point.from_dict(data["center"]),
      utils.Vector.from_dict(data["speed"]),
      data["size"],
      data["lifetime"],
      data["ticks"],
      data["dead"],
    )
  
  def to_dict(self):
    return {
      "center": self.center.__dict__,
      "speed": self.speed.__dict__,
      "size": self.size,
      "lifetime": self.lifetime,
      "ticks": self.ticks,
      "dead": self.dead
    }
    
  # Repeats ship. Consider inheritance.
  def move(self):
    self.center.x += self.speed.x
    self.center.y += self.speed.y
    
    self.center = utils.wrap_around(self.center)

  def update(self):
    self.move()
    self.ticks += 1
    if self.ticks > self.lifetime:
      self.dead = True
      
      
      
      
      
      