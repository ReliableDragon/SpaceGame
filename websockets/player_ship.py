import utils, math, json

class Ship(object):
  
  def __init__(
    self,
    center=utils.Point(utils.X_MAX / 2, utils.Y_MAX / 2),
    speed=utils.Vector(0, 0),
    rotation=-math.pi/2,
    name="testy mc testface",
    inputs = {
    "up": False,
    "down": False,
    "left": False,
    "right": False,
    "space": False},
    bullets = [],
    bullet_countdown = 0,
    bullet_recharge = 7,
    bullet_speed = 2.5,
    dead = False,
    max_bullets = 7,
    size = 10/6
    ):
    self.center = center
    self.speed = speed
    self.rotation = rotation
    self.name = name
    self.inputs = inputs
    self.bullets = list(bullets)
    self.bullet_countdown = bullet_countdown
    self.bullet_recharge = bullet_recharge
    self.bullet_speed = bullet_speed
    self.dead = dead
    self.max_bullets = max_bullets
    self.size = size
    
  @staticmethod
  def from_dict(data):
    return Ship(
      utils.Point(data["center"]["x"], data["center"]["y"]),
      utils.Vector(data["speed"]["x"], data["speed"]["y"]),
      data["dir"],
      data["name"],
      data["inputs"],
      data["bullets"],
      data["bullet_countdown"],
      data["bullet_recharge"],
      data["bullet_speed"],
      data["dead"],
      data["max_bullets"],
      data["size"]),
  
  def to_dict(self):
    return {
      "center": self.center.__dict__,
      "speed": self.speed.__dict__,
      "dir": self.rotation,
      "name": self.name,
      "inputs": self.inputs,
      "bullets": self.bullets,
      "bullet_countdown": self.bullet_countdown,
      "bullet_recharge": self.bullet_recharge,
      "bullet_speed": self.bullet_speed,
      "dead": self.dead,
      "max_bullets": self.max_bullets,
      "size": self.size,
    }
  
  def fire(self):
    if self.bulletCountdown == 0 and not ship.dead:
      self.bullets.append(self.createBullet())
      if len(self.bullets) > self.max_bullets:
        self.bullets.pop(0)

      self.bullet_countdown = self.bullet_recharge

  
  def createBullet(self):
    start_point = self.nose().copy()
    direction = self.dir
    unit_vector_for_direction = utils.Vector.unit_vector(direction)
    # The bullet will always fire straight, but if the ship is going fast the bullets should still outrun it.
    # To do this, we project the ships speed along the unit vector in the direction the bullet will be travelling.
    # Then we add the base bullet speed. This should only have noticable effect when travelling quickly and firing forwards.
    bullet_speed = self.speed.dot_product(unit_vector_for_direction) + self.bullet_speed
    speed = Vector.dir_mag(direction, bullet_speed)
    return bullet.Bullet(start_point, direction, speed)

  def update_bullets(self):
    i = 0
    length = len(self.bullets)
    while i < length:
      if self.bullets[i].dead:
        self.bullets.pop(i)
        length -= 1
      else:
        self.bullets[i].update()
        i += 1
    
  def accelerate(self, amount):
    self.speed.add_in_direction(amount, self.rotation)
    
  def rotate(self, rads):
    self.rotation += rads
    
  def update(self):
    self.move()
    self.update_bullets()
    
  def move(self):
    self.center.x += self.speed.x
    self.center.y += self.speed.y
    self.center = utils.wrap_around(self.center)
    
    
    
    
    
    
    
  def nose(self):
    return utils.rotate(utils.Point(self.center.x + 2*self.size, self.center.y), self.center, self.dir)
  
  
  
  
  
  
  
  
  
  
  