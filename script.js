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

// Make page indicators clickable for direct navigation
indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    if (!isHorizontalMode()) return;

    container.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });

    // Update UI immediately
    requestAnimationFrame(updateUI);
  });

  // Improve accessibility and hover feedback
  indicator.style.cursor = "pointer";
  indicator.setAttribute("role", "button");
  indicator.setAttribute("tabindex", "0");
  indicator.setAttribute("aria-label", `Go to section ${index + 1}`);
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

// Horizontal mouse wheel/trackpad scrolling on desktop – smart & smooth
let isScrolling = false;

container.addEventListener("wheel", (e) => {
  if (!isHorizontalMode()) return;

  // Only handle vertical scrolling (most common on trackpads and wheels)
  if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

  e.preventDefault();

  // If already animating to a panel, ignore new events until done
  if (isScrolling) return;

  const direction = e.deltaY > 0 ? 1 : -1;
  const currentScroll = container.scrollLeft;
  const pageWidth = window.innerWidth;
  const currentIndex = Math.round(currentScroll / pageWidth);

  // Calculate target panel
  let targetIndex = currentIndex + direction;

  // Clamp to bounds
  const maxIndex = document.querySelectorAll(".panel").length - 1;
  targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

  // Only proceed if we're actually moving to a different panel
  if (targetIndex === currentIndex) return;

  // Mark as scrolling and perform smooth scroll
  isScrolling = true;

  container.scrollTo({
    left: targetIndex * pageWidth,
    behavior: "smooth",
  });

  // Clear flag after animation completes (~600–800ms for smooth scroll)
  // Use a longer timeout to be safe across devices
  setTimeout(() => {
    isScrolling = false;
  }, 900);

  // Update UI during scroll for responsive feedback
  const checkScroll = () => {
    updateUI();
    if (Math.abs(container.scrollLeft - targetIndex * pageWidth) > 1) {
      requestAnimationFrame(checkScroll);
    }
  };
  requestAnimationFrame(checkScroll);
});

// Initial update
updateUI();
