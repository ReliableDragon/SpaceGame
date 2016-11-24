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
