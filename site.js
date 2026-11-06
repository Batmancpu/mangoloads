(() => {
  "use strict";

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeKey = "mangoloads.theme.v2";
  let theme = "light";
  try { theme = localStorage.getItem(themeKey) || "light"; } catch (_) {}
  if (theme === "dark") document.body.classList.add("dark");
  function syncTheme() {
    if (!themeButton) return;
    const dark = document.body.classList.contains("dark");
    themeButton.textContent = dark ? "☼" : "◐";
    themeButton.setAttribute("aria-label", dark ? "Switch to light appearance" : "Switch to dark appearance");
  }
  syncTheme();
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      try { localStorage.setItem(themeKey, document.body.classList.contains("dark") ? "dark" : "light"); } catch (_) {}
      syncTheme();
    });
  }

  const reveal = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:0.09, rootMargin:"0px 0px -28px 0px" });
    reveal.forEach(el => observer.observe(el));
  } else {
    reveal.forEach(el => el.classList.add("visible"));
  }

  const viewport = document.getElementById("showcaseViewport");
  const track = document.getElementById("showcaseTrack");
  if (!viewport || !track) return;
  const slides = Array.from(track.querySelectorAll(".showcase-slide"));
  const prev = document.getElementById("slidePrev");
  const next = document.getElementById("slideNext");
  const current = document.getElementById("slideCurrent");
  const total = document.getElementById("slideTotal");
  const progress = document.getElementById("slideProgress");
  let index = 0;
  let pointerStart = null;
  let pointerLast = null;
  let suppressClick = false;
  if (total) total.textContent = String(slides.length).padStart(2,"0");

  function goTo(nextIndex) {
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
    if (current) current.textContent = String(index + 1).padStart(2,"0");
    if (progress) progress.style.width = (((index + 1) / slides.length) * 100) + "%";
    slides.forEach((slide,i) => slide.setAttribute("aria-label","Project " + (i + 1) + " of " + slides.length + (i === index ? ", current slide" : "")));
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
  }
  if (prev) prev.addEventListener("click", () => goTo(index - 1));
  if (next) next.addEventListener("click", () => goTo(index + 1));
  viewport.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(index - 1); }
  });

  viewport.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart = event.clientX;
    pointerLast = event.clientX;
    suppressClick = false;
    try { viewport.setPointerCapture(event.pointerId); } catch (_) {}
  });
  viewport.addEventListener("pointermove", event => {
    if (pointerStart === null) return;
    pointerLast = event.clientX;
  });
  function finishSwipe() {
    if (pointerStart === null) return;
    const delta = pointerLast - pointerStart;
    if (Math.abs(delta) > 42) {
      goTo(index + (delta < 0 ? 1 : -1));
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 450);
    }
    pointerStart = null;
    pointerLast = null;
  }
  viewport.addEventListener("pointerup", finishSwipe);
  viewport.addEventListener("pointercancel", finishSwipe);
  viewport.addEventListener("lostpointercapture", finishSwipe);
  viewport.addEventListener("click", event => {
    if (suppressClick && event.target.closest(".slide-link,.slide-more")) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  goTo(0);
})();