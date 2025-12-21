document.getElementById("home-button").addEventListener("click", () => {
  console.log("Home button clicked — scrolling to hero");

  // Target the .container instead of window
  const container = document.querySelector(".container");
  container.scrollTo({
    left: 0,
    behavior: "smooth",
  });
});

// Previous / Next arrow navigation
const container = document.querySelector(".container");

document.getElementById("prev-button").addEventListener("click", () => {
  container.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
});

document.getElementById("next-button").addEventListener("click", () => {
  container.scrollBy({ left: window.innerWidth, behavior: "smooth" });
});

// Page indicator highlight (desktop only)
const indicators = document.querySelectorAll(".indicator");

function updateIndicators() {
  const scrollIndex = Math.round(container.scrollLeft / window.innerWidth);
  indicators.forEach((ind, i) => {
    ind.classList.toggle("active", i === scrollIndex);
  });
}

// Initial + on scroll
updateIndicators();
container.addEventListener("scroll", updateIndicators);

// Also update on resize (for orientation changes)
window.addEventListener("resize", updateIndicators);
