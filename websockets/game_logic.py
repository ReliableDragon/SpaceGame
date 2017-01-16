import json, random, string, math, time
from player_ship import Ship
import utils

# This class runs the actual asteroids game logic.
# Internally the coordinate system used is 200x100, so the client has to convert.
# The loop is started in socket_server.py, and runs as long as the server is up.
# On create:
#   - The client will provide a username, and the server will create a game_id.
#   - The server will then return the inital state of the game space.
# TODO: Add a unique ship identifier to avoid collisions and prevent spoofing.
# On update:
#   - The client will provide their game_id and username, which uniquely identify
#     their ship, along with information on inputs.
#   - The server will then update the ship's input status, and send back the current
#     game state.
class AsteroidsGame(object):
  X_MAX = 200
  Y_MAX = 100
  ACCELERATION = 0.005;
  TURN_SPEED = 0.0075;
  SHIP_TOP_SPEED = 5;
  
  def __init__(self):
    self.games = {}
    
  def loop(self):
    while True:
      start_time = time.time() * 1000
      for game_id,game in self.games.items():
        AsteroidsGame.increment_game(game)
      end_time = time.time() * 1000
      # The goal here is 17ms loops, which corresponds to 60fps, which is the speed that
      # the client updates at, so there's not a lot of reason to update faster. However,
      # if we get behind the algorithm uses delta time, so it will keep up, it just might
      # get jerkier.
      sleep_time = 17 - (end_time - start_time)
      if sleep_time > 0:
        time.sleep(sleep_time / 1000)

  def input(self, raw_data):
    data = json.loads(raw_data)
    #print("Data: {0}".format(data))
    state = data['gamestate']
    if state == "new":
      return self.create_new_game(data)
    else:
      return self.increment_game(data)
    
  def create_new_game(self, data):
    game_key = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(8))
    username = data["name"]
    ship = self.new_ship(username)
    milli_time = utils.get_time()
    print("Made ship!")
    asteroid = self.make_asteroid(1, 2)
    print("Made asteroid!")
    game_state = {
      "game_id": game_key,
      "ships": [
        ship,
      ],
      "last_updated": milli_time,
      "asteroids": [
        asteroid
      ]
    }
    self.games[game_key] = game_state
    return json.dumps(game_state)
  
  @staticmethod
  def increment_game(game_state):
    time_delta = utils.get_time() - game_state["last_updated"]
    ships = Ship.from_dict(game_state["ships"])
    
    ship = self.move_ship(game_state, ship["keys"], ship, time_delta)
    
    game_state["ship"] = ship.to_dict()
    game_state["last_updated"] = utils.get_time()
    self.games["game_id"] = game_state
    return json.dumps(game_state)
  
  @staticmethod
  def move_ship(game_state, data, ship, dt):
    print(dt)
    if data["up"]:
      ship.accelerate(AsteroidsGame.ACCELERATION * dt)
    if data["down"]:
      ship.accelerate(-AsteroidsGame.ACCELERATION * dt)
    if data["left"]:
      ship.rotate(-AsteroidsGame.TURN_SPEED * dt)
    if data["right"]:
      ship.rotate(AsteroidsGame.TURN_SPEED * dt)
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
        "x": AsteroidsGame.X_MAX / 2,
        "y": AsteroidsGame.Y_MAX / 2
        },
      "dir": -math.pi / 2,
      "speed": {
        "x": 0,
        "y": 0
        },
      "invuln_ticks": 50,
      "inputs": {
        "up": False,
        "down": False,
        "left": False,
        "up": False,
        "space": False,
      }
    }
  
  @staticmethod
  def make_asteroid(uid, stage):
    x = random.randint(0, 200)
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
  
  
    
    
    
    
    
    
    
    
    
    
  