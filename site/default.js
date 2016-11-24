// Basically a dummy function for testing.
function AlertOnSuccess() {
  alert("Alert!");
}

function rotate(img) {
  var image = document.getElementById(img);
  if (image.classList.contains('north')) {
    image.classList.add('east');
    image.classList.remove('north');
  } else if (image.classList.contains('east')) {
    image.classList.add('south');
    image.classList.remove('east');
  } else if (image.classList.contains('south')) {
    image.classList.add('west');
    image.classList.remove('south');
  } else if (image.classList.contains('west')) {
    image.classList.add('north');
    image.classList.remove('west');
  } 
}

// AJAX testing.
function asyncCall() {
  
  // Mostly boilerplate.
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "ajax.html", true);
  xhttp.onreadystatechange = function()  {
    if (xhttp.status == 200) {
      if (xhttp.readyState == 4) {
      document.getElementById("ajaxTest").innerHTML = xhttp.responseText;
      } else if (xhttp.readyState == 2) {
        document.getElementById("ajaxTest").innerHTML = "Loading...";
      }
    } else {
      alert("There was an error: " + xhttp.status);
    }
  };
  
  // Set up post arguments.
  var params = "message=Which is it? A duck or a bunny?";

  // These ensure that the request will be sent every time, and prevent the
  // browser from caching our page and pre-empting the ajax request.
  // TODO(gabe): Find out if there's a better way to achieve this.
  xhttp.setRequestHeader("Pragma", "no-cache");
  xhttp.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
  xhttp.setRequestHeader("Expires", 0);
  xhttp.setRequestHeader("Last-Modified", new Date(0));
  xhttp.setRequestHeader("If-Modified-Since", new Date(0));
  // Tell the XMLRequest that we're sending POST arguments.
  
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params);
}