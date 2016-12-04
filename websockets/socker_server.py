import socket
import threading
import socketserver
import spaceWS, WSLogger

http_msg = b'GET / HTTP/1.1'

class WSHandler(socketserver.BaseRequestHandler):
    handshook = False

    def handle(self):
        global http_msg

        self.data = self.request.recv(4096).strip()
        WSLogger.log(self.data.decode('utf-8'))

        if not WSHandler.handshook:
          lines = self.data.split(b"\r\n")
          if not http_msg in lines:
            print("Not websocket request!")
            return

          lines.remove(http_msg)
          headers = {}
          for l in lines:
            sline = l.decode('utf-8')
            colon_loc = sline.index(': ')
            if colon_loc == -1 or colon_loc == 0 or colon_loc > len(sline)-1:
              break
            headers[sline[:colon_loc]] = sline[colon_loc+2:]

            self.data = spaceWS.handshake(headers)
        else:
          self.data = spaceWS.handle(self.data)

        self.request.sendall(self.data)

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

##def client(ip, port, message):
##    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
##    sock.connect((ip, port))
##    print("Connected!")
##    try:
##        sock.sendall(bytes(message, 'ascii'))
##        print("Sent!")
##        response = str(sock.recv(1024), 'ascii')
##        print("Received: {}".format(response))
##    finally:
##        sock.close()

if __name__ == "__main__":
    # Port 0 means to select an arbitrary unused port
    HOST, PORT = "localhost", 0

    server = ThreadedTCPServer((HOST, PORT), WSHandler)
    ip, port = server.server_address

    # Start a thread with the server -- that thread will then start one
    # more thread for each request
    server_thread = threading.Thread(target=server.serve_forever)
    # Exit the server thread when the main thread terminates
    server_thread.daemon = True
    server_thread.start()

    #Message to make sure it works.
    #client(ip, port, "Hello World 1\n")

    while True:
      q = input("Enter to quit.")
      if q == 'q':
        server.shutdown()
        break




