function onButton() {
  //alert("Started!");
  var socket = new WebSocket('ws://spacegame.com:8080');
  socket.onopen = function() {
  socket.send(JSON.stringify({
    id: 1,
    data: "test"
    }));
    console.log("Sent!");
  };
  socket.onmessage = function(s) {
    console.log("Received Message: " + s);
  };
}