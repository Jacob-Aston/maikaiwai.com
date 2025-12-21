// Main elements
const container = document.querySelector(".container");
const homeButton = document.getElementById("home-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const indicators = document.querySelectorAll(".indicator");

// ===================================
// 1. Home Button – Return to Hero
// ===================================
homeButton.addEventListener("click", () => {
  container.scrollTo({ left: 0, behavior: "smooth" });
  updateUI();
});

// ===================================
// 2. Arrow Navigation
// ===================================
prevButton.addEventListener("click", () => {
  container.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
  updateUI();
});

nextButton.addEventListener("click", () => {
  container.scrollBy({ left: window.innerWidth, behavior: "smooth" });
  updateUI();
});

// ===================================
// 3. UI Update – Indicators + Arrow Visibility
// ===================================
function updateUI() {
  const scrollIndex = Math.round(container.scrollLeft / window.innerWidth);

  // Update indicators
  indicators.forEach((ind, i) => {
    ind.classList.toggle("active", i === scrollIndex);
  });

  // Update arrow visibility
  const scrollLeft = container.scrollLeft;
  const maxScroll = container.scrollWidth - container.clientWidth;
  const threshold = 50;

  prevButton.classList.toggle("nav-arrow--hidden", scrollLeft <= threshold);
  nextButton.classList.toggle(
    "nav-arrow--hidden",
    scrollLeft >= maxScroll - threshold
  );
}

// ===================================
// 4. Event Listeners & Initial Call
// ===================================
container.addEventListener("scroll", updateUI);
window.addEventListener("resize", updateUI);
updateUI(); // Run on load
