
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
  localStorage.setItem("theme", theme);
  updateThemeButton(theme);
}

themeToggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-bs-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  setTheme(nextTheme);
});

updateThemeButton(root.getAttribute("data-bs-theme"));
currentYear.textContent = new Date().getFullYear();
