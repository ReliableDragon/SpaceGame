window.onload = function() {
  updateVisibility();
}

function updateVisibility() {
  var radioValue = document.getElementById("optionsForm").isNew.value;
  var roomIdField = document.getElementById("roomDiv");
  var roomInput = document.getElementById("roomName");
  roomIdField.style.display = radioValue == "New Game" ? "none" : "block";
  roomInput.disabled = radioValue == "New Game" ? true : false;
}