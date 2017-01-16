import json, math, time

class Point(object):
  def __init__(self, x, y):
    self.x = x
    self.y = y
    
  def to_json(self):
    return json.dumps(self.__dict__)
    
class Vector(object):
  def __init__(self, x, y):
    self.x = x
    self.y = y
    
  def to_json(self):
    return json.dumps(self.__dict__)
  
  def add_in_direction(self, amount, direction):
    self.x += amount * math.cos(direction)
    self.y += amount * math.sin(direction)
    # For chaining purposes.
    return self

def wrap_around(point):
  if point.x > 100:
    point.x -= 100
  elif point.x < 0:
    point.x += 100
  if point.y > 100:
    point.y -= 100
  elif point.y < 0:
    point.y += 100
  return point

def get_time():
    return int(round(time.time() * 1000))
  
  
  
  
  
  