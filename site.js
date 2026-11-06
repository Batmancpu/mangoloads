(() => {
  "use strict";

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeKey = "mangoloads.theme.v1";
  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem(themeKey) || "dark"; } catch (_) {}
  if (savedTheme === "light") document.body.classList.add("light");
  function syncThemeButton() {
    if (!themeButton) return;
    const light = document.body.classList.contains("light");
    themeButton.textContent = light ? "☼" : "◐";
    themeButton.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  }
  syncThemeButton();
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("light");
      try { localStorage.setItem(themeKey, document.body.classList.contains("light") ? "light" : "dark"); } catch (_) {}
      syncThemeButton();
    });
  }

  const cards = Array.from(document.querySelectorAll(".project-card[data-kind]"));
  const search = document.getElementById("projectSearch");
  const empty = document.getElementById("emptyProjects");
  let activeFilter = "all";

  function applyProjectFilter() {
    const query = search ? search.value.trim().toLowerCase() : "";
    let visible = 0;
    cards.forEach(card => {
      const category = card.dataset.kind || "";
      const haystack = (card.dataset.search || card.textContent).toLowerCase();
      const matches = (activeFilter === "all" || category === activeFilter) && haystack.includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (empty) empty.style.display = visible ? "none" : "block";
  }

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("active", item === button));
      applyProjectFilter();
    });
  });
  if (search) search.addEventListener("input", applyProjectFilter);

  const revealItems = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }
})();