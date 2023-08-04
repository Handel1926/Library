const hamburger = document.querySelector(".hamburger");
const navList = document.querySelector(".apmul");
var slides = document.querySelectorAll(".slide");
var btns = document.querySelectorAll(".btn");
let currentSlide = 1;

var manualNav = function (manual) {
  slides.forEach((slide, i) => {
    slide.classList.remove("activate");

    btns.forEach((btn, i) => {
      btn.classList.remove("activate");
    });

  });

  slides[manual].classList.add("activate");
  btns[manual].classList.add("activate");
}

btns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    manualNav(i);
    currentSlide = i;
  })
});

var reapet = () =>{
  let activate = document.getElementsByClassName("activate");
  let i = 1;

  var reapeter = () => {
    setTimeout(function() {
      [...activate].forEach((activeslide, i) => {
        activeslide.classList.remove("activate");
      });


      slides[i].classList.add("activate");
      btns[i].classList.add("activate");
      i++;
      if (slides.length == i) {
        i = 0;
      }
      if (i >= slides.length){
        return;
      }
      reapeter();
    }, 10000)
  }
  reapeter();
}
reapet();


hamburger.addEventListener("click", function(){
    hamburger.classList.toggle("active");
    navList.classList.toggle("active");
});
