window.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navPanel = document.getElementById("navPanel");
  const navAnchors = document.querySelectorAll(".nav-link, .dot-link, .tracker-link");
  const reveals = document.querySelectorAll(".reveal");
  const statNumbers = document.querySelectorAll(".stat-number");
  const enquiryBtn = document.getElementById("enquiryBtn");
  const videos = document.querySelectorAll(".destination-video");
  const quotes = [
    "Travel is the only thing you buy that makes you richer.",
    "Collect moments, not things.",
    "The journey begins before you arrive."
  ];
  const quoteRotator = document.getElementById("quoteRotator");
  let quoteIndex = 0;
  setInterval(() => {
    if (!quoteRotator) return;
    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteRotator.style.opacity = 0;
    setTimeout(() => {
      quoteRotator.textContent = quotes[quoteIndex];
      quoteRotator.style.opacity = 1;
    }, 220);
  }, 3500);
  if (menuToggle && navPanel) {
    menuToggle.addEventListener("click", () => {
      navPanel.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", navPanel.classList.contains("open"));
    });
  }
  navAnchors.forEach(link => {
    link.addEventListener("click", () => navPanel.classList.remove("open"));
  });

  // Force all reveals to be visible immediately (no IntersectionObserver)
  reveals.forEach(el => el.classList.add("visible"));

  // Force all counters to show final value immediately
  statNumbers.forEach(num => {
    num.textContent = num.dataset.target || num.textContent;
  });
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.full;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      // Pause background videos when modal is active
      videos.forEach(v => { if (v.src) v.pause(); });
    });
  });
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    // Resume visible videos when modal closes
    videos.forEach(v => {
      const rect = v.getBoundingClientRect();
      const isVisible = (rect.top < window.innerHeight && rect.bottom > 0);
      if (isVisible && v.src) {
        v.play().catch(e => { });
      }
    });
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
  const testimonials = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  let testimonialIndex = 0;
  let testimonialInterval;
  function showTestimonial(index) {
    testimonials.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  }
  function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    showTestimonial(testimonialIndex);
  }
  function prevTestimonial() {
    testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(testimonialIndex);
  }
  function startAutoSlide() {
    testimonialInterval = setInterval(nextTestimonial, 3800);
  }
  function stopAutoSlide() {
    clearInterval(testimonialInterval);
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoSlide();
      prevTestimonial();
      startAutoSlide();
    });
    nextBtn.addEventListener("click", () => {
      stopAutoSlide();
      nextTestimonial();
      startAutoSlide();
    });
  }
  showTestimonial(testimonialIndex);
  startAutoSlide();
  const slider = document.getElementById("testimonialSlider");
  if (slider) {
    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);
  }
  if (enquiryBtn) {
    enquiryBtn.addEventListener("click", () => {
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const destination = document.getElementById("destination").value;
      const message = document.getElementById("message").value.trim();
      const text = `Hello SN HOLIDAY PLANNER,%0A%0AName: ${name || "-"}%0APhone: ${phone || "-"}%0ADestination: ${destination}%0ARequirement: ${message || "-"}`;
      window.open(`https://wa.me/918527374956?text=${text}`, "_blank");
    });
  }
  const hero = document.querySelector(".hero");
  const parallax = document.querySelector(".hero-parallax");
  if (hero && parallax && window.innerWidth > 992) {
    hero.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      parallax.style.transform = `translate(${x}px, ${y}px)`;
    });
    hero.addEventListener("mouseleave", () => {
      parallax.style.transform = "translate(0,0)";
    });
  }


  // ================================================================
  // Interactive India Map — SVG ViewBox Coordinate System
  // ================================================================
  const MAP_VIEWBOX = { w: 666.67, h: 777.33 };
  const DEBUG = window.MAP_DEBUG || false;

  const places = [
    { name: "Delhi", x: 212.2, y: 224.9, id: "home" },
    { name: "Jaipur", x: 179.1, y: 270.2, id: "rajasthan" },
    { name: "Shimla", x: 210.8, y: 158.1, id: "shimla" },
    { name: "Manali", x: 211.3, y: 127.6, id: "manali" },
    { name: "Srinagar", x: 156.1, y: 78.3, id: "kashmir" },
    { name: "Leh", x: 220.2, y: 76.4, id: "ladakh" },
    { name: "Bhubaneswar", x: 409.9, y: 447.6, id: "odisha" }
  ];

  const routesSvg = document.getElementById("routes");
  const hotspotsSvg = document.getElementById("hotspots");

  places.forEach(p => {
    if (p.x < 0 || p.x > MAP_VIEWBOX.w || p.y < 0 || p.y > MAP_VIEWBOX.h) {
      console.warn(`⚠ Hotspot "${p.name}" is OUTSIDE viewBox: (${p.x}, ${p.y})`);
    }
  });

  function drawRoutes(source) {
    if (!routesSvg) return;
    routesSvg.innerHTML = "";
    places.forEach(dest => {
      if (dest === source) return;
      const mx = (source.x + dest.x) / 2;
      const my = Math.min(source.y, dest.y) - 30;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${source.x} ${source.y} Q ${mx} ${my} ${dest.x} ${dest.y}`);
      path.setAttribute("class", "route-path-anim");
      routesSvg.appendChild(path);
    });
  }

  function createHotspots() {
    if (!hotspotsSvg) return;
    if (DEBUG) {
      const dbg = document.createElementNS("http://www.w3.org/2000/svg", "text");
      dbg.textContent = `viewBox: 0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`;
      dbg.setAttribute("x", "10");
      dbg.setAttribute("y", "20");
      dbg.setAttribute("fill", "#ff0");
      dbg.setAttribute("font-size", "14");
      dbg.setAttribute("font-family", "monospace");
      hotspotsSvg.appendChild(dbg);
    }
    places.forEach(place => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "hotspot-node");
      g.setAttribute("transform", `translate(${place.x}, ${place.y})`);
      const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      pulse.setAttribute("r", "12");
      pulse.setAttribute("class", "hotspot-pulse-ring");
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "7");
      circle.setAttribute("class", "hotspot-circle");
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = place.name;
      text.setAttribute("x", "14");
      text.setAttribute("y", "5");
      text.setAttribute("class", "hotspot-label");
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "-24");
      rect.setAttribute("y", "-24");
      rect.setAttribute("width", "48");
      rect.setAttribute("height", "48");
      rect.setAttribute("fill", "transparent");
      rect.setAttribute("cursor", "pointer");
      g.appendChild(pulse);
      g.appendChild(circle);
      g.appendChild(text);
      g.appendChild(rect);
      if (DEBUG) {
        const coord = document.createElementNS("http://www.w3.org/2000/svg", "text");
        coord.textContent = `(${place.x}, ${place.y})`;
        coord.setAttribute("x", "14");
        coord.setAttribute("y", "18");
        coord.setAttribute("fill", "#ff0");
        coord.setAttribute("font-size", "10");
        coord.setAttribute("font-family", "monospace");
        g.appendChild(coord);
      }
      g.addEventListener("click", () => {
        drawRoutes(place);
        const targetEl = document.getElementById(place.id);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      });
      hotspotsSvg.appendChild(g);
    });
  }

  createHotspots();
  drawRoutes(places[0]);

  // Cinematic Videos Immediate Loader & Controls
  // ================================================================
  videos.forEach(video => {
    if (video.dataset.src) {
      video.src = video.dataset.src;
      video.removeAttribute("data-src");
      video.load();
    }

    video.play().then(() => {
      video.classList.add("playing");
    }).catch(() => { });

    video.addEventListener("playing", () => {
      video.classList.add("playing");
    });

    video.addEventListener("error", () => {
      console.warn(`Video fallback triggered for source: ${video.src || video.dataset.src}`);
      video.style.display = "none";
      const poster = video.parentElement.querySelector(".destination-poster");
      if (poster) {
        poster.style.opacity = "1";
      }
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      videos.forEach(v => { if (v.src) v.pause(); });
    } else {
      videos.forEach(v => {
        if (v.src) v.play().catch(() => { });
      });
    }
  });

  // ================================================================
  // Dynamic Image Auto-Mapper (assets/images/ and assets/ fallbacks)
  // ================================================================
  const mapImages = () => {
    const journeyCards = document.querySelectorAll(".journey-card");
    const journeyMapping = {
      "tour inquiry": "tourInquiry",
      "planning": "planning",
      "booking": "booking",
      "travel": "Travel",
      "explore": "explore",
      "memories": "memories"
    };

    journeyCards.forEach(card => {
      const titleEl = card.querySelector("h3");
      if (!titleEl) return;
      const titleText = titleEl.textContent.trim().toLowerCase();
      const baseFilename = journeyMapping[titleText];
      if (!baseFilename) return;

      const img = card.querySelector("img");
      if (!img) return;

      const extensions = ["jpg", "png", "jpeg", "webp"];
      const directories = ["assets/images/", "assets/"];
      let attempts = [];

      directories.forEach(dir => {
        extensions.forEach(ext => {
          attempts.push(`${dir}${baseFilename}.${ext}`);
        });
      });

      let index = 0;
      const tryLoad = () => {
        if (index >= attempts.length) {
          img.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";
          return;
        }
        const testUrl = attempts[index];
        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = testUrl;
        };
        tempImg.onerror = () => {
          index++;
          tryLoad();
        };
        tempImg.src = testUrl;
      };

      tryLoad();
    });

    const galleryItems = document.querySelectorAll(".gallery-item");
    const galleryMapping = {
      "luxury escapes": "LuxuryEscapes",
      "mountain moods": "MountainMoods",
      "golden journeys": "GoldenJourneys",
      "cultural routes": "CulturalRoutes",
      "signature moments": "SignatureMoments",
      "scenic luxury": "ScenicLuxury"
    };

    galleryItems.forEach(item => {
      const titleEl = item.querySelector("h3");
      if (!titleEl) return;
      const titleText = titleEl.textContent.trim().toLowerCase();
      const baseFilename = galleryMapping[titleText];
      if (!baseFilename) return;

      const img = item.querySelector("img");
      if (!img) return;

      const extensions = ["jpg", "png", "jpeg", "webp"];
      const directories = ["assets/images/", "assets/"];
      let attempts = [];

      directories.forEach(dir => {
        extensions.forEach(ext => {
          attempts.push(`${dir}${baseFilename}.${ext}`);
        });
      });

      let index = 0;
      const tryLoad = () => {
        if (index >= attempts.length) {
          img.src = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80";
          return;
        }
        const testUrl = attempts[index];
        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = testUrl;
          item.setAttribute("data-full", testUrl);
        };
        tempImg.onerror = () => {
          index++;
          tryLoad();
        };
        tempImg.src = testUrl;
      };

      tryLoad();
    });
  };

  mapImages();

});
