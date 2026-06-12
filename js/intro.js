(function() {
  const intro = document.getElementById("intro-screen");
  const video = document.getElementById("intro-video");
  const loader = document.getElementById("loading-screen");
  const skipBtn = document.getElementById("skip-intro-btn");
  const introShown = localStorage.getItem("introShown");

  const finishLoader = () => {
    if (loader) {
      loader.classList.remove("fade-in");
      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.remove();
      }, 1200); // Wait 1.2s for loader fade-out transition
    }
  };

  const startLoader = () => {
    // Keep loader visible for 1.8s while it animates
    setTimeout(finishLoader, 1800);
  };

  const transitionToLoader = () => {
    // Prevent multiple triggerings
    if (transitionToLoader.triggered) return;
    transitionToLoader.triggered = true;

    // Start cross-fade transition
    if (loader) {
      loader.classList.add("fade-in");
      loader.style.visibility = "visible";
    }
    if (intro) {
      intro.classList.add("fade-out");
    }

    // Save flag immediately on intro skip or end
    localStorage.setItem("introShown", "true");

    // After 1.2s transition completes, remove intro and start loader animation
    setTimeout(() => {
      if (intro) {
        intro.remove();
      }
      startLoader();
    }, 1200);
  };

  // If already shown in this browser, bypass both and display website instantly
  if (introShown === "true") {
    if (intro) intro.remove();
    if (loader) loader.remove();
    return;
  }

  // Play intro video
  if (video) {
    video.addEventListener("ended", transitionToLoader);
    video.addEventListener("error", transitionToLoader);
    // In case autoplay fails or is blocked, auto-fallback after a delay
    video.play().catch(() => {
      transitionToLoader();
    });
  } else {
    transitionToLoader();
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", transitionToLoader);
  }
})();
