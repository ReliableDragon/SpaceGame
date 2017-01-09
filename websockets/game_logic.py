import json, random, string, math
from player_ship import Ship

# This class runs the actual asteroids game logic.
# Internally the coordinate system used is 100x100, so the client has to convert.
class AsteroidsGame(object):
  def __init__(self):
    self.games = {}
    
  def input(self, raw_data):
    data = json.loads(raw_data)
    print("Data: {0}".format(data))
    state = data['gamestate']
    if state == "new":
      return self.create_new_game(data)
    else:
      return self.increment_game(data)
    
  def create_new_game(self, data):
    game_key = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(8))
    username = data["name"]
    ship = self.new_ship(username)
    print("Made ship!")
    asteroid = self.make_asteroid(1, 2)
    print("Made asteroid!")
    game_state = {
      "game_id": game_key,
      "ship": ship,
      "asteroids": [
        asteroid
      ]
    }
    self.games[game_key] = game_state
    return json.dumps(game_state)
  
  def increment_game(self, data):
    game_key = data["game_id"]
    game_state = self.games[game_key]
    #TODO: Make sure we only find the ship for this player. Don't update a random one!!
    print(game_state)
    print(game_state["ship"])
    ship = Ship.from_dict(game_state["ship"])
    
    ship = self.move_ship(game_state, data["keys"], ship)
    
    game_state["ship"] = ship.to_dict()
    self.games["game_id"] = game_state
    return json.dumps(game_state)
  
  @staticmethod
  def move_ship(game_state, data, ship):
    if data["up"]:
      ship.accelerate(True)
    if data["down"]:
      ship.accelerate(False)
    if data["left"]:
      ship.rotate(-0.5)
    if data["right"]:
      ship.rotate(0.5)
    if data["space"]:
      #TODO: Implement bullets.
      pass
    ship.move()
    return ship
  
  @staticmethod
  def new_ship(username):
    return {
      "name": username,
      "center": {
        "x": 50,
        "y": 50
        },
      "dir": -math.pi / 2,
      "speed": {
        "x": 0,
        "y": 0
        },
      "invuln_ticks": 50,
      }
  
  @staticmethod
  def make_asteroid(uid, stage):
    x = random.randint(0, 100)
    y = random.randint(0, 100)
    #TODO: Make this actually avoid the ship, so we can simply add new asteroids to start a new level.
    while 40 < x < 60:
      x = random.randint(0, 100)
    while 40 < y < 60:
      y = random.randint(0, 100)
      
    direction = random.random() * 2 * math.pi
    speed = random.random()
    dx = math.cos(direction) * speed
    dy = math.sin(direction) * speed
    size = 40 + random.random() * 10
    num_children = random.randint(2, 3)
    return {
        "id": uid,
        "center": {
          "x": x,
          "y": y
          },
        "speed": {
          "x": dx,
          "y": dy
          },
        "size": size,
        "stage": 3,
        "num_children": num_children
    }
  
  
    
    
    
    
    
    
    
    
    
    
  