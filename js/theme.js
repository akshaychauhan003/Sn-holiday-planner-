(function () {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("snhp-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", savedTheme || (preferredDark ? "dark" : "light"));
  window.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("snhp-theme", next);
    });
  });
})();