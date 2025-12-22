/* ===================================
   script.js – Maikaʻi Wai LLC Horizontal/Vertical Site
   Professional, mobile-first scrolling experience
   =================================== */

// ===================================
// 1. Core Element References
// ===================================
const container = document.querySelector(".container");
const homeButton = document.getElementById("home-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const indicators = document.querySelectorAll(".indicator");

// ===================================
// 2. Utility: Detect Layout Mode
// ===================================
function isHorizontalMode() {
  return window.innerWidth >= 769; // Matches CSS breakpoint
}

// ===================================
// 3. Smooth Scroll to Specific Panel (Used by multiple features)
// ===================================
function scrollToPanel(index) {
  if (isHorizontalMode()) {
    container.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });
  } else {
    // Mobile: vertical smooth scroll to panel
    document
      .querySelectorAll(".panel")
      [index]?.scrollIntoView({ behavior: "smooth" });
  }
}

// ===================================
// 4. Navigation Controls
// ===================================

// Home button – return to hero section
homeButton.addEventListener("click", () => {
  scrollToPanel(0);
  updateUI();
});

// Desktop arrow buttons – previous/next panel
prevButton.addEventListener("click", () => {
  if (isHorizontalMode()) {
    container.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
    updateUI();
  }
});

nextButton.addEventListener("click", () => {
  if (isHorizontalMode()) {
    container.scrollBy({ left: window.innerWidth, behavior: "smooth" });
    updateUI();
  }
});

// Clickable page indicators – direct panel navigation
indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    if (!isHorizontalMode()) return;

    container.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });
    requestAnimationFrame(updateUI);
  });

  // Accessibility & UX enhancements
  indicator.style.cursor = "pointer";
  indicator.setAttribute("role", "button");
  indicator.setAttribute("tabindex", "0");
  indicator.setAttribute("aria-label", `Go to section ${index + 1}`);
});

// ===================================
// 5. UI Updates: Indicators & Arrow Visibility
// ===================================
function updateUI() {
  const horizontal = isHorizontalMode();

  if (horizontal) {
    const scrollIndex = Math.round(container.scrollLeft / window.innerWidth);

    // Update active indicator
    indicators.forEach((ind, i) => {
      ind.classList.toggle("active", i === scrollIndex);
    });

    // Hide arrows at boundaries
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const threshold = 50;

    prevButton.classList.toggle("nav-arrow--hidden", scrollLeft <= threshold);
    nextButton.classList.toggle(
      "nav-arrow--hidden",
      scrollLeft >= maxScroll - threshold
    );
  } else {
    // Mobile: ensure arrows are hidden and indicators inactive
    prevButton.classList.add("nav-arrow--hidden");
    nextButton.classList.add("nav-arrow--hidden");
    indicators.forEach((ind) => ind.classList.remove("active"));
  }
}

// ===================================
// 6. Mouse Wheel & Trackpad Scrolling (Desktop Only)
// ===================================
let isScrolling = false; // Prevents animation queueing during smooth scroll

container.addEventListener("wheel", (e) => {
  if (!isHorizontalMode()) return;

  // PRIORITY: Horizontal two-finger swipes (left/right) → let browser handle natively
  // This gives natural momentum and allows fast multi-panel swipes
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return; // Do not preventDefault → enables native inertia
  }

  // Vertical wheel or up/down trackpad gestures → step one panel at a time
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault(); // Block vertical page bounce

    if (isScrolling) return; // Avoid interfering with ongoing animation

    const direction = e.deltaY > 0 ? 1 : -1;
    const currentIndex = Math.round(container.scrollLeft / window.innerWidth);
    let targetIndex = currentIndex + direction;

    const maxIndex = document.querySelectorAll(".panel").length - 1;
    targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

    if (targetIndex === currentIndex) return;

    isScrolling = true;

    container.scrollTo({
      left: targetIndex * window.innerWidth,
      behavior: "smooth",
    });

    // Reset lock after animation
    setTimeout(() => {
      isScrolling = false;
    }, 900);

    // Keep UI responsive during scroll
    const syncUI = () => {
      updateUI();
      if (
        Math.abs(container.scrollLeft - targetIndex * window.innerWidth) > 1
      ) {
        requestAnimationFrame(syncUI);
      }
    };
    requestAnimationFrame(syncUI);
  }
});

// ===================================
// 7. Focus Management – Professional Smooth Scrolling Reliability
// ===================================

// Make container focusable (required for consistent smooth programmatic scrolling)
function enableContainerFocus() {
  if (isHorizontalMode()) {
    container.setAttribute("tabindex", "-1"); // Focusable but not in tab order
    container.style.outline = "none"; // Clean visual appearance
    container.focus({ preventScroll: true });
  }
}

// Maintain focus after navigation clicks (prevents "dead" arrows/wheel after button use)
function maintainContainerFocus() {
  if (isHorizontalMode()) {
    container.focus({ preventScroll: true });
  }
}

// Apply on load and resize
enableContainerFocus();
window.addEventListener("resize", () => {
  enableContainerFocus();
  updateUI();

  // Reset mobile scroll on orientation change
  if (!isHorizontalMode()) {
    container.scrollTop = 0;
  }
});

// Re-focus container after any navigation interaction
homeButton.addEventListener("click", maintainContainerFocus);
prevButton.addEventListener("click", maintainContainerFocus);
nextButton.addEventListener("click", maintainContainerFocus);
indicators.forEach((ind) =>
  ind.addEventListener("click", maintainContainerFocus)
);

// ===================================
// 8. Core Event Listeners & Initialization
// ===================================
container.addEventListener("scroll", updateUI);
updateUI(); // Initial state on page load
