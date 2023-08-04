const webinfo = document.querySelector(".webinfo");
const welcomeDiv = document.querySelector(".welcomeDiv");
window.addEventListener("load", (event) => {
    welcomeDiv.classList.add("activate")
    webinfo.classList.add("activate")
  });
  
function myFunction() {
  var x = document.getElementById("myInput");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}