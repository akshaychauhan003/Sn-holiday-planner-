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
});