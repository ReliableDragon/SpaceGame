function onButton() {
  alert("Started!");
  var socket = new WebSocket('ws://www.spacegame.com/socket');
  socket.onopen = function() {
    socket.send('test');
    alert("Sent!");
  };
  socket.onmessage = function(s) {
    alert("Received Message: " + s);
  };
  socket.send(JSON.stringify({
    id: 1,
    data: "test"
    }));
}