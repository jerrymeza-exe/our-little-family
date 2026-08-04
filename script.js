const heartLayer = document.querySelector(".floating-hearts");
const secretButtons = document.querySelectorAll("[data-secret-trigger]");
const loveDialog = document.querySelector(".love-dialog");
const closeButton = document.querySelector(".dialog-close");
const okayButton = document.querySelector(".dialog-ok");
const heartBurst = document.querySelector(".heart-burst");
const memoryTrack = document.querySelector(".memory-track");
const memoryViewport = document.querySelector(".memory-viewport");
const memorySlides = [...document.querySelectorAll(".memory-slide")];
const memoryDots = [...document.querySelectorAll(".carousel-dot")];
const previousMemoryButton = document.querySelector(".carousel-prev");
const nextMemoryButton = document.querySelector(".carousel-next");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeMemory = 0;
let swipeStartX = 0;
let lastSecretTrigger = null;

const heartColors = ["#f277a8", "#d94f88", "#bca7e8", "#f6a9c5"];

function createFloatingHeart() {
  if (reducedMotion.matches || !heartLayer) return;

  const heart = document.createElement("span");
  const duration = 7 + Math.random() * 4;
  const drift = -45 + Math.random() * 90;

  heart.className = "floating-heart";
  heart.textContent = "♥";
  heart.style.left = `${4 + Math.random() * 92}%`;
  heart.style.fontSize = `${10 + Math.random() * 10}px`;
  heart.style.setProperty("--float-duration", `${duration}s`);
  heart.style.setProperty("--heart-drift", `${drift}px`);
  heart.style.setProperty(
    "--heart-color",
    heartColors[Math.floor(Math.random() * heartColors.length)],
  );

  heartLayer.appendChild(heart);
  window.setTimeout(() => heart.remove(), duration * 1000 + 300);
}

function scheduleHeart() {
  if (reducedMotion.matches) return;

  const delay = 8000 + Math.random() * 7000;
  window.setTimeout(() => {
    createFloatingHeart();
    scheduleHeart();
  }, delay);
}

function createHeartBurst() {
  if (reducedMotion.matches || !heartBurst) return;

  heartBurst.replaceChildren();
  const directions = [
    [-110, -85],
    [-70, -135],
    [0, -155],
    [75, -125],
    [115, -55],
    [105, 60],
    [-100, 65],
    [-125, -20],
  ];

  directions.forEach(([x, y], index) => {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = "♥";
    heart.style.setProperty("--burst-x", `${x}px`);
    heart.style.setProperty("--burst-y", `${y}px`);
    heart.style.setProperty("--burst-size", `${0.7 + (index % 3) * 0.22}rem`);
    heart.style.setProperty("--burst-color", heartColors[index % heartColors.length]);
    heartBurst.appendChild(heart);
  });
}

function openSurprise(event) {
  lastSecretTrigger = event?.currentTarget || null;
  if (!loveDialog.open) {
    loveDialog.showModal();
    createHeartBurst();
  }
}

function closeSurprise() {
  loveDialog.close();
  lastSecretTrigger?.focus();
}

function showMemory(index) {
  if (!memoryTrack || memorySlides.length === 0) return;

  activeMemory = (index + memorySlides.length) % memorySlides.length;
  memoryTrack.style.transform = `translateX(-${activeMemory * 100}%)`;

  memorySlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeMemory;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  memoryDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeMemory;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", String(isActive));
  });
}

secretButtons.forEach((button) => button.addEventListener("click", openSurprise));
closeButton.addEventListener("click", closeSurprise);
okayButton.addEventListener("click", closeSurprise);

previousMemoryButton?.addEventListener("click", () => showMemory(activeMemory - 1));
nextMemoryButton?.addEventListener("click", () => showMemory(activeMemory + 1));
memoryDots.forEach((dot, index) => {
  dot.addEventListener("click", () => showMemory(index));
});

memoryViewport?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showMemory(activeMemory - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showMemory(activeMemory + 1);
  }
});

memoryViewport?.addEventListener("touchstart", (event) => {
  swipeStartX = event.changedTouches[0].clientX;
}, { passive: true });

memoryViewport?.addEventListener("touchend", (event) => {
  const swipeDistance = event.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(swipeDistance) < 45) return;
  showMemory(activeMemory + (swipeDistance < 0 ? 1 : -1));
}, { passive: true });

loveDialog.addEventListener("click", (event) => {
  if (event.target === loveDialog) closeSurprise();
});

window.setTimeout(createFloatingHeart, 2500);
scheduleHeart();
