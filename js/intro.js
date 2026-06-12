window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("introOverlay");
  const preloader = document.getElementById("preloader");
  const introSeen = localStorage.getItem("snhp-intro-seen");
  const showSite = () => {
    if (preloader) {
      preloader.classList.remove("hidden");
      setTimeout(() => preloader.classList.add("hidden"), 1200);
    }
  };
  if (introSeen) {
    intro.classList.add("hidden");
    showSite();
    return;
  }
  setTimeout(() => {
    intro.classList.add("hidden");
    localStorage.setItem("snhp-intro-seen", "true");
    showSite();
  }, 5200);
});