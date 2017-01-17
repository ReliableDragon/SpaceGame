
function updateVisibility() {
  var radioValue = document.getElementById("optionsForm").isNew.value;
  var roomIdField = document.getElementById("roomDiv");
  roomIdField.style.display = radioValue == "New Game" ? "none" : "block";
}