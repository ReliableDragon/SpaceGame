import os, sys, itertools
#import logging
import site 
site.addsitedir(os.path.dirname(__file__))
import ajax, logger, socket

#logger = logging.getLogger("spacegame")
env = ""

def withEndings(file):
  return [file + ".html", file + ".css", file + ".js"]

def process_uri(uri, env_dict):
  global env
  env = env_dict

  output = ""
  status = "200 OK"
  content_type = "text/HTML"
  url_pieces = uri.split("?")
  path = url_pieces[0]
  query = ""
  if len(url_pieces) > 1:
    query = url_pieces[1]
  path = forwardPath(path)
  logger.log(env, "Looking for path: {0}".format(path))
  if isValidPage(path):
    page = open(path[1:], 'r')
    output += page.read()
    if path[-4:] == ".css":
      content_type = "text/CSS"
  elif ajax.isValidAjax(path):
    output = ajax.processAjax(env, path, query)
    logger.log(env, "Ajax response: {0}".format(output))
    return output,"200 OK","text/plain"
  elif isValidResource(path):
    imageType = path.split('.')[-1]
    return openImg(path),"200 OK","image/{0}".format(imageType)
  elif isValidSocket(path):
    output = socket.process(path, env)
    return output,"200 OK","text/plain"
  else:
    output += "No luck finding that URI!"
    status = "404 Not Found Dawg"

  if  "DEBUG"  in query:
    output += getDebugInfo(env, path, query)
  
  return output,status,content_type

def forwardPath(path):
  if path == "/":
    return "/default.html"
  else:
    return path

def isValidPage(path):
  pages = ["/default", "/breakout", "/game"]
  with_endings = itertools.chain.from_iterable([withEndings(a) for a in pages])
  if path in with_endings:
    return True
  else:
    return False

def isValidResource(path):
  resources = ["/img/space.jpg", "/img/illusion.png"]
  if path in resources:
    return True
  else:
    return False

def openImg(path):
  logger.log(env, "Attempting to open image {0}.".format(path))
  f = open(env["CONTEXT_DOCUMENT_ROOT"] + path, "rb")
  data = f.read()
  f.close()
  return data

def getDebugInfo(env, path, query):
  output = ""
  output += "<p>\n\nDEBUG INFO BELOW:</p>"
  for key, value in env.items():
    output += "<p>" + str(key) + " | " + str(value) + "</p>"
  output += "<p>Path: " + str(path) + "</p>"
  output += "<p>Query: " + str(query) + "</p>"
  dir_path = os.path.dirname(__file__)
  output += "<p>Directory: " + dir_path + "</p>"
  output += "<p>Files: " + str(os.listdir()) + "</p>"
  output += "<p>User ID: " + str(os.getuid()) + "</p>"
  output += makePar("Input: " + str(env['wsgi.input'].read()))
  if "HTTP_COOKIE" in env:
    cookie = http.cookies.SimpleCookie()
    cookie.load(env['HTTP_COOKIE'])
    for key, value in cookie.items():
      output += makePar("Cookie[{0}]: {1}".format(key, value.OutputString()))

  return output

def makePar(s):
  return "<p> " + s + " </p>"
