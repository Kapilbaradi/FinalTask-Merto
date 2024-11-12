const wrapper = document.querySelector(".wrapper");
const slider = document.querySelector(".slider");
const firstCardWidth = slider.children[0].offsetWidth; // offsetWidth =  element width with padding and border
const sliderChildren = [...slider.children];
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

var isDraggable = false,
  startX,
  startScrollLeft,
  isAutoPlay = true,
  timeoutId;

let i = 1;

// get number of cards we can view in slider or fit in slider at once.
let productPerView = Math.round(slider.offsetWidth / firstCardWidth);

// adding the few end products to the beggining of the produce slider for infinite scrolling
sliderChildren
  .slice(-productPerView)
  .reverse()
  .forEach((product) => {
    slider.insertAdjacentHTML("afterbegin", product.outerHTML);
  });

//adding few starting products to the end of the product slider for infinite scrolling.
sliderChildren.slice(0).forEach((product) => {
  slider.insertAdjacentHTML("beforeend", product.outerHTML);
});

function dragStart(event) {
  isDraggable = true;
  // Get the initial Location of the cursor form where you started dragging
  startX = event.pageX;
  startScrollLeft = slider.scrollLeft;
  slider.style.scrollBehavior = "auto";
}
function drag(event) {
  if (!isDraggable) return;
  slider.scrollLeft = startScrollLeft - (event.pageX - startX);
}

function dragStop() {
  isDraggable = false;
  slider.style.scrollBehavior = "smooth";
}

function infinteScroll() {
  //if the slider is at the beginning, scroll to the end.
  if (slider.scrollLeft === 0) {
    slider.scrollLeft = slider.scrollWidth - 2 * slider.offsetWidth;
  }
  // if the carousel is at the end, scroll to the beginning.
  else if (
    Math.ceil(slider.scrollLeft) ===
    slider.scrollWidth - slider.offsetWidth
  ) {
    slider.scrollLeft = slider.offsetWidth;
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over slider.
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
}

function autoPlay() {
  if (!isAutoPlay) return;
  timeoutId = setTimeout(() => {
    slider.scrollLeft += firstCardWidth;
    console.log(slider.scrollLeft)
  }, 2500);
}
autoPlay();

slider.addEventListener("mousedown", dragStart);
slider.addEventListener("touchstart", dragStart);

slider.addEventListener("mousemove", drag);
slider.addEventListener("touchmove", drag);

document.addEventListener("mouseup", dragStop);
slider.addEventListener("touchend", dragStop);

slider.addEventListener("scroll", infinteScroll);
wrapper.addEventListener("mouseenter", () => {
  clearTimeout(timeoutId);
});
wrapper.addEventListener("mouseleave", autoPlay);
