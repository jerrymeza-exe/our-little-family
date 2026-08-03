const heartLayer = document.querySelector(".floating-hearts");
const secretButton = document.querySelector(".secret-button");
const loveDialog = document.querySelector(".love-dialog");
const closeButton = document.querySelector(".dialog-close");
const okayButton = document.querySelector(".dialog-ok");
const heartBurst = document.querySelector(".heart-burst");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

function openSurprise() {
  if (!loveDialog.open) {
    loveDialog.showModal();
    createHeartBurst();
  }
}

function closeSurprise() {
  loveDialog.close();
  secretButton.focus();
}

secretButton.addEventListener("click", openSurprise);
closeButton.addEventListener("click", closeSurprise);
okayButton.addEventListener("click", closeSurprise);

loveDialog.addEventListener("click", (event) => {
  if (event.target === loveDialog) closeSurprise();
});

window.setTimeout(createFloatingHeart, 2500);
scheduleHeart();
