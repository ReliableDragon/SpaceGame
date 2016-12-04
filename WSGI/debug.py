import http.cookies, os

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
