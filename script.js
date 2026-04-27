(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Aizvērt izvēlni" : "Atvērt izvēlni");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Atvērt izvēlni");
      });
    });
  }

  // Hero background slideshow
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero__slide"));
  if (heroSlides.length > 1) {
    var currentHeroSlide = 0;
    var heroReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showHeroSlide(index) {
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
    }

    if (!heroReducedMotion) {
      window.setInterval(function () {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(currentHeroSlide);
      }, 5000);
    }
  }

  // Large tent gallery modal
  var galleryTriggers = document.querySelectorAll(".js-large-tent-gallery-trigger");
  var galleryModal = document.getElementById("large-tent-gallery");
  if (galleryTriggers.length && galleryModal) {
    var galleryImage = galleryModal.querySelector(".gallery-modal__image");
    var galleryPrev = galleryModal.querySelector("[data-gallery-prev]");
    var galleryNext = galleryModal.querySelector("[data-gallery-next]");
    var galleryCloseEls = galleryModal.querySelectorAll("[data-gallery-close]");
    var galleryImages = [
      { src: "images/industry-liela-10x4.jpg", alt: "Lielā dārza telts 10 × 4 m" },
      { src: "images/gallery-large-2.jpg", alt: "PVC angārs - foto 2" },
      { src: "images/gallery-large-3.jpg", alt: "PVC angārs - foto 3" },
      { src: "images/gallery-large-4.jpg", alt: "PVC angārs - foto 4" },
      { src: "images/gallery-large-5.jpg", alt: "PVC angārs - foto 5" }
    ];
    var galleryIndex = 0;

    function updateGalleryImage() {
      var current = galleryImages[galleryIndex];
      galleryImage.src = current.src;
      galleryImage.alt = current.alt;
    }

    function openGallery() {
      galleryModal.hidden = false;
      document.body.style.overflow = "hidden";
      updateGalleryImage();
    }

    function closeGallery() {
      galleryModal.hidden = true;
      document.body.style.overflow = "";
    }

    function goNext() {
      galleryIndex = (galleryIndex + 1) % galleryImages.length;
      updateGalleryImage();
    }

    function goPrev() {
      galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
      updateGalleryImage();
    }

    galleryTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        galleryIndex = 0;
        openGallery();
      });
    });

    galleryNext.addEventListener("click", goNext);
    galleryPrev.addEventListener("click", goPrev);
    galleryCloseEls.forEach(function (el) {
      el.addEventListener("click", closeGallery);
    });

    document.addEventListener("keydown", function (event) {
      if (galleryModal.hidden) return;
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    });
  }

  // Stat count-up (subtle)
  var stats = document.querySelectorAll(".stat__num");
  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function suffixFor(el) {
    return el.getAttribute("data-suffix") || "";
  }

  function animateStat(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    if (isNaN(target)) return;
    var suf = suffixFor(el);
    if (reduced) {
      el.textContent = String(target) + suf;
      return;
    }
    var start = 0;
    var duration = 1200;
    var t0 = null;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(start + (target - start) * eased);
      el.textContent = String(val) + (p < 1 ? "" : suf);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (stats.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateStat(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    stats.forEach(function (s) {
      s.textContent = "0";
      obs.observe(s);
    });
  } else {
    stats.forEach(function (s) {
      var t = parseInt(s.getAttribute("data-target"), 10);
      var suf = suffixFor(s);
      s.textContent = isNaN(t) ? "0" : String(t) + suf;
    });
  }
})();
