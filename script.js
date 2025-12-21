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
