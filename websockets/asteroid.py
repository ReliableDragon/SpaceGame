import random, math
import utils
from utils import Vector, Point
from mover import Mover

class Asteroid(Mover):
  def __init__(
      self,
      uid = -1,
      center = Point(0, 0),
      speed = Vector(0, 0),
      size = 45,
      stage = 3,
      num_children = 2,
      rotation = 0,
      dead = False):
    super().__init__(center, speed, rotation)
    self.id = uid
    self.size = size
    self.stage = stage
    self.num_children = num_children
    self.dead = dead
    
  def update(self):
    super().move()
    self.rotation += random.random()
    
  def to_dict(self):
    new_values = {
      "id": self.id,
      "size": self.size,
      "stage": self.stage,
      "num_children": self.num_children,
      "dead": self.dead,
    }
    oo_values = super().to_dict()
    return {**new_values, **oo_values}
  
  def from_dict(self, data):
    super().from_dict(data)
    
    self.id = data["id"]
    self.size = data["size"]
    self.stage = data["stage"]
    self.num_children = data["num_children"]
    self.dead = data["dead"]
    
    # For chaining and list comprehensions
    return self
    
  def split(self):
    self.dead = True;
    if self.stage > 0:
      babies = []
      for i in range(0, self.num_children):
        babies.append(
          Asteroid(
            center = self.center.copy(),
            speed = Vector.random(0.02),
            size = self.size * 0.6,
            stage = self.stage - 1,
            num_children = math.floor(random.random() * 2) + 2))
      return babies
    else:
      return []
    
  @staticmethod
  def make_asteroid():
    # We don't want 70 < x < 130, or 40 < y < 60, so first we generate the values
    # with the appropriate ranges, then bump them up if they're above the minimum.
    # This creates a gap in the middle, and doesn't require re-generating.
    x = random.randint(0, 140)
    y = random.randint(0, 80)
    #TODO: Make this actually avoid the ship(s), so we can simply add new asteroids to start a new level.
    if x > 70:
      x += 60
    if y > 40:
      y += 20
      
    center = Point(x, y)
    
    direction = random.random() * 2 * math.pi
    abs_speed = random.random() / 50
    speed = Vector.zero().add_in_direction(abs_speed, direction)
    
    size = 8 + random.random() * 2
    num_children = random.randint(2, 3)
    
    return Asteroid(center = center, speed = speed, size = size, num_children = num_children)

    
    
    
    
    
    
    