import json, random, string, math, time, threading
from player_ship import Ship
from asteroid import Asteroid
import utils

# This class runs the actual asteroids game logic.
# Internally the coordinate system used is 200x100, so the client has to convert.
# The loop is started in socket_server.py, and runs as long as the server is up.
# On create:
#   - The client will provide a username, and the server will create a game_id.
#   - The server will then return the inital state of the game space.
# TODO: Add a unique ship identifier to avoid collisions and prevent spoofing.
# TODO: Require usernames to be unique.
# On update:
#   - The client will provide their game_id and username, which uniquely identify
#     their ship, along with information on inputs.
#   - The server will then update the ship's input status, and send back the current
#     game state.

lock = threading.Lock()

# TODO: Add more fault-tolerance and error checking.
class AsteroidsGame(object):
  ACCELERATION = 0.005;
  TURN_SPEED = 0.0075;
  SHIP_TOP_SPEED = 5;
  
  def __init__(self):
    self.games = {}
    
  def loop(self):
    while True:
      start_time = utils.get_time()
      for game_id in list(self.games):
        self.increment_game(game_id)
      end_time = utils.get_time()
      # The goal here is 17ms loops, which corresponds to 60fps, which is the speed that
      # the client updates at, so there's not a lot of reason to update faster. However,
      # if we get behind the algorithm uses delta time, so it will keep up, it just might
      # get jerkier.
      sleep_time = 17 - (end_time - start_time)
      if sleep_time > 0:
        time.sleep(sleep_time / 1000)

  # TODO: Standardize use of json.dumps, ideally use once at end of function.
  def input(self, raw_data):
    try:
      data = json.loads(raw_data)
    except JSONDecodeError:
      print("Invalid JSON recieved. Was: {0}".format(raw_data))
      return json.dumps({"error": "300 invalid json"})
      
    state = data['gamestate']
    if "game_id" in data and data["game_id"] not in self.games:
      print("Attempted to join invalid game: {0}\nFull data dump: {1}".format(data["game_id"], data))
      return json.dumps({"error": "404 game not found"})
    if state == "new":
      print("New game: {0}".format(data))
      return self.create_new_game(data)
    elif state == "join":
      print("Joining game: {0}".format(data))
      return self.add_player_to_game(data)
    elif state == "ongoing":
      self.update_player(data)
      game_id = data["game_id"]
      with lock:
        return json.dumps(self.games[game_id])
    else:
      raise Exception("Invalid request!\n{0}".format(data))
    
  def create_new_game(self, data):
    game_key = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(8))
    print("New game created! Key is {0}".format(game_key))
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
    
    with lock:
      self.games[game_key] = game_state
    
    return json.dumps(game_state)
  
  # Preconditions: data contains key "game_id", and game exists.
  # TODO: Ensure usernames are unique.
  def add_player_to_game(self, data):
    game_id = data["game_id"]
    username = data["name"]
    
    with lock:
      game_data = self.games[game_id]
      
    new_ship = self.new_ship(username)
    game_data["ships"].append(new_ship)
    
    return json.dumps(game_data)
  
  def update_player(self, data):
    game_id = data["game_id"]
    name = data["name"]
    
    with lock:
      game_data = self.games[game_id]

    # TODO: Switch to using unique ids for the ships.
    # TODO: Keep ships as a map keyed by id.
    ship_index = -1
    raw_ships = game_data["ships"]
    for i in range(0, len(raw_ships)):
      if raw_ships[i]["name"] == name:
        ship_index = i
        break
    if ship_index == -1:
      raise Exception("Failed to find ship!")
    ship_dict = raw_ships[i]
    ship_dict["inputs"] = data["keys"]
    ship_dict["last_updated"] = utils.get_time()
    with lock:
      self.games[game_id]["ships"][i] = ship_dict
  
  def increment_game(self, game_id):
    with lock:
      game_state = self.games[game_id]
    current_time = utils.get_time()
    time_delta = current_time - game_state["last_updated"]
    raw_ships = game_state["ships"]
    raw_asteroids = game_state["asteroids"]
    ships = [Ship.from_dict(s) for s in raw_ships]
    asteroids = [Asteroid.from_dict(a) for a in raw_asteroids]
    i = 0
    shipsLength = len(ships)
    while i < shipsLength:
      ship = ships[i]
      # Remove ships that time out. Update them in case of death effects.
      if ship.leaving and current_time - ship.last_updated > 500:
        print("Ship leaving: {0}".format(ship.name))
        ships.pop(i)
        shipsLength -= 1
      elif current_time - ship.last_updated > 5000:
        ship.leaving = True
        ship.update()
        i += 1
      else:
        AsteroidsGame.move_ship(ship, time_delta)
        i += 1
    for asteroid in asteroids:
      asteroid.update()
    raw_ships = [s.to_dict() for s in ships]
    raw_asteroids = [a.to_dict() for a in asteroids]
    
    game_state["ships"] = raw_ships
    game_state["asteroids"] = raw_asteroids
    game_state["last_updated"] = utils.get_time()
    with lock:
      self.games[game_id] = game_state
    return json.dumps(game_state)
  
  @staticmethod
  def move_ship(ship, dt):
    # TODO: Potentially move into ship class.
    if ship.inputs["up"]:
      ship.accelerate(AsteroidsGame.ACCELERATION * dt)
    if ship.inputs["down"]:
      ship.accelerate(-AsteroidsGame.ACCELERATION * dt)
    if ship.inputs["left"]:
      ship.rotate(-AsteroidsGame.TURN_SPEED * dt)
    if ship.inputs["right"]:
      ship.rotate(AsteroidsGame.TURN_SPEED * dt)
    if ship.inputs["space"]:
      ship.fire()
      pass
    ship.update()
    return ship
  
  @staticmethod
  def new_ship(username):
    ship_dict = Ship(name=username).to_dict()
    return ship_dict
  
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
    speed = random.random() / 50
    dx = math.cos(direction) * speed
    dy = math.sin(direction) * speed
    size = 8 + random.random() * 2
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
        "num_children": num_children,
        "rotation": 0,
        "dead": False,
    }
  
  
    
    
    
    
    
    
    
    
    
    
  