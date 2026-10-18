
/* =========================================
   1. Theme Toggle
========================================= */

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");

function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);

  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  }

  if (themeLabel) {
    themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Theme still works if localStorage is unavailable.
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-bs-theme");

    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

// Sync the toggle with the theme already applied in the HTML.
setTheme(
  document.documentElement.getAttribute("data-bs-theme") || "light"
);


/* =========================================
   2. Hero Slider
========================================= */

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");
const heroPrev = document.querySelector("#hero-prev");
const heroNext = document.querySelector("#hero-next");
const heroCounter = document.querySelector("#hero-counter");
const heroSection = document.querySelector(".hero-section");

let currentSlide = 0;
let heroInterval;
const heroDelay = 5500;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function showSlide(index) {
  if (!heroSlides.length) return;

  currentSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, i) => {
    const isActive = i === currentSlide;

    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));

    slide.querySelectorAll("a, button").forEach((element) => {
      element.tabIndex = isActive ? 0 : -1;
    });
  });

  heroDots.forEach((dot, i) => {
    const isActive = i === currentSlide;

    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });

  if (heroCounter) {
    heroCounter.textContent =
      `${String(currentSlide + 1).padStart(2, "0")} / ` +
      `${String(heroSlides.length).padStart(2, "0")}`;
  }
}

function stopHeroAutoplay() {
  clearInterval(heroInterval);
}

function startHeroAutoplay() {
  stopHeroAutoplay();

  if (reducedMotion || document.hidden || heroSlides.length < 2) {
    return;
  }

  heroInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, heroDelay);
}

if (heroSlides.length) {
  showSlide(0);

  heroPrev?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startHeroAutoplay();
  });

  heroNext?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startHeroAutoplay();
  });

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startHeroAutoplay();
    });
  });

  heroSection?.addEventListener("mouseenter", stopHeroAutoplay);
  heroSection?.addEventListener("mouseleave", startHeroAutoplay);
  heroSection?.addEventListener("focusin", stopHeroAutoplay);
  heroSection?.addEventListener("focusout", (event) => {
    if (!heroSection.contains(event.relatedTarget)) {
      startHeroAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopHeroAutoplay();
    } else {
      startHeroAutoplay();
    }
  });

  startHeroAutoplay();
}


/* =========================================
   3. Footer Year
========================================= */

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   4. Contact Form Validation & Success Modal
========================================= */

const contactForm = document.querySelector("#contact-form");
const successModalElement = document.querySelector(
  "#contact-success-modal"
);

if (contactForm && successModalElement) {
  const successModal = new bootstrap.Modal(successModalElement);

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#contact-name").value.trim();
    const email = document.querySelector("#contact-email").value.trim();
    const service = document.querySelector("#contact-service").value;
    const message = document.querySelector("#contact-message").value.trim();

    // Check required fields.
    if (!name || !email || !service || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    // Check email format.
    const emailField = document.querySelector("#contact-email");

    if (!emailField.checkValidity()) {
      alert("Please enter a valid email address.");
      emailField.focus();
      return;
    }

    // Check message length.
    if (message.length < 10) {
      alert("Your message must be at least 10 characters long.");
      document.querySelector("#contact-message").focus();
      return;
    }

    if (message.length > 3000) {
      alert("Your message cannot exceed 3000 characters.");
      document.querySelector("#contact-message").focus();
      return;
    }

    // Validation passed: show the success modal.
    successModal.show();
    contactForm.reset();
  });
}
