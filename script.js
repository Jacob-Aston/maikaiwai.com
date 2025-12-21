// Main elements
const container = document.querySelector(".container");
const homeButton = document.getElementById("home-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const indicators = document.querySelectorAll(".indicator");

// Determine layout mode
function isHorizontalMode() {
  return window.innerWidth >= 769;
}

// Scroll to specific panel index
function scrollToPanel(index) {
  if (isHorizontalMode()) {
    container.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });
  } else {
    const panels = document.querySelectorAll(".panel");
    panels[index]?.scrollIntoView({ behavior: "smooth" });
  }
}

// Home button – always go to first panel
homeButton.addEventListener("click", () => {
  scrollToPanel(0);
  updateUI();
});

// Arrow navigation (desktop only)
prevButton.addEventListener("click", () => {
  if (isHorizontalMode()) {
    container.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
  }
});

nextButton.addEventListener("click", () => {
  if (isHorizontalMode()) {
    container.scrollBy({ left: window.innerWidth, behavior: "smooth" });
  }
});

// Update indicators and arrow states
function updateUI() {
  const horizontal = isHorizontalMode();

  if (horizontal) {
    const scrollIndex = Math.round(container.scrollLeft / window.innerWidth);

    indicators.forEach((ind, i) => {
      ind.classList.toggle("active", i === scrollIndex);
    });

    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const threshold = 50;

    prevButton.classList.toggle("nav-arrow--hidden", scrollLeft <= threshold);
    nextButton.classList.toggle(
      "nav-arrow--hidden",
      scrollLeft >= maxScroll - threshold
    );
  } else {
    // Mobile: hide arrows and deactivate all indicators
    prevButton.classList.add("nav-arrow--hidden");
    nextButton.classList.add("nav-arrow--hidden");
    indicators.forEach((ind) => ind.classList.remove("active"));
  }
}

// Event listeners
container.addEventListener("scroll", updateUI);
window.addEventListener("resize", () => {
  updateUI();
  // Reset scroll position on orientation/layout change
  if (!isHorizontalMode()) {
    container.scrollTop = 0;
  }
});

// Initial update
updateUI();
