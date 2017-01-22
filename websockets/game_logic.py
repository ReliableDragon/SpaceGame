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
  SHIP_TOP_SPEED = 5;
  
  def __init__(self):
    # This should contain the actual objects, not the dictionary versions.
    self.games = {}
    
  def loop(self):
    while True:
      start_time = utils.get_time()
      for game_id in list(self.games):
        with lock:
          game = self.games[game_id]
        self.collision_detection(game)
        self.increment_game(game)
        self.games[game_id] = game
      end_time = utils.get_time()
      # The goal here is 17ms loops, which corresponds to 60fps, which is the speed that
      # the client updates at, so there's not a lot of reason to update faster. However,
      # if we get behind the algorithm uses delta time, so it will keep up, it just might
      # get jerkier.
      sleep_time = 17 - (end_time - start_time)
      if sleep_time > 0:
        time.sleep(sleep_time / 1000)

  def input(self, raw_data):
    try:
      data = json.loads(raw_data)
    except JSONDecodeError:
      print("Invalid JSON recieved. Was: {0}".format(raw_data))
      return json.dumps({"error": "300 invalid json"})
      
    state = data['gamestate']
    response = None
      
    if "game_id" in data and data["game_id"] not in self.games:
      return json.dumps({"error": "404 game not found"})
    
    if state == "new":
      print("New game: {0}".format(data))
      response = self.create_new_game(data)
    elif state == "join":
      print("Joining game: {0}".format(data))
      response =  self.add_player_to_game(data)
    elif state == "ongoing":
      self.update_player(data)
      game_id = data["game_id"]
      with lock:
        response = self.games[game_id].copy()
    else:
      raise Exception("Invalid request!\n{0}".format(data))
    
    response["ships"] = [s.to_dict() for s in response["ships"]]
    response["asteroids"] = [a.to_dict() for a in response["asteroids"]]

    return json.dumps(response)
    
  def create_new_game(self, data):
    game_key = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(8))
    print("New game created! Key is {0}".format(game_key))
    username = data["name"]
    ship = Ship(name=username)
    milli_time = utils.get_time()
    print("Made ship!")
    asteroid = Asteroid.make_asteroid()
    print("Made asteroid!")
    game_state = {
      "game_id": game_key,
      "ships": [
        ship
      ],
      "last_updated": milli_time,
      "asteroids": [
        asteroid
      ],
      "level": 1,
    }
    
    with lock:
      self.games[game_key] = game_state
    
    return game_state.copy()
  
  # Preconditions: data contains key "game_id", and game exists.
  # TODO: Ensure usernames are unique.
  def add_player_to_game(self, data):
    game_id = data["game_id"]
    username = data["name"]
    
    with lock:
      game_data = self.games[game_id]
      
    new_ship = Ship(name = username)
    game_data["ships"].append(new_ship)
    
    return game_data.copy()
  
  def update_player(self, data):
    game_id = data["game_id"]
    name = data["name"]
    
    with lock:
      game_data = self.games[game_id]

    # TODO: Switch to using unique ids for the ships.
    # TODO: Keep ships as a map keyed by id.
    ship_index = -1
    ships = game_data["ships"]
    for i in range(0, len(ships)):
      if ships[i].name == name:
        ship_index = i
        break
    if ship_index == -1:
      raise Exception("Failed to find ship!")
    ship = ships[i]
    ship.set_inputs(data["keys"])
    ship.last_updated = utils.get_time()
    with lock:
      ships[i] = ship

  def increment_game(self, game_state):
    current_time = utils.get_time()
    time_delta = current_time - game_state["last_updated"]
    
    ships = game_state["ships"]
    asteroids = game_state["asteroids"]
    
    i = 0
    shipsLength = len(ships)
    while i < shipsLength:
      ship = ships[i]
      # Remove ships that time out. Mark them as leaving for half a second
      # first, so that the client has time to display some nice blink effect
      # or something down the road.
      if ship.leaving and current_time - ship.last_updated > 500:
        print("Ship leaving: {0}".format(ship.name))
        ships.pop(i)
        shipsLength -= 1
      elif current_time - ship.last_updated > 5000:
        ship.leaving = True
        ship.update(time_delta)
        i += 1
      else:
        ship.update(time_delta)
        i += 1
    
    i = 0
    asteroidsLen = len(asteroids)
    while i < asteroidsLen:
      asteroid = asteroids[i]
      asteroid.update()
      if asteroid.dead:
        asteroids.pop(i)
        asteroidsLen -= 1
      else:
        i += 1
    
    game_state["ships"] = ships
    game_state["asteroids"] = asteroids
    game_state["last_updated"] = utils.get_time()

  # TODO: Find a better way to handle collisions.
  def collision_detection(self, game):
    ships = game["ships"]
    asteroids = game["asteroids"]
    
    for ship in ships:
      for i in range(0, len(ship.bullets)):
        for j in range(0, len(asteroids)):
          
          bullet = ship.bullets[i]
          asteroid = asteroids[j]
          distance = math.hypot(bullet.center.x - asteroid.center.x, bullet.center.y - asteroid.center.y)
          
          if distance < asteroid.size and not bullet.dead and not asteroid.dead:
            ship.score += math.floor(100 * (5 - asteroid.stage) * math.pow(1.2, game["level"]-1))
            bullet.dead = True
            asteroid.dead = True
            
            new_asteroids = asteroid.split()
            asteroids += new_asteroids
            
            if len(asteroids) == 0:
              game["levelover"] = True

        for i in range(0, len(asteroids)):
          asteroid = asteroids[i]
          if not asteroid.dead and AsteroidsGame.asteroid_intersects_ship(asteroid, ship) and not ship.is_invulnerable():
              ship.dead = True

    game["ships"] = ships
    game["asteroids"] = asteroids

  @staticmethod
  def asteroid_intersects_ship(asteroid, ship):    
    shipBox = ship.getBoundingBox()
   
    for i in range(0, len(shipBox)):
      if asteroid.center.dist(shipBox[i]) < asteroid.size:
        return True
   
    return False



    
    
    
    
    
    
    
    
    
  