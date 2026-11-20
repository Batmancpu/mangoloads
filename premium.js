(() => {
  "use strict";
  const version = document.getElementById("heroLatestVersion");
  const links = [...document.querySelectorAll("[data-brrboard-download]")];
  if (!version && !links.length) return;

  const cacheKey = "mangoloads.brrboard-featured-release.v1";
  const cacheAge = 20 * 60 * 1000;
  const allowed = /^https:\/\/github\.com\/Batmancpu\/brrrBoard\/releases\/download\/v1\.0\.\d+\/brrBoard\.apk$/i;

  function show(build) {
    if (!build || !/^v?\d+(?:\.\d+)+$/i.test(build.tag || "") || !allowed.test(build.url || "")) return;
    if (version) version.textContent = build.tag;
    links.forEach(link => { link.href = build.url; });
  }
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (cached && Date.now() - cached.savedAt < cacheAge) { show(cached); return; }
  } catch (_) {}

  fetch("https://api.github.com/repos/Batmancpu/brrrBoard/releases?per_page=100", {
    headers: { "Accept": "application/vnd.github+json" },
    cache: "no-store"
  }).then(response => {
    if (!response.ok) throw new Error("Release API unavailable");
    return response.json();
  }).then(releases => {
    if (!Array.isArray(releases)) return;
    const build = releases.filter(release => release && !release.draft && !release.prerelease && /^v1\.0\.\d+$/.test(release.tag_name || ""))
      .flatMap(release => (release.assets || []).filter(asset => allowed.test(asset.browser_download_url || ""))
        .map(asset => ({ tag: release.tag_name, url: asset.browser_download_url, date: release.published_at || release.created_at })))
      .sort((a,b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0))[0];
    if (!build) return;
    show(build);
    try { localStorage.setItem(cacheKey, JSON.stringify({ ...build, savedAt: Date.now() })); } catch (_) {}
  }).catch(() => { /* The verified build embedded in the page remains usable. */ });
})();
