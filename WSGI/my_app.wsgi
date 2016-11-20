import os
import logging
#os.environ['PYTHON_EGG_CACHE'] = '/Libary/WebServer/Documents/spacegame.com'

logger = logging.getLogger(__name__)

def application(env, start_response):
  os.chdir(env['CONTEXT_DOCUMENT_ROOT'])
  logging.basicConfig(filename="server_log.txt", level="INFO")
  output = ""
  status = '200 OK'
  logger.info("Got a {0} request for URI {1}".format(env["REQUEST_METHOD"], env["REQUEST_URI"]))
  output += process_uri(env["REQUEST_URI"], env)
  
  byte_output = output.encode('utf-8')

  response_headers = [('Content-type', 'text/HTML'),
                      ('Content-length', str(len(byte_output)))]
  start_response(status, response_headers)

  return [byte_output]

def process_uri(uri, env):
  output = ""
  url_pieces = uri.split("?")
  path = url_pieces[0]
  query = ""
  if len(url_pieces) > 1:
    query = url_pieces[1]
  if isValid(path):
    landingPage = open(path[1:], 'r')
    output += landingPage.read()
  else:
    output += "Hello, World!"

  if "DEBUG"  in query:
    output += getDebugInfo(env, path, query)

  return output + "\n"

def isValid(path):
  if path == "/default.html" or path == "/default.js":
    return True
  else:
    return False

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
  return output

def makePar(s):
  return "<p> " + s + " </p>"
