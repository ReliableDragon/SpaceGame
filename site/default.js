// Basically a dummy function for testing.
function AlertOnSuccess() {
  alert("Alert!");
}

// AJAX testing. This is a work in progress, I'm not 100% sure how this will work with WSGI, but it should be possible.
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
  var params = "thisGuy=Mr. Yell-y Man";

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