
/* =========================================
   1. Theme toggle
========================================= */

const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");
const currentYear = document.querySelector("#current-year");

function updateThemeButton(theme) {
  const isDark = theme === "dark";

  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";

  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${isDark ? "light" : "dark"} mode`
  );
}

function setTheme(theme) {
  root.setAttribute("data-bs-theme", theme);
  updateThemeButton(theme);

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // The theme still works if browser storage is unavailable.
  }
}

themeToggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-bs-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

updateThemeButton(root.getAttribute("data-bs-theme"));

currentYear.textContent = new Date().getFullYear();


/* =========================================
   2. Hero slider
========================================= */

const heroSection = document.querySelector(".hero-section");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll(".hero-dot")];
const heroPrev = document.querySelector("#hero-prev");
const heroNext = document.querySelector("#hero-next");
const heroCounter = document.querySelector("#hero-counter");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (
  heroSection &&
  heroSlides.length &&
  heroSlides.length === heroDots.length &&
  heroPrev &&
  heroNext
) {
  let activeSlide = 0;
  let sliderTimer;
  let isHovered = false;
  let isFocused = false;

  function showSlide(index) {
    activeSlide =
      (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, i) => {
      const isActive = i === activeSlide;

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));

      slide.querySelectorAll("a").forEach((link) => {
        link.tabIndex = isActive ? 0 : -1;
      });
    });

    heroDots.forEach((dot, i) => {
      const isActive = i === activeSlide;

      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    if (heroCounter) {
      heroCounter.textContent =
        `${String(activeSlide + 1).padStart(2, "0")} / ` +
        `${String(heroSlides.length).padStart(2, "0")}`;
    }
  }

  function stopSlider() {
    clearInterval(sliderTimer);
    sliderTimer = undefined;
  }

  function startSlider() {
    stopSlider();

    if (
      reducedMotion.matches ||
      document.hidden ||
      isHovered ||
      isFocused
    ) {
      return;
    }

    sliderTimer = setInterval(() => {
      showSlide(activeSlide + 1);
    }, 5500);
  }

  function changeSlide(index) {
    showSlide(index);
    startSlider();
  }

  heroPrev.addEventListener("click", () => {
    changeSlide(activeSlide - 1);
  });

  heroNext.addEventListener("click", () => {
    changeSlide(activeSlide + 1);
  });

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      changeSlide(index);
    });
  });

  heroSection.addEventListener("mouseenter", () => {
    isHovered = true;
    stopSlider();
  });

  heroSection.addEventListener("mouseleave", () => {
    isHovered = false;
    startSlider();
  });

  heroSection.addEventListener("focusin", () => {
    isFocused = true;
    stopSlider();
  });

  heroSection.addEventListener("focusout", (event) => {
    if (!heroSection.contains(event.relatedTarget)) {
      isFocused = false;
      startSlider();
    }
  });

  document.addEventListener("visibilitychange", startSlider);
  reducedMotion.addEventListener("change", startSlider);

  showSlide(0);
  startSlider();
}
