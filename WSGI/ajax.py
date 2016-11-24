import logging
import mysql.connector

logger = logging.getLogger("spacegame")
#logging.basicConfig(filename="server_log.txt", level="INFO")


def isValidAjax(path):
  return path == "/ajax.html" or path == "/highscore.html"

def processAjax(env, path, query):
  output = ""
  header_text = env['wsgi.input'].read().decode('utf-8')
  headers_list = header_text.split("&")
  for i in range(0, len(headers_list)):
    headers_list[i] = headers_list[i].split("=")
  headers = {}
  for h in headers_list:
    if len(h) == 2:
      headers[h[0]] = h[1]

  if path == "/ajax.html":
    output += "That's president-elect {0}!\n".format(headers['thisGuy'])
  elif path == "/highscore.html":
    output = highscore()

  logger.info("Output: {0} | {1}".format(output, type(output)))

  return output

def highscore():
  cnx = mysql.connector.connect(user='space', password='spaaaaace', host='127.0.0.1', database='SpaceGame')
  try:
    cursor = cnx.cursor()
    cursor.execute("SELECT MAX(score) FROM Highscore") #TODO: Investigate injection.
    for (score,) in cursor: #For loop is required so all rows are "read".
      output = str(score)
    return output
  finally:
    cursor.close()
    cnx.close()
