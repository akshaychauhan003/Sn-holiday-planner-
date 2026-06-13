window.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");
  const progress = document.getElementById("scrollProgress");
  const navLinks = document.querySelectorAll(".nav-link");
  const dotLinks = document.querySelectorAll(".dot-link");
  const trackerLinks = document.querySelectorAll(".tracker-link");
  const sections = document.querySelectorAll("section[id], article[id]");
  let lastScrollTop = 0;
  function onScroll() {
    const scrollTop = window.scrollY;
    
    // Hide header on scroll down, show on scroll up
    if (scrollTop > 80) {
      if (scrollTop > lastScrollTop) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }
    } else {
      header.style.transform = "translateY(0)";
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const width = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = width + "%";
    header.classList.toggle("scrolled", scrollTop > 30);
    backToTop.classList.toggle("show", scrollTop > 500);
    let current = "home";
    sections.forEach(section => {
      const top = section.offsetTop - 180;
      const height = section.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
    dotLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
    trackerLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});