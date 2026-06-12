(function() {
  const intro = document.getElementById("introOverlay");
  const introVideo = document.getElementById("introVideo");
  const preloader = document.getElementById("preloader");
  const introShown = localStorage.getItem("introShown");

  const showSite = () => {
    if (preloader) {
      preloader.classList.remove("hidden");
      setTimeout(() => preloader.classList.add("hidden"), 1200);
    }
  };

  const finishIntro = () => {
    if (intro) {
      intro.classList.add("hidden");
      setTimeout(() => intro.remove(), 800);
    }
    showSite();
  };

  if (introShown === "true") {
    if (intro) {
      intro.style.display = "none";
      intro.remove();
    }
    showSite();
  } else {
    localStorage.setItem("introShown", "true");
    if (intro && introVideo) {
      introVideo.addEventListener("ended", finishIntro);
      introVideo.addEventListener("error", finishIntro);
      introVideo.play().catch(() => finishIntro());
    } else {
      finishIntro();
    }
  }
})();