#import logging
import mysql.connector
import os
import site
site.addsitedir(os.path.dirname(__file__))
import logger
#logger = logging.getLogger("spacegame")
#logging.basicConfig(filename="server_log.txt", level="INFO")

env = ""

def isValidAjax(path):
  return path == "/ajax.html" or path == "/highscore.html"

def processAjax(env_dict, path, query):
  global env
  env = env_dict

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
    output += "{0}!\n".format(headers['message'])
  elif path == "/highscore.html":
    output = highscore(headers)

#  logger.info("Output: {0} | {1}".format(output, type(output)))

  return output

def highscore(headers):
  if "request" in headers and headers["request"] == "score":
    cnx = mysql.connector.connect(user='space', password='spaaaaace', host='dblocation', database='SpaceGame')
    try:
      cursor = cnx.cursor()
      cursor.execute("SELECT MIN(score) FROM Highscore") #TODO: Investigate injection.
      for (score,) in cursor: #For loop is required so all rows are "read".
        output = str(score)
        return output
    finally:
      cursor.close()
      cnx.close()
  elif "submit" in headers and headers["submit"] == "score":
    cnx = mysql.connector.connect(user='space', password='spaaaaace', host='127.0.0.1', database='SpaceGame')
    try:
      score = headers['score']
      username = headers['username']
      currentScore = -1
      cursor = cnx.cursor()
      cursor.execute("SELECT score FROM Highscore WHERE name='{0}'".format(username)) #TODO: Investigate injection.
      for (db_score,) in cursor: #For loop is required so all rows are "read".
        currentScore = db_score
      logger.log(env, "Score: {0}".format(currentScore))
      if currentScore == -1:
        logger.log(env, "INSERT")
        qry = ("INSERT INTO Highscore (name, score) VALUES (%s, %s)")
        record = (username, score)
        cursor.execute(qry, record)
        #cursor.execute("INSERT INTO Highscore (name, score) VALUES ('{0}', {1})".format(username, score))
      elif int(score) < currentScore:
        logger.log(env, "UPDATE")
        cursor.execute("UPDATE Highscore SET score='{0}' WHERE name='{1}'".format(score, username))
      
      cnx.commit()
      return str(score) # We have to return something. In the future, we ought to create a SOAP/REST API and use that instead.
    finally:
      cursor.close()
      cnx.close()

    
