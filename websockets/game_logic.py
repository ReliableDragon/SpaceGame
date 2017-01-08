import json

class AsteroidsGame:
  def __init__(self):
    self.games = {}
    
  def input(self, raw_data):
    data = json.loads(raw_data)
    print("JSON data: {0}".format(data))
    return json.dumps(data)