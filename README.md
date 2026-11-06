# MangoLoads

A responsive home for Batmancpu's Android apps, open-source builds and experiments.

**Website:** https://batmancpu.github.io/mangoloads/

## Pages

- **Home** — project overview, featured brrrNews section, project catalogue and studio approach.
- **Downloads** — APK catalogue with direct GitHub asset links, release dates, versions, file sizes and clear preview/fork labels.

## Design and implementation

- Dark Liquid Glass visual language with a saved light/dark theme toggle.
- Responsive layouts for phones, tablets and desktop.
- Editorial, product-led homepage with CSS-rendered app preview.
- Searchable and filterable project collection.
- Download metadata starts from `downloads.json`, then refreshes from the GitHub Releases API in the visitor's browser.
- Newest APK is selected by actual release publication date, not GitHub's `/releases/latest` shortcut. This matters for repositories whose latest-release marker is stale or whose newest builds are pre-releases.
- A local browser cache avoids repeatedly requesting GitHub release metadata; the fallback manifest keeps the page useful when the API is unavailable.
- Static HTML, CSS and JavaScript. No framework, build step, tracking script, backend, database or paid API.

## Public repositories represented

| Project | Repository | Relationship |
|---|---|---|
| brrrNews | [CurrentLens](https://github.com/Batmancpu/CurrentLens) | Original project |
| expBoard | [expmango](https://github.com/Batmancpu/expmango) | Original project |
| Liquid Lab | [liquid](https://github.com/Batmancpu/liquid) | Original experiment |
| brrrBoard / FrostKeys | [brrrBoard](https://github.com/Batmancpu/brrrBoard) | Fork and customisation |
| Dictate Keyboard | [Dictator-](https://github.com/Batmancpu/Dictator-) | Compiled upstream project |
| Metrolist Fluid | [Metrolist](https://github.com/Batmancpu/Metrolist) | Fork |
| BitChord FC | [Bitchordfc](https://github.com/Batmancpu/Bitchordfc) | Fork |
| AfuseKt | [InfuseKt-release](https://github.com/Batmancpu/InfuseKt-release) | Release archive fork |

Private repositories are intentionally excluded. Upstream projects, names, trademarks, source code and assets remain with their respective authors.

## Updating the download list

Edit `downloads.json` to change the fallback information or add/remove a project. The live page queries public GitHub releases and chooses the newest non-draft release containing an `.apk` asset. If GitHub's API is rate-limited or unavailable, the last verified fallback entries remain visible.

A project without an APK asset is displayed with a repository link and a clear no-download status; it is not given a made-up download URL.

## Publishing

GitHub Pages serves the repository root. The configured Pages source is the `main` branch and `/(root)` folder.

No custom domain is configured. The default project URL is:

https://batmancpu.github.io/mangoloads/

## Safety and attribution

Preview, debug and pre-release APKs are labelled. The Downloads page warns users that personal forks and compiled builds are not necessarily endorsed by upstream maintainers. Keyboard applications can process sensitive text; users should verify the source and signing identity before installation.

## Files

- `index.html` — homepage
- `downloads.html` — downloads catalogue
- `styles.css` — shared responsive visual system
- `site.js` — homepage interactions and theme preference
- `downloads.js` — latest release lookup and download cards
- `downloads.json` — verified fallback download metadata
- `favicon.svg` — MangoLoads icon
- `.nojekyll` — static-site marker
