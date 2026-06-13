(function() {
  const intro = document.getElementById("intro-screen");
  const video = document.getElementById("intro-video");
  const loader = document.getElementById("loading-screen");
  const skipBtn = document.getElementById("skip-intro-btn");
  const unmuteBtn = document.getElementById("unmute-intro-btn");
  const introShown = sessionStorage.getItem("introShown");
  let safetyTimeout = null;

  const finishLoader = () => {
    if (loader) {
      loader.classList.remove("fade-in");
      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.remove();
      }, 1200);
    }
  };

  const startLoader = () => {
    setTimeout(finishLoader, 1800);
  };

  const transitionToLoader = () => {
    if (transitionToLoader.triggered) return;
    transitionToLoader.triggered = true;

    if (safetyTimeout) {
      clearTimeout(safetyTimeout);
    }

    if (loader) {
      loader.classList.add("fade-in");
      loader.style.visibility = "visible";
    }
    if (intro) {
      intro.classList.add("fade-out");
    }

    sessionStorage.setItem("introShown", "true");

    setTimeout(() => {
      if (intro) {
        if (video) {
          video.pause();
          video.src = "";
          video.load();
        }
        intro.remove();
      }
      startLoader();
    }, 1200);
  };

  if (introShown === "true") {
    if (intro) intro.remove();
    if (loader) loader.remove();
    return;
  }

  // Set correct dynamic video based on viewport width
  if (video) {
    // Bind listeners before setting src/load to ensure they fire
    video.addEventListener("ended", transitionToLoader);
    video.addEventListener("error", transitionToLoader);

    // Safety timeout: bypass intro if it hangs or fails
    safetyTimeout = setTimeout(() => {
      console.warn("Safety timeout reached. Proceeding to loader.");
      transitionToLoader();
    }, 8000);

    const isMobile = window.innerWidth <= 767;
    video.src = isMobile ? "assets/videos/intro-mobile.mp4" : "assets/videos/intro.mp4";
    video.load();

    const unmuteVideo = () => {
      video.muted = false;
      if (unmuteBtn) unmuteBtn.style.display = "none";
    };

    if (unmuteBtn) {
      unmuteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        unmuteVideo();
      });
    }

    if (intro) {
      intro.addEventListener("click", unmuteVideo);
    }

    video.muted = false;
    video.play().then(() => {
      if (unmuteBtn) unmuteBtn.style.display = "none";
    }).catch(() => {
      video.muted = true;
      video.play().then(() => {
        if (unmuteBtn) unmuteBtn.style.display = "flex";
      }).catch(() => {
        transitionToLoader();
      });
    });
  } else {
    transitionToLoader();
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      transitionToLoader();
    });
  }
})();
