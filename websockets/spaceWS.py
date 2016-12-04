import os, hashlib, base64
#site.addsitedir(os.path.dirname(__file__))                                                                               
#import logger, debug

#env = ""
magic_string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def handshake(headers):
  #global env
  #env = env_dict
  #debuginfo = debug.getDebugInfo(env, path, "")

  #logger.log(env, "SOCKET: {0}".format(debuginfo))
  #print("Shaking hands! Headers:\n{0}".format(str(headers)))

  accCode = headers["Sec-WebSocket-Key"] + magic_string
  accCode = accCode.encode("utf-8")

  m = hashlib.sha1()
  m.update(accCode)

  accCode = base64.b64encode(m.digest()).decode("utf-8")

  #resp_headers += [("Sec-WebSocket-Accept", accCode)]

  resp = "HTTP/1.1 101 Switching Protocols\n" + \
          "Upgrade: websocket\n" + \
          "Connection: Upgrade\n" + \
          "Sec-WebSocket-Accept: {0}\n\n".format(accCode)
  return resp.encode('utf-8')

def handle(data):
  print(data)
  return data
