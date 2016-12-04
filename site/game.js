var sock;
var opened = false;

function onButton() {
  console.log("Started!");
  var socket = new WebSocket('ws://spacegame.com:8080');
  socket.onopen = function() {
    console.log("Opened!");
    opened = true;
    socket.send(JSON.stringify({
      id: 1,
      data: "test"
      }));
    console.log("Sent!");
  };
  socket.onmessage = function(s) {
    console.log("Received Message: " + s);
  };
  sock = socket;
}

function onSendButton() {
  if (opened) {
    console.log("Sending...");
    sock.send(JSON.stringify({
      id: 1,
      data: "test"
      }));
    console.log("Sent!");
  } else {
    console.log("Socket not open!");
  }
}