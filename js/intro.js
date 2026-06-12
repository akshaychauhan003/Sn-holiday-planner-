(function() {
  const intro = document.getElementById("intro-screen");
  const video = document.getElementById("intro-video");
  const loader = document.getElementById("loading-screen");
  const skipBtn = document.getElementById("skip-intro-btn");
  const unmuteBtn = document.getElementById("unmute-intro-btn");
  const introShown = sessionStorage.getItem("introShown");

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

    // Save flag immediately in sessionStorage on intro skip or end
    sessionStorage.setItem("introShown", "true");

    // After 1.2s transition completes, remove intro and start loader animation
    setTimeout(() => {
      if (intro) {
        intro.remove();
      }
      startLoader();
    }, 1200);
  };

  // If already shown in this browser session, bypass both and display website instantly
  if (introShown === "true") {
    if (intro) intro.remove();
    if (loader) loader.remove();
    return;
  }

  // Helper function to unmute the video
  const unmuteVideo = () => {
    if (video) {
      video.muted = false;
      if (unmuteBtn) {
        unmuteBtn.style.display = "none";
      }
    }
  };

  if (unmuteBtn) {
    unmuteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent trigger on intro-screen click
      unmuteVideo();
    });
  }

  if (intro) {
    // Tapping anywhere on the intro screen also unmutes
    intro.addEventListener("click", unmuteVideo);
  }

  // Play intro video
  if (video) {
    video.addEventListener("ended", transitionToLoader);
    video.addEventListener("error", transitionToLoader);

    // Try to play unmuted first
    video.muted = false;
    video.play().then(() => {
      // Unmuted autoplay succeeded
      if (unmuteBtn) unmuteBtn.style.display = "none";
    }).catch(() => {
      // Unmuted autoplay blocked by browser policy, try muted autoplay
      video.muted = true;
      video.play().then(() => {
        // Muted autoplay succeeded, show unmute control
        if (unmuteBtn) unmuteBtn.style.display = "flex";
      }).catch(() => {
        // If even muted autoplay fails, transition immediately
        transitionToLoader();
      });
    });
  } else {
    transitionToLoader();
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent unmute trigger when clicking skip
      transitionToLoader();
    });
  }
})();
