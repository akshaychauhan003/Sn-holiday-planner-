window.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navPanel = document.getElementById("navPanel");
  const navAnchors = document.querySelectorAll(".nav-link, .dot-link, .tracker-link");
  const reveals = document.querySelectorAll(".reveal");
  const statNumbers = document.querySelectorAll(".stat-number");
  const enquiryBtn = document.getElementById("enquiryBtn");
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
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.16 });
  reveals.forEach(el => revealObserver.observe(el));
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = count;
        }
      }, 25);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(num => counterObserver.observe(num));
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.full;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
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
  // The Wikipedia India outline SVG has viewBox: 0 0 666.67 777.33
  // Coordinates are computed from real geographic lat/lon:
  //   x = (lon - 68) / (97 - 68) * 666.67
  //   y = (37 - lat) / (37 - 8) * 777.33
  //
  // Debug mode: set window.MAP_DEBUG = true in console, then reload
  // ================================================================
  const MAP_VIEWBOX = { w: 666.67, h: 777.33 };
  const DEBUG = window.MAP_DEBUG || false;

  const places = [
    { name: "Delhi",       x: 212.2, y: 224.9, id: "home" },
    { name: "Jaipur",      x: 179.1, y: 270.2, id: "rajasthan" },
    { name: "Shimla",      x: 210.8, y: 158.1, id: "shimla" },
    { name: "Manali",      x: 211.3, y: 127.6, id: "manali" },
    { name: "Srinagar",    x: 156.1, y:  78.3, id: "kashmir" },
    { name: "Leh",         x: 220.2, y:  76.4, id: "ladakh" },
    { name: "Bhubaneswar", x: 409.9, y: 447.6, id: "odisha" }
  ];

  const routesSvg = document.getElementById("routes");
  const hotspotsSvg = document.getElementById("hotspots");

  // Validate all hotspots are within the SVG viewBox
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
    // Debug: show viewBox info
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
      // Pulsing outer ring
      const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      pulse.setAttribute("r", "12");
      pulse.setAttribute("class", "hotspot-pulse-ring");
      // Main marker circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "7");
      circle.setAttribute("class", "hotspot-circle");
      // City label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = place.name;
      text.setAttribute("x", "14");
      text.setAttribute("y", "5");
      text.setAttribute("class", "hotspot-label");
      // Invisible 48x48 hit box for accessibility
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
      // Debug: show coordinate values
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
  drawRoutes(places[0]); // Default: routes from Delhi

});
