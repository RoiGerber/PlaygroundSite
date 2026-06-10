const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  mobileMenu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const phoneGames = [...document.querySelectorAll(".phone-game")];
const swipeCue = document.querySelector(".swipe-cue");
const gameStack = document.querySelector(".game-stack");
let activeGame = 0;
let touchStartY = 0;
let wheelLocked = false;

const showNextGame = () => {
  const current = phoneGames[activeGame];
  current.classList.add("leaving");
  current.classList.remove("active");
  activeGame = (activeGame + 1) % phoneGames.length;
  const next = phoneGames[activeGame];

  window.setTimeout(() => {
    current.classList.remove("leaving");
    next.classList.add("active");
  }, reduceMotion ? 0 : 220);
};

swipeCue.addEventListener("click", showNextGame);

gameStack.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.changedTouches[0].clientY;
  },
  { passive: true }
);

gameStack.addEventListener(
  "touchend",
  (event) => {
    const distance = touchStartY - event.changedTouches[0].clientY;
    if (distance > 35) showNextGame();
  },
  { passive: true }
);

gameStack.addEventListener(
  "wheel",
  (event) => {
    if (Math.abs(event.deltaY) < 20 || wheelLocked) return;
    wheelLocked = true;
    showNextGame();
    window.setTimeout(() => {
      wheelLocked = false;
    }, 650);
  },
  { passive: true }
);

const filterButtons = document.querySelectorAll(".filter-pill");
const catalogCards = document.querySelectorAll(".catalog-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    catalogCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const visible =
        filter === "all" || categories.includes(filter) || categories.includes("all");
      card.classList.toggle("hidden", !visible);
    });
  });
});

document.querySelectorAll(".mini-play").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = button.textContent === "▶" ? "Ⅱ" : "▶";
    button.setAttribute(
      "aria-label",
      `${button.textContent === "Ⅱ" ? "Pause" : "Preview"} ${button.getAttribute("aria-label").replace("Preview ", "").replace("Pause ", "")}`
    );
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const wasOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      faqItem.classList.remove("open");
      faqItem.querySelector("button").setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

document.getElementById("current-year").textContent = new Date().getFullYear();
