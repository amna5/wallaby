

let currentSlide = 0;
const slider = document.getElementById("slider");
const dots = document.querySelectorAll(".dot");
const leftArrow = document.querySelector(".left");
const rightArrow = document.querySelector(".right");

function updateSlider() {
  slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
  
  dots.forEach(dot => dot.classList.remove("active"));
  dots[currentSlide].classList.add("active");

  updateArrows();
}

function updateArrows() {
  if (currentSlide === 0) {
    leftArrow.style.opacity = "0.3";
    leftArrow.style.pointerEvents = "none";
  } else {
    leftArrow.style.opacity = "1";
    leftArrow.style.pointerEvents = "auto";
  }

  if (currentSlide === 2) {
    rightArrow.style.opacity = "0.3";
    rightArrow.style.pointerEvents = "none";
  } else {
    rightArrow.style.opacity = "1";
    rightArrow.style.pointerEvents = "auto";
  }
}


function nextSlide() {
  if (currentSlide < 2) {
    currentSlide++;
    updateSlider();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlider();
  }
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

// Initial state
updateSlider();




