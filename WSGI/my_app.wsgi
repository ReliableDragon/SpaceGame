import os
import logging
import http.cookies

logger = logging.getLogger(__name__)

def application(env, start_response):
  os.chdir(env['CONTEXT_DOCUMENT_ROOT'])
  logging.basicConfig(filename="server_log.txt", level="INFO")
  output = ""
  content_type = ""
  status = '200 OK'
  logger.info("Got a {0} request for URI {1}".format(env["REQUEST_METHOD"], env["REQUEST_URI"]))

  output,status,content_type = process_uri(env["REQUEST_URI"], env)
  
  byte_output = output.encode('utf-8')

  response_headers = [('Content-type', content_type),
                      ('Content-length', str(len(byte_output)))]
  start_response(status, response_headers)

  return [byte_output]

def process_uri(uri, env):
  output = ""
  status = "200 OK"
  content_type = "text/HTML"
  url_pieces = uri.split("?")
  path = url_pieces[0]
  query = ""
  if len(url_pieces) > 1:
    query = url_pieces[1]
  path = forwardPath(path)
  if isValidPage(path):
    page = open(path[1:], 'r')
    output += page.read()
    if path[-4:] == ".css":
      content_type = "text/CSS"
  elif isValidAjax(path):
    output += processAjax(env, path, query)
  else:
    output += "No luck finding that URI!"
    status = "404 Not Found Dawg"

  if  "DEBUG"  in query:
    output += getDebugInfo(env, path, query)
  
  output += "\n"

  return output,status,content_type

def forwardPath(path):
  if path == "/":
    return "/default.html"
  else:
    return path

def isValidPage(path):
  if (path in withEndings("/default") or path in withEndings("/breakout")):
    return True
  else:
    return False

def withEndings(file):
  return [file + ".html", file + ".css", file + ".js"]

def isValidAjax(path):
  return path == "/ajax.html"

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

  if 'DEBUG' in header_text:
    output += getDebugInfo(env, path, query)
  
  return output

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
