import os, hashlib, base64
#site.addsitedir(os.path.dirname(__file__))
import logger, debug

env = ""
magic_string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def process(path, env_dict):
  global env
  env = env_dict
  debuginfo = debug.getDebugInfo(env, path, "")

  logger.log(env, "SOCKET: {0}".format(debuginfo))

  resp_headers = [("Upgrade", "websocket"), ("Connection", "Upgrade")]

  accCode = env["HTTP_SEC_WEBSOCKET_KEY"] + magic_string
  accCode = accCode.encode("utf-8")

  m = hashlib.sha1()
  m.update(accCode)

  accCode = base64.b64encode(m.digest()).decode("utf-8")

  resp_headers += [("Sec-WebSocket-Accept", accCode)]

  return "","101 Switching Protocols","text/plain",resp_headers

def isValidSocket(path):
  return 'socket' in path
