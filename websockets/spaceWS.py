import os, hashlib, base64, struct
import game_logic

test = b'\x81\x96\xa8z\xc8\r\xd3X\xa1i\x8a@\xf9!\x8a\x1e\xa9y\xc9X\xf2/\xdc\x1f\xbby\x8a\x07'
test2 = b"\x88\x9a\rA\x80\xec\x0e\xab\xcd\x8d~*\xe5\x88-'\xf2\x8d`$\xa0\x8a\x7f.\xed\xcc~$\xf2\x9ah3"
test3 =  b'\x81\xc2\xabv\\\xdd\xd0T)\xad\x89L:\xbc\xc7\x059\xf1\x89\x123\xaa\xc5Tf\xbb\xca\x1a/\xb8\x87T0\xb8\xcd\x02~\xe7\xcd\x170\xae\xceZ~\xaf\xc2\x114\xa9\x89L:\xbc\xc7\x059\xf1\x89\x05,\xbc\xc8\x13~\xe7\xcd\x170\xae\xce'

magic_string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def handshake(headers):                                                            
  accCode = headers["Sec-WebSocket-Key"] + magic_string
  accCode = accCode.encode("utf-8")

  m = hashlib.sha1()
  m.update(accCode)

  accCode = base64.b64encode(m.digest()).decode("utf-8")                                                                   

  resp = "HTTP/1.1 101 Switching Protocols\n" + \
          "Upgrade: websocket\n" + \
          "Connection: Upgrade\n" + \
          "Sec-WebSocket-Accept: {0}\n\n".format(accCode)
  return resp.encode('utf-8')

class Handler:

  def __init__(self, game):
    self.msg = ""
    self.mask = b""
    self.opcode = 0
    self.masked = False
    self.done = True
    self.length = -1
    self.decoded = b""
    self.buffer = b""
    self.game = game

  def handle(self, data):
    # print("Handling data frame: " + str(data))
    
    # This is opcode 1001, which means "close".
    if data == b"\x03\xe9":
      return True
    self.buffer += data
    msgLen,bytes_used = getMsgLenAndSize(self.buffer)
    overheadLen = 5 + bytes_used
    #print("Buffer size: {0}\nMessage length: {1}\nBytes used: {2}".format(len(self.buffer), msgLen, bytes_used))
    if  len(self.buffer) - overheadLen < msgLen:
      #print("Message not finished. Buffering...")
      return False
    else:
      #print("Decoding!")
      self.decodeMessage(self.buffer)
      return self.done

  def getMessage(self):
    return self.msg

  def decodeMessage(self, bs):
    bloc = 0

    lastMessage = bs[0] & 128 != 0
    self.opcode = bs[0] & 7
    self.masked = bs[1] & 128 != 0

    msgLen = getSix(bs)
    bloc = 2
    if msgLen == 126:
      msgLen = getSixteen(bs, bloc)
      bloc = 4
    elif msgLen == 127:
      msgLen = getSixtyFour(bs, bloc)
      bloc = 10

    # XOR mask for decrypting message.                                                                                    
    self.mask = bs[bloc:bloc+4]
    bloc += 4
    data = bs[bloc:bloc+msgLen]

    payload = unmask(data, self.mask, msgLen)
    if self.done:
      self.decoded = payload
    else:
      self.decoded += payload

    if lastMessage:
      #TODO: Decrypt differently depending on data type.
      self.buffer = b""
      #print("Done! Precoding: {0}".format(self.decoded))
      try:
        self.msg = self.game.input(self.decoded.decode('utf-8'))
      except UnicodeDecodeError as e:
        print("Got message that was not unicode. Trying close opcodes...")
        opcode = struct.unpack("!h", self.decoded)[0]
        if opcode == 1000:
          print("Connection closed normally.")
        elif opcode == 1001:
          print("Endpoint going away. (Browser navigation or refresh)")
        elif opcode == 1002:
          print("Connection terminated due to protocol error.")
        elif opcode == 1003:
          print("Connection terminated because the endpoint received data it could not accept.")
        else:
          print("Not a valid opcode. (Got {0}. Hex: {1})".format(opcode, self.decoded))
        self.decoded = b""
        #print("Exception: {0}\nError decoding message: {1}\nType: {2}".format(str(e), self.decoded, type(self.decoded)))

    self.done = lastMessage

  def frameForMessage(self, msg, opcode):
    #print("Encoding message: {0}".format(msg))
    result = b""
    result += bytes([128 + opcode])
    if len(msg) < 126:
      result += bytes([len(msg)])
    elif len(msg) < 2**16-1:
      result += bytes([126])
      result += struct.pack('>H', len(msg))
    else:
      result += bytes([127])
      result += struct.pack('>Q', len(msg))
    result += msg
    return result
  
  
def getMsgLenAndSize(data):
  msgLen = getSix(data)
  bloc = 2
  if msgLen == 126:
    msgLen = getSixteen(data, bloc)
    bloc = 4
  elif msgLen == 127:
    msgLen = getSixtyFour(data, bloc)
    bloc = 8
  return msgLen,bloc-1


def unmask(data, mask, msgLen):
  result = b""
  for i in range(0, msgLen):
    result += bytes([data[i] ^ mask[i % 4]])
  return result

def getSix(bs):
  return bs[1] & 127

# Start byte is zero indexed.                                                                                             
def getSixteen(bs, startByte = 2):
  numBytes = 2
  return struct.unpack('>H', bs[startByte:startByte+numBytes])[0]

# Start byte is zero indexed.                                                                                             
def getSixtyFour(bs, startByte = 2):
  numBytes = 8
  return struct.unpack('>Q', bs[startByte:startByte+numBytes])[0]

