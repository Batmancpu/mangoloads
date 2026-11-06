(() => {
  "use strict";

  const grid = document.getElementById("downloadGrid");
  const status = document.getElementById("releaseStatus");
  const empty = document.getElementById("noDownloads");
  const cacheKey = "mangoloads.release-data.v2";
  const cacheMaxAge = 20 * 60 * 1000;
  let apps = [];
  let activeFilter = "all";

  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));

  function formatSize(bytes) {
    if (!bytes || bytes <= 0) return "";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function formatDate(value) {
    if (!value) return "No release date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return new Intl.DateTimeFormat("en-IN", {
      day:"numeric", month:"short", year:"numeric", timeZone:"Asia/Kolkata"
    }).format(date);
  }

  function formatCheckedAt(value) {
    const date = value ? new Date(value) : new Date();
    return new Intl.DateTimeFormat("en-IN", {
      hour:"2-digit", minute:"2-digit", timeZone:"Asia/Kolkata"
    }).format(date) + " IST";
  }

  function renderCard(app) {
    const hasApk = Boolean(app.assetUrl && app.assetName);
    const isPreview = Boolean(app.prerelease);
    const badgeText = hasApk ? (isPreview ? "Pre-release" : "Release build") : "No APK published";
    const badgeClass = hasApk ? (isPreview ? "preview" : "stable") : "";
    const iconImage = app.iconUrl
      ? '<img src="' + escapeHtml(app.iconUrl) + '" alt="" loading="lazy" onload="this.nextElementSibling.hidden=true" onerror="this.remove()">'
      : "";
    const version = app.releaseTag ? escapeHtml(app.releaseTag) : "Awaiting a release";
    const published = app.publishedAt ? formatDate(app.publishedAt) : "Not published";
    const size = app.assetBytes ? formatSize(app.assetBytes) : "—";
    const source = app.repositoryUrl || ("https://github.com/Batmancpu/" + encodeURIComponent(app.repository || ""));
    const releaseUrl = app.releaseUrl || source;
    const button = hasApk
      ? '<a class="button primary" href="' + escapeHtml(app.assetUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="Download latest ' + escapeHtml(app.title) + ' APK"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 17v3h14v-3"/></svg>Download APK</a>'
      : '<span class="download-unavailable">No APK attached</span>';
    const extraNote = app.note ? '<p class="download-description">' + escapeHtml(app.note) + '</p>' : '<p class="download-description">' + escapeHtml(app.description || "") + '</p>';

    return '<article class="download-card fade-up visible" id="' + escapeHtml(app.id) + '" data-category="' + escapeHtml(app.category || app.kind || "community") + '" data-search="' + escapeHtml([app.title,app.subtitle,app.description,app.repository,app.releaseTag,app.note].join(" ").toLowerCase()) + '">' +
      '<div class="download-head">' +
        '<div class="download-icon">' + iconImage + '<span>' + escapeHtml(app.initial || "m.") + '</span></div>' +
        '<div class="download-heading"><h2>' + escapeHtml(app.title) + '</h2><p>' + escapeHtml(app.subtitle || "") + '</p></div>' +
        '<span class="release-badge ' + badgeClass + '">' + badgeText + '</span>' +
      '</div>' +
      extraNote +
      '<div class="release-info"><span>Version <strong>' + version + '</strong></span><span>Published <strong>' + escapeHtml(published) + '</strong></span><span>File <strong>' + escapeHtml(size) + '</strong></span></div>' +
      '<div class="download-actions">' + button +
        '<a class="text-link" href="' + escapeHtml(releaseUrl) + '" target="_blank" rel="noopener noreferrer">Release notes ↗</a>' +
        '<a class="text-link" href="' + escapeHtml(source) + '" target="_blank" rel="noopener noreferrer">Source ↗</a>' +
      '</div>' +
    '</article>';
  }

  function render() {
    if (!grid) return;
    const visible = apps.filter(app => activeFilter === "all" || (app.category || app.kind) === activeFilter);
    grid.innerHTML = visible.map(renderCard).join("");
    if (empty) empty.style.display = visible.length ? "none" : "block";
  }

  function chooseLatestRelease(releases) {
    if (!Array.isArray(releases)) return null;
    const candidates = releases
      .filter(release => release && !release.draft && Array.isArray(release.assets))
      .map(release => {
        const apkAssets = release.assets.filter(asset => asset && /\.apk$/i.test(asset.name || "") && asset.browser_download_url);
        if (!apkAssets.length) return null;
        apkAssets.sort((a,b) => (b.size || 0) - (a.size || 0));
        return { release, asset: apkAssets[0] };
      })
      .filter(Boolean)
      .sort((a,b) => {
        const dateA = Date.parse(a.release.published_at || a.release.created_at || "") || 0;
        const dateB = Date.parse(b.release.published_at || b.release.created_at || "") || 0;
        return dateB - dateA;
      });
    return candidates[0] || null;
  }

  async function refreshFromGitHub() {
    if (!apps.length) return;
    const now = Date.now();
    let cached = null;
    try {
      cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    } catch (_) {}
    if (cached && cached.savedAt && now - cached.savedAt < cacheMaxAge && Array.isArray(cached.apps)) {
      apps = cached.apps;
      render();
      if (status) status.textContent = "GitHub releases checked " + formatCheckedAt(cached.checkedAt) + " · cached";
      return;
    }

    if (status) status.textContent = "Checking GitHub for the latest APKs…";
    const results = await Promise.allSettled(apps.map(async app => {
      if (!app.repository) return app;
      const endpoint = "https://api.github.com/repos/Batmancpu/" + encodeURIComponent(app.repository) + "/releases?per_page=100";
      const response = await fetch(endpoint, {
        headers: { "Accept":"application/vnd.github+json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("GitHub returned " + response.status);
      const releases = await response.json();
      const latest = chooseLatestRelease(releases);
      if (!latest) {
        if (Array.isArray(releases) && releases.length === 0) {
          return Object.assign({}, app, {
            releaseTag:"", releaseTitle:"No GitHub Release found", publishedAt:"",
            assetName:"", assetUrl:"", assetBytes:0,
            releaseUrl:app.releaseUrl || app.repositoryUrl
          });
        }
        return app;
      }
      const release = latest.release;
      return Object.assign({}, app, {
        releaseTag:release.tag_name || app.releaseTag,
        releaseTitle:release.name || release.tag_name || app.releaseTitle,
        publishedAt:release.published_at || release.created_at || app.publishedAt,
        prerelease:Boolean(release.prerelease),
        assetName:latest.asset.name,
        assetUrl:latest.asset.browser_download_url,
        assetBytes:latest.asset.size || 0,
        releaseUrl:release.html_url || app.releaseUrl
      });
    }));

    let successCount = 0;
    const refreshed = apps.map((app,index) => {
      const result = results[index];
      if (result.status === "fulfilled") {
        successCount += 1;
        return result.value;
      }
      return app;
    });
    apps = refreshed;
    render();

    const checkedAt = new Date().toISOString();
    if (successCount > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ savedAt:Date.now(), checkedAt, apps }));
      } catch (_) {}
      if (status) status.textContent = "Release information checked " + formatCheckedAt(checkedAt) + " · live from GitHub";
    } else {
      if (status) status.textContent = "Showing the last verified release list · GitHub could not be reached";
    }
  }

  document.querySelectorAll("[data-download-filter]").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.downloadFilter || "all";
      document.querySelectorAll("[data-download-filter]").forEach(item => item.classList.toggle("active", item === button));
      render();
    });
  });

  fetch("downloads.json", { cache:"no-cache" })
    .then(response => {
      if (!response.ok) throw new Error("Could not load the download manifest");
      return response.json();
    })
    .then(manifest => {
      apps = Array.isArray(manifest.apps) ? manifest.apps : [];
      render();
      refreshFromGitHub();
    })
    .catch(() => {
      if (status) status.textContent = "The download manifest could not be loaded. Open the source repository for release files.";
      if (empty) empty.style.display = "block";
    });
})();