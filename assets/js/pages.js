window.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const logo = document.getElementById("logo");

  // If a logo exists, read its source and allow pages to override the scrolled-src
  const originalSrc = logo ? logo.getAttribute("src") : null;
  // For pages.js we set the scrolled logo path as requested
  const scrolledSrc = "../images/ROGHome_LOGO.png";
  const threshold = 50;

  function updateOnScroll() {
    const scrolled = window.scrollY > threshold;
    if (header) header.classList.toggle("sticky", scrolled);
    if (logo && originalSrc)
      logo.setAttribute("src", scrolled ? scrolledSrc : originalSrc);
  }

  window.addEventListener("scroll", updateOnScroll, { passive: true });
  updateOnScroll();

  // set footer year if present
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // responsive nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector("header ul");
  if (navToggle) navToggle.innerHTML = '<i class="ri-menu-line"></i>';

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.innerHTML = '<i class="ri-menu-line"></i>';
    }
  }

  function openNav() {
    document.body.classList.add("nav-open");
    if (navToggle) {
      navToggle.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.innerHTML = '<i class="ri-close-line"></i>';
    }
  }
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      if (document.body.classList.contains("nav-open")) closeNav();
      else openNav();
    });

    // close when clicking a link — but don't close when the click is on a dropdown parent (mobile)
    navList.addEventListener("click", function (e) {
      const a = e.target.closest("a");
      if (!a) return;
      const li = a.closest("li");
      if (li && li.classList.contains("dropdown") && window.innerWidth <= 900)
        return;
      closeNav();
    });

    // close on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  // allow dropdown toggling on mobile (click parent to expand)
  const dropdowns = document.querySelectorAll("li.dropdown");
  if (dropdowns.length) {
    dropdowns.forEach(function (li) {
      const a = li.querySelector("a");
      if (!a) return;

      // mobile: click to toggle submenu
      a.addEventListener("click", function (e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          li.classList.toggle("open");
        }
      });

      // desktop: show submenu only when intentionally hovering (short delay)
      let enterTimer = null,
        leaveTimer = null;
      a.addEventListener("mouseenter", function () {
        if (window.innerWidth <= 900) return;
        clearTimeout(leaveTimer);
        enterTimer = setTimeout(function () {
          li.classList.add("open");
        }, 160);
      });
      a.addEventListener("mouseleave", function () {
        if (window.innerWidth <= 900) return;
        clearTimeout(enterTimer);
        leaveTimer = setTimeout(function () {
          li.classList.remove("open");
        }, 220);
      });
      li.addEventListener("mouseleave", function () {
        if (window.innerWidth <= 900) return;
        clearTimeout(enterTimer);
        leaveTimer = setTimeout(function () {
          li.classList.remove("open");
        }, 220);
      });
    });
  }
});


